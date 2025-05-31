import React from 'react';
import { X, Download, ExternalLink } from 'lucide-react';

interface AttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  attachments: Array<{
    name: string;
    size: number | string;
    type: string;
    driveUrl?: string;
    uploadedAt?: string;
  }>;
  orderInfo: {
    id: string;
    customerName: string;
  };
}

const AttachmentModal: React.FC<AttachmentModalProps> = ({ 
  isOpen, 
  onClose, 
  attachments, 
  orderInfo 
}) => {
  if (!isOpen) return null;

  const formatFileSize = (size: number | string): string => {
    if (typeof size === 'string') return size;
    
    if (size === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.includes('pdf')) return '📄';
    if (type.includes('doc')) return '📝';
    return '📎';
  };

  const handleDownload = (attachment: any) => {
    if (attachment.driveUrl) {
      const downloadUrl = attachment.driveUrl.replace('/view', '/download');
      window.open(downloadUrl, '_blank');
    }
  };

  const handlePreview = (attachment: any) => {
    if (attachment.driveUrl) {
      window.open(attachment.driveUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Order Attachments
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {orderInfo.id} - {orderInfo.customerName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          {attachments.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📎</div>
              <p className="text-slate-500 dark:text-slate-400">
                No attachments found for this order
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {attachments.map((attachment, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="text-2xl flex-shrink-0">
                      {getFileIcon(attachment.type)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 dark:text-white truncate">
                        {attachment.name}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <span>{formatFileSize(attachment.size)}</span>
                        {attachment.uploadedAt && (
                          <>
                            <span>•</span>
                            <span>
                              {new Date(attachment.uploadedAt).toLocaleDateString()}
                            </span>
                          </>
                        )}
                        {attachment.driveUrl && (
                          <>
                            <span>•</span>
                            <span className="text-green-600 dark:text-green-400">
                              ✓ On Drive
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {attachment.driveUrl && (
                      <>
                        <button
                          onClick={() => handlePreview(attachment)}
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md transition-colors flex items-center gap-1"
                          title="Preview file"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Preview
                        </button>
                        <button
                          onClick={() => handleDownload(attachment)}
                          className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded-md transition-colors flex items-center gap-1"
                          title="Download file"
                        >
                          <Download className="w-3 h-3" />
                          Download
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttachmentModal;
