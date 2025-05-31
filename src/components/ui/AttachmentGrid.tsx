import React, { useState } from 'react';
import { X, Download, Eye } from 'lucide-react';
import FileRemovalDialog from './FileRemovalDialog';
import { formatFileSize, getFileTypeIcon } from '../../utils/fileValidation';

interface Attachment {
  name: string;
  size: string;
  type: string;
  url?: string;
  file?: File;
}

interface AttachmentGridProps {
  attachments: Attachment[];
  onRemove: (index: number) => void;
}

const AttachmentGrid: React.FC<AttachmentGridProps> = ({ attachments, onRemove }) => {
  const [removalDialog, setRemovalDialog] = useState<{
    isOpen: boolean;
    fileIndex: number;
    fileName: string;
    hasGoogleDriveUrl: boolean;
    isUploaded: boolean;
  }>({
    isOpen: false,
    fileIndex: -1,
    fileName: '',
    hasGoogleDriveUrl: false,
    isUploaded: false
  });

  const handleRemoveClick = (index: number, attachment: Attachment) => {
    const driveUrl = (attachment.file as any)?.driveUrl;
    setRemovalDialog({
      isOpen: true,
      fileIndex: index,
      fileName: attachment.name,
      hasGoogleDriveUrl: !!driveUrl,
      isUploaded: !!attachment.url || !!driveUrl
    });
  };

  const handleConfirmRemoval = () => {
    onRemove(removalDialog.fileIndex);
    setRemovalDialog(prev => ({ ...prev, isOpen: false }));
  };

  const handleCloseDialog = () => {
    setRemovalDialog(prev => ({ ...prev, isOpen: false }));
  };
  const handlePreview = (attachment: Attachment) => {
    // Check if file has a Google Drive URL first
    const driveUrl = (attachment.file as any)?.driveUrl;
    if (driveUrl) {
      window.open(driveUrl, '_blank');
    } else if (attachment.url) {
      window.open(attachment.url, '_blank');
    } else if (attachment.file) {
      const objectUrl = URL.createObjectURL(attachment.file);
      window.open(objectUrl);
      // Clean up the URL after opening
      setTimeout(() => URL.revokeObjectURL(objectUrl), 100);
    }
  };

  const handleDownload = (attachment: Attachment) => {
    // Check if file has a Google Drive URL first
    const driveUrl = (attachment.file as any)?.driveUrl;
    if (driveUrl) {
      // Convert view URL to download URL
      const downloadUrl = driveUrl.replace('/view', '/download');
      window.open(downloadUrl, '_blank');
    } else if (attachment.url) {
      const link = document.createElement('a');
      link.href = attachment.url;
      link.download = attachment.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (attachment.file) {
      const objectUrl = URL.createObjectURL(attachment.file);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = attachment.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    }
  };

  if (attachments.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
        No files uploaded yet. Drag and drop files above to get started.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
      {attachments.map((attachment, index) => (
        <div
          key={index}
          className="group relative bg-white dark:bg-slate-700 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600 shadow-sm"
        >
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => handleRemoveClick(index, attachment)}
              className="p-1 bg-red-500 rounded-full text-white hover:bg-red-600 shadow-sm"
              title="Remove file"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          
          <div className="flex flex-col items-center">
            <div 
              className="w-full h-32 bg-slate-100 dark:bg-slate-600 rounded-lg flex items-center justify-center mb-3 cursor-pointer overflow-hidden border border-slate-200 dark:border-slate-500"
              onClick={() => handlePreview(attachment)}
              title="Click to preview"
            >
              {attachment.type.startsWith('image/') ? (
                (() => {
                  const driveUrl = (attachment.file as any)?.driveUrl;
                  const imageUrl = driveUrl ? 
                    `https://drive.google.com/thumbnail?id=${driveUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1]}&sz=w200-h200` :
                    (attachment.url || (attachment.file ? URL.createObjectURL(attachment.file) : ''));
                  
                  return imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={attachment.name}
                      className="max-w-full max-h-full object-contain rounded-lg"
                      onLoad={(e) => {
                        // Only revoke object URLs, not Google Drive URLs
                        if (attachment.file && !driveUrl) {
                          URL.revokeObjectURL((e.target as HTMLImageElement).src);
                        }
                      }}
                      onError={(e) => {
                        // Fallback to file type display if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = document.createElement('div');
                        fallback.className = 'text-2xl text-slate-400 dark:text-slate-500';
                        fallback.textContent = 'IMG';
                        target.parentNode?.appendChild(fallback);
                      }}
                    />
                  ) : (
                    <div className="text-2xl text-slate-400 dark:text-slate-500">IMG</div>
                  );
                })()
              ) : (
                <div className="text-xl font-semibold text-slate-400 dark:text-slate-500">
                  {attachment.type.split('/')[1]?.toUpperCase().slice(0, 4) || 'FILE'}
                </div>
              )}
            </div>
            
            <p className="text-sm font-medium truncate w-full text-center text-slate-700 dark:text-slate-300 mb-1">
              {getFileTypeIcon(attachment.type)} {attachment.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              {formatFileSize(attachment.file?.size || 0)}
            </p>
            
            {/* Upload status indicator */}
            {(attachment.file as any)?.driveUrl && (
              <div className="mb-2 flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Uploaded to Drive</span>
              </div>
            )}
            
            <div className="flex space-x-2 w-full">
              <button
                className="flex-1 px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-md transition-colors flex items-center justify-center gap-1"
                title="Download file"
                onClick={() => handleDownload(attachment)}
              >
                <Download className="h-3 w-3" />
                Download
              </button>
              <button
                className="flex-1 px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded-md transition-colors flex items-center justify-center gap-1"
                title="Preview file"
                onClick={() => handlePreview(attachment)}
              >
                <Eye className="h-3 w-3" />
                Preview
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* File Removal Dialog */}
      <FileRemovalDialog
        isOpen={removalDialog.isOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmRemoval}
        fileName={removalDialog.fileName}
        hasGoogleDriveUrl={removalDialog.hasGoogleDriveUrl}
        isUploaded={removalDialog.isUploaded}
      />
    </div>
  );
};

export default AttachmentGrid;
