import React from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';
import Button from './Button';

interface FileRemovalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fileName: string;
  hasGoogleDriveUrl?: boolean;
  isUploaded?: boolean;
}

const FileRemovalDialog: React.FC<FileRemovalDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  fileName,
  hasGoogleDriveUrl = false,
  isUploaded = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Remove File
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            Are you sure you want to remove <strong>"{fileName}"</strong> from this order?
          </p>
          
          {hasGoogleDriveUrl && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    File uploaded to Google Drive
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    This file has been uploaded to your Google Drive. Removing it from this order will not delete it from Google Drive.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {isUploaded && !hasGoogleDriveUrl && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    Upload in progress
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    This file may still be uploading. Removing it will cancel the upload process.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            This action cannot be undone. You'll need to re-upload the file if you want to add it back to this order.
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Remove File
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FileRemovalDialog;
