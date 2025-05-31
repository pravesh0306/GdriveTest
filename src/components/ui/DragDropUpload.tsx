import React, { useState, useCallback } from 'react';
import { Upload, Cloud, AlertCircle, CheckCircle } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { useGoogleAuth } from '../../contexts/GoogleAuthContext';
import { useNotification } from './Notifications';
import { useLoading } from './LoadingBar';
import Button from './Button';
import { validateFiles, FileValidationOptions, DEFAULT_ALLOWED_TYPES, formatFileSize } from '../../utils/fileValidation';
import BatchUploadProgress, { BatchUploadItem } from './BatchUploadProgress';

interface DragDropUploadProps {
  onUpload: (files: File[]) => void;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  maxFiles?: number;
  enableBatchProgress?: boolean;
}

// Dynamically import upload logic for code-splitting
const uploadFileModule = () => import('../../utils/googleDriveService');

const DragDropUpload: React.FC<DragDropUploadProps> = ({
  onUpload,
  maxSize = 10,
  acceptedTypes = DEFAULT_ALLOWED_TYPES,
  maxFiles = 10,
  enableBatchProgress = true
}) => {
  const { isAuthenticated, login } = useGoogleAuth();
  const { showNotification } = useNotification();
  const { startLoading, updateProgress, stopLoading } = useLoading();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [batchItems, setBatchItems] = useState<BatchUploadItem[]>([]);
  const [showBatchProgress, setShowBatchProgress] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const validateFile = useCallback((file: File): boolean => {
    const options: FileValidationOptions = {
      maxSize,
      allowedTypes: acceptedTypes,
      maxFiles,
      requireValidExtension: true
    };

    try {
      const { validFiles, invalidFiles, warnings } = validateFiles([file], options);
      
      if (invalidFiles.length > 0) {
        setError(invalidFiles[0].error);
        return false;
      }
      
      if (warnings.length > 0) {
        warnings.forEach(({ warnings: fileWarnings }) => {
          fileWarnings.forEach(warning => {
            showNotification({
              type: 'warning',
              message: warning
            });
          });
        });
      }
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Validation failed');
      return false;
    }
  }, [maxSize, acceptedTypes, maxFiles, showNotification]);

  const processFiles = async (files: FileList | File[]) => {
    setError(null);
    setIsUploading(true);
    const processedFiles: File[] = [];
    const totalFiles = files.length;
    let validFilesCount = 0;

    try {
      // Validate all files first
      const options: FileValidationOptions = {
        maxSize,
        allowedTypes: acceptedTypes,
        maxFiles,
        requireValidExtension: true
      };

      const { validFiles, invalidFiles, warnings } = validateFiles(Array.from(files), options);
      validFilesCount = validFiles.length;

      // Show validation errors
      if (invalidFiles.length > 0) {
        invalidFiles.forEach(({ file, error }) => {
          showNotification({
            type: 'error',
            message: `${file.name}: ${error}`
          });
        });
      }

      // Show warnings
      if (warnings.length > 0) {
        warnings.forEach(({ file, warnings: fileWarnings }) => {
          fileWarnings.forEach(warning => {
            showNotification({
              type: 'warning',
              message: `${file.name}: ${warning}`
            });
          });
        });
      }

      if (validFiles.length === 0) {
        setIsUploading(false);
        return;
      }

      // Setup batch progress tracking
      if (enableBatchProgress && validFiles.length > 1) {
        const initialBatchItems: BatchUploadItem[] = validFiles.map((file: File) => ({
          id: `${Date.now()}-${Math.random()}`,
          file,
          status: 'pending',
          progress: 0
        }));
        setBatchItems(initialBatchItems);
        setShowBatchProgress(true);
      } else {
        // Use regular loading bar for single files
        startLoading({
          color: '#4f46e5',
          showPercentage: true,
          onCancel: () => {
            stopLoading();
            setIsUploading(false);
            showNotification({
              type: 'info',
              message: 'Upload cancelled'
            });
          }
        });
      }

      // If not authenticated, trigger login and wait for it
      if (!isAuthenticated) {
        await new Promise<void>((resolve) => {
          const onAuth = () => {
            if (typeof window !== 'undefined') {
              window.removeEventListener('google-auth-success', onAuth);
            }
            resolve();
          };
          if (typeof window !== 'undefined') {
            window.addEventListener('google-auth-success', onAuth);
          }
          login();
        });
      }

      let processedCount = 0;

      for (const [index, file] of validFiles.entries()) {
        const itemId = enableBatchProgress && validFiles.length > 1 
          ? batchItems.find(item => item.file === file)?.id 
          : null;

        // Update batch item status
        if (itemId) {
          setBatchItems(prev => prev.map(item => 
            item.id === itemId 
              ? { ...item, status: 'uploading' as const }
              : item
          ));
        }

        let processedFile = file;
        
        // Compress images
        if (file.type.startsWith('image/')) {
          try {
            processedFile = await imageCompression(file, {
              maxSizeMB: maxSize,
              maxWidthOrHeight: 1920,
              onProgress: (progress: number) => {
                if (itemId) {
                  setBatchItems(prev => prev.map(item => 
                    item.id === itemId 
                      ? { ...item, progress: progress * 0.5 } // Compression is 50% of total progress
                      : item
                  ));
                } else {
                  updateProgress(((processedCount + progress * 0.5) / totalFiles) * 100);
                }
              }
            });
          } catch (compressionError) {
            console.warn('Image compression failed, using original file:', compressionError);
            processedFile = file;
          }
        }

        try {
          // Upload to Google Drive
          const { driveService } = await uploadFileModule();
          const driveUrl = await driveService.uploadFile(processedFile, {
            onProgress: (progress: number) => {
              if (itemId) {
                setBatchItems(prev => prev.map(item => 
                  item.id === itemId 
                    ? { ...item, progress: 50 + (progress * 0.5) } // Upload is remaining 50%
                    : item
                ));
              } else {
                updateProgress(((processedCount + 0.5 + progress * 0.5) / totalFiles) * 100);
              }
            }
          });

          // Add the Google Drive URL to the file object
          Object.defineProperty(processedFile, 'driveUrl', {
            value: driveUrl,
            writable: false
          });

          // Update batch item status
          if (itemId) {
            setBatchItems(prev => prev.map(item => 
              item.id === itemId 
                ? { 
                    ...item, 
                    status: 'completed' as const, 
                    progress: 100,
                    driveUrl,
                    uploadedAt: new Date().toISOString()
                  }
                : item
            ));
          }

          showNotification({
            type: 'success',
            message: `${file.name} uploaded successfully`
          });

        } catch (err) {
          console.error('Error uploading to Google Drive:', err);
          const errorMessage = err instanceof Error ? err.message : 'Upload failed';
          
          // Update batch item status
          if (itemId) {
            setBatchItems(prev => prev.map(item => 
              item.id === itemId 
                ? { 
                    ...item, 
                    status: 'failed' as const,
                    error: errorMessage
                  }
                : item
            ));
          }

          showNotification({
            type: 'error',
            message: `Failed to upload ${file.name}: ${errorMessage}`
          });
        }

        processedFiles.push(processedFile);
        processedCount++;
        
        // Update overall progress for single file uploads
        if (!enableBatchProgress || validFiles.length === 1) {
          updateProgress((processedCount / validFiles.length) * 100);
        }
      }

      if (processedFiles.length > 0) {
        onUpload(processedFiles);
        showNotification({
          type: 'success',
          message: `Successfully processed ${processedFiles.length} of ${totalFiles} files`
        });
      }

    } catch (err) {
      console.error('Error processing files:', err);
      showNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Error processing files'
      });
    } finally {
      if (!enableBatchProgress || validFilesCount === 1) {
        stopLoading();
      }
      setIsUploading(false);
    }
  };

  const handleBatchCancel = useCallback((itemId: string) => {
    setBatchItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, status: 'cancelled' as const }
        : item
    ));
    showNotification({
      type: 'info',
      message: 'Upload cancelled'
    });
  }, [showNotification]);

  const handleBatchRetry = useCallback(async (itemId: string) => {
    const item = batchItems.find(i => i.id === itemId);
    if (!item) return;

    setBatchItems(prev => prev.map(i => 
      i.id === itemId 
        ? { ...i, status: 'uploading' as const, progress: 0, error: undefined }
        : i
    ));

    try {
      const { driveService } = await uploadFileModule();
      const driveUrl = await driveService.uploadFile(item.file, {
        onProgress: (progress: number) => {
          setBatchItems(prev => prev.map(i => 
            i.id === itemId 
              ? { ...i, progress }
              : i
          ));
        }
      });

      Object.defineProperty(item.file, 'driveUrl', {
        value: driveUrl,
        writable: false
      });

      setBatchItems(prev => prev.map(i => 
        i.id === itemId 
          ? { 
              ...i, 
              status: 'completed' as const, 
              progress: 100,
              driveUrl,
              uploadedAt: new Date().toISOString()
            }
          : i
      ));

      showNotification({
        type: 'success',
        message: `${item.file.name} uploaded successfully`
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setBatchItems(prev => prev.map(i => 
        i.id === itemId 
          ? { ...i, status: 'failed' as const, error: errorMessage }
          : i
      ));

      showNotification({
        type: 'error',
        message: `Failed to upload ${item.file.name}: ${errorMessage}`
      });
    }
  }, [batchItems, showNotification]);

  const handleCloseBatchProgress = useCallback(() => {
    setShowBatchProgress(false);
    setBatchItems([]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const { files } = e.dataTransfer;
    if (files && files.length > 0) {
      processFiles(files);
    }
  }, [onUpload]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      processFiles(Array.from(files));
    }
  };

  return (
    <div className="space-y-4">
      {!isAuthenticated && (
        <div className="text-center p-4 bg-slate-700/80 rounded-lg border border-indigo-500 shadow-lg">
          <p className="mb-2 text-white font-medium">Connect to Google Drive to enable file storage</p>
          
          <div className="mb-3">
            <Button
              variant="primary"
              onClick={() => {
                console.log('Google Drive connect button clicked');
                // Log state before login attempt
                console.log('Environment:', import.meta.env.MODE);
                console.log('Client ID available:', !!import.meta.env.VITE_GOOGLE_CLIENT_ID);
                login();
              }}
              icon={<Upload className="mr-2 h-4 w-4" />}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 animate-pulse"
            >
              Connect Google Drive
            </Button>
          </div>
          
          <p className="text-xs text-slate-300 mt-2">
            By connecting to Google Drive, you agree to our <a href="/terms" className="text-indigo-400 hover:text-indigo-300 underline">Terms of Service</a> and Google's Terms of Service.
          </p>
          
          <div className="text-xs text-slate-300 opacity-75">
            {import.meta.env.VITE_GOOGLE_CLIENT_ID ? 
              `Auth configured with client ID: ${import.meta.env.VITE_GOOGLE_CLIENT_ID.substring(0, 10)}...` : 
              'No client ID available'}
          </div>
        </div>
      )}

      <div
        className={`border-2 border-dashed rounded-lg p-6 transition-colors
          ${isDragging ? 'border-indigo-500 bg-indigo-50/5' : 'border-slate-600'}
          ${error ? 'border-red-500' : ''}
          ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-slate-400" />
          <div className="mt-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="mt-2 text-sm font-medium text-indigo-400 hover:text-indigo-300">
                Upload files
              </span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                multiple
                onChange={handleFileInput}
                accept={acceptedTypes.join(',')}
                disabled={isUploading}
              />
            </label>
            <p className="mt-1 text-xs text-slate-400">
              {isUploading ? 'Uploading...' : `Drag & drop or click to upload • Max ${maxSize}MB`}
            </p>
            {error && (
              <p className="mt-2 text-sm text-red-500">{error}</p>
            )}
          </div>
        </div>
      </div>

      {/* Batch Upload Progress */}
      <BatchUploadProgress
        items={batchItems}
        isVisible={showBatchProgress}
        onCancel={handleBatchCancel}
        onRetry={handleBatchRetry}
        onClose={handleCloseBatchProgress}
      />
    </div>
  );
};

export default DragDropUpload;
