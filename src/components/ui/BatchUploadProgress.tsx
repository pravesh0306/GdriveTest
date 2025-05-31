import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Upload, Clock } from 'lucide-react';

export interface BatchUploadItem {
  id: string;
  file: File;
  status: 'pending' | 'uploading' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  error?: string;
  driveUrl?: string;
  uploadedAt?: string;
}

interface BatchUploadProgressProps {
  items: BatchUploadItem[];
  onCancel?: (itemId: string) => void;
  onRetry?: (itemId: string) => void;
  onClose?: () => void;
  isVisible: boolean;
}

const BatchUploadProgress: React.FC<BatchUploadProgressProps> = ({
  items,
  onCancel,
  onRetry,
  onClose,
  isVisible
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  
  const totalItems = items.length;
  const completedItems = items.filter(item => item.status === 'completed').length;
  const failedItems = items.filter(item => item.status === 'failed').length;
  const uploadingItems = items.filter(item => item.status === 'uploading').length;
  const overallProgress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'uploading':
        return <Upload className="h-4 w-4 text-blue-500 animate-bounce" />;
      case 'cancelled':
        return <X className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };
  
  if (!isVisible || totalItems === 0) return null;
  
  return (
    <div className={`fixed bottom-4 right-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 max-h-96'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-blue-500" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-200">
            Upload Progress
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {completedItems}/{totalItems} completed
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            <div className={`w-3 h-0.5 bg-slate-600 dark:bg-slate-400 transition-transform ${
              isMinimized ? 'rotate-90' : ''
            }`} />
          </button>
          {completedItems === totalItems && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-500 hover:text-slate-700"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      
      {/* Overall Progress */}
      <div className="p-4">
        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
          <span>Overall Progress</span>
          <span>{Math.round(overallProgress)}%</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        
        {failedItems > 0 && (
          <div className="mt-2 text-xs text-red-600 dark:text-red-400">
            {failedItems} file(s) failed to upload
          </div>
        )}
      </div>
      
      {/* Individual Items */}
      {!isMinimized && (
        <div className="max-h-64 overflow-y-auto border-t border-slate-200 dark:border-slate-700">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-750 border-b border-slate-100 dark:border-slate-700 last:border-b-0"
            >
              <div className="flex-shrink-0">
                {getStatusIcon(item.status)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                    {item.file.name}
                  </p>
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                    {formatFileSize(item.file.size)}
                  </span>
                </div>
                
                {item.status === 'uploading' && (
                  <div className="mt-1">
                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-1">
                      <div
                        className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {item.error && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1 truncate">
                    {item.error}
                  </p>
                )}
                
                {item.status === 'completed' && item.uploadedAt && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    Uploaded at {new Date(item.uploadedAt).toLocaleTimeString()}
                  </p>
                )}
              </div>
              
              <div className="flex-shrink-0 flex items-center gap-1">
                {item.status === 'uploading' && onCancel && (
                  <button
                    onClick={() => onCancel(item.id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded text-red-500 hover:text-red-700"
                    title="Cancel upload"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
                
                {item.status === 'failed' && onRetry && (
                  <button
                    onClick={() => onRetry(item.id)}
                    className="px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded"
                    title="Retry upload"
                  >
                    Retry
                  </button>
                )}
                
                {item.status === 'completed' && item.driveUrl && (
                  <button
                    onClick={() => window.open(item.driveUrl, '_blank')}
                    className="px-2 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded"
                    title="View in Google Drive"
                  >
                    View
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Summary Footer (when minimized) */}
      {isMinimized && (
        <div className="px-4 pb-2">
          <div className="text-xs text-slate-600 dark:text-slate-400">
            {uploadingItems > 0 && `${uploadingItems} uploading`}
            {uploadingItems > 0 && (completedItems > 0 || failedItems > 0) && ' • '}
            {completedItems > 0 && `${completedItems} completed`}
            {completedItems > 0 && failedItems > 0 && ' • '}
            {failedItems > 0 && `${failedItems} failed`}
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchUploadProgress;
