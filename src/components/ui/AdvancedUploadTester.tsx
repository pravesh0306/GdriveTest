import React, { useState, useCallback } from 'react';
import { 
  Upload, 
  File, 
  Trash2, 
  Play, 
  Pause, 
  X, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Zap,
  HardDrive
} from 'lucide-react';
import Button from './Button';
import { useGoogleAuth } from '../../contexts/GoogleAuthContext';

interface UploadTask {
  id: string;
  file: File;
  status: 'pending' | 'uploading' | 'paused' | 'completed' | 'error';
  progress: number;
  speed: number; // bytes per second
  startTime?: number;
  endTime?: number;
  url?: string;
  error?: string;
}

interface UploadStats {
  totalFiles: number;
  completedFiles: number;
  failedFiles: number;
  totalBytes: number;
  uploadedBytes: number;
  averageSpeed: number;
  estimatedTimeRemaining: number;
}

const AdvancedUploadTester: React.FC = () => {
  const [uploadTasks, setUploadTasks] = useState<UploadTask[]>([]);
  const [stats, setStats] = useState<UploadStats>({
    totalFiles: 0,
    completedFiles: 0,
    failedFiles: 0,
    totalBytes: 0,
    uploadedBytes: 0,
    averageSpeed: 0,
    estimatedTimeRemaining: 0
  });
  const [isUploading, setIsUploading] = useState(false);
  const [concurrentUploads, setConcurrentUploads] = useState(3);
  const [autoRetry, setAutoRetry] = useState(true);
  const [maxRetries] = useState(3);

  const { isAuthenticated, uploadFile, login } = useGoogleAuth();

  const addFiles = useCallback((files: FileList) => {
    const newTasks: UploadTask[] = Array.from(files).map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      status: 'pending',
      progress: 0,
      speed: 0
    }));

    setUploadTasks(prev => [...prev, ...newTasks]);
    
    const totalBytes = Array.from(files).reduce((sum, file) => sum + file.size, 0);
    setStats(prev => ({
      ...prev,
      totalFiles: prev.totalFiles + files.length,
      totalBytes: prev.totalBytes + totalBytes
    }));
  }, []);

  const removeTask = useCallback((taskId: string) => {
    setUploadTasks(prev => {
      const task = prev.find(t => t.id === taskId);
      if (task) {
        setStats(prevStats => ({
          ...prevStats,
          totalFiles: prevStats.totalFiles - 1,
          totalBytes: prevStats.totalBytes - task.file.size
        }));
      }
      return prev.filter(t => t.id !== taskId);
    });
  }, []);

  const clearCompleted = useCallback(() => {
    setUploadTasks(prev => prev.filter(t => t.status !== 'completed'));
  }, []);

  const clearAll = useCallback(() => {
    setUploadTasks([]);
    setStats({
      totalFiles: 0,
      completedFiles: 0,
      failedFiles: 0,
      totalBytes: 0,
      uploadedBytes: 0,
      averageSpeed: 0,
      estimatedTimeRemaining: 0
    });
  }, []);

  const simulateUpload = async (task: UploadTask): Promise<void> => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const fileSize = task.file.size;
      let uploadedBytes = 0;
      
      const updateProgress = () => {
        if (task.status === 'paused') {
          setTimeout(updateProgress, 100);
          return;
        }

        if (task.status === 'uploading') {
          const elapsed = Date.now() - startTime;
          const speed = Math.random() * 2000000 + 500000; // 0.5MB - 2.5MB per second
          const increment = (speed / 10); // Update every 100ms
          
          uploadedBytes = Math.min(uploadedBytes + increment, fileSize);
          const progress = (uploadedBytes / fileSize) * 100;
          
          setUploadTasks(prev => prev.map(t => 
            t.id === task.id 
              ? { ...t, progress, speed, startTime }
              : t
          ));

          if (progress >= 100) {
            // Simulate actual upload attempt
            if (isAuthenticated && Math.random() > 0.1) { // 90% success rate
              setUploadTasks(prev => prev.map(t => 
                t.id === task.id 
                  ? { 
                      ...t, 
                      status: 'completed', 
                      progress: 100, 
                      endTime: Date.now(),
                      url: `https://drive.google.com/file/d/${Math.random().toString(36).substr(2, 20)}/view`
                    }
                  : t
              ));
              
              setStats(prev => ({
                ...prev,
                completedFiles: prev.completedFiles + 1,
                uploadedBytes: prev.uploadedBytes + fileSize
              }));
              
              resolve();
            } else {
              // Simulate failure
              setUploadTasks(prev => prev.map(t => 
                t.id === task.id 
                  ? { 
                      ...t, 
                      status: 'error', 
                      error: isAuthenticated ? 'Network timeout' : 'Authentication required'
                    }
                  : t
              ));
              
              setStats(prev => ({
                ...prev,
                failedFiles: prev.failedFiles + 1
              }));
              
              reject(new Error(isAuthenticated ? 'Network timeout' : 'Authentication required'));
            }
          } else {
            setTimeout(updateProgress, 100);
          }
        }
      };

      setUploadTasks(prev => prev.map(t => 
        t.id === task.id ? { ...t, status: 'uploading' } : t
      ));
      
      updateProgress();
    });
  };

  const startUploads = async () => {
    if (!isAuthenticated) {
      login();
      return;
    }

    setIsUploading(true);
    const pendingTasks = uploadTasks.filter(t => t.status === 'pending' || t.status === 'error');
    
    const processBatch = async (tasks: UploadTask[]) => {
      const batch = tasks.slice(0, concurrentUploads);
      const remaining = tasks.slice(concurrentUploads);
      
      if (batch.length === 0) return;
      
      const promises = batch.map(task => 
        simulateUpload(task).catch(error => {
          console.error(`Upload failed for ${task.file.name}:`, error);
        })
      );
      
      await Promise.all(promises);
      
      if (remaining.length > 0) {
        await processBatch(remaining);
      }
    };

    try {
      await processBatch(pendingTasks);
    } finally {
      setIsUploading(false);
    }
  };

  const pauseUpload = (taskId: string) => {
    setUploadTasks(prev => prev.map(t => 
      t.id === taskId && t.status === 'uploading' 
        ? { ...t, status: 'paused' }
        : t
    ));
  };

  const resumeUpload = (taskId: string) => {
    setUploadTasks(prev => prev.map(t => 
      t.id === taskId && t.status === 'paused' 
        ? { ...t, status: 'uploading' }
        : t
    ));
  };

  const retryUpload = async (taskId: string) => {
    const task = uploadTasks.find(t => t.id === taskId);
    if (task && task.status === 'error') {
      setUploadTasks(prev => prev.map(t => 
        t.id === taskId 
          ? { ...t, status: 'pending', progress: 0, error: undefined }
          : t
      ));
      
      // Start the upload for this specific task
      try {
        await simulateUpload(task);
      } catch (error) {
        console.error('Retry failed:', error);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const { files } = e.dataTransfer;
    if (files && files.length > 0) {
      addFiles(files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      addFiles(files);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatSpeed = (bytesPerSecond: number) => {
    return formatBytes(bytesPerSecond) + '/s';
  };

  const getStatusIcon = (status: UploadTask['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'uploading':
        return <Upload className="w-4 h-4 text-blue-500 animate-pulse" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const overallProgress = stats.totalBytes > 0 ? (stats.uploadedBytes / stats.totalBytes) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Upload Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Files</span>
            <File className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            {stats.completedFiles} / {stats.totalFiles}
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Data Transfer</span>
            <HardDrive className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            {formatBytes(stats.uploadedBytes)} / {formatBytes(stats.totalBytes)}
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Average Speed</span>
            <Zap className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            {formatSpeed(stats.averageSpeed)}
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Failed</span>
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            {stats.failedFiles}
          </p>
        </div>
      </div>

      {/* Overall Progress */}
      {stats.totalFiles > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Overall Progress</span>
            <span className="text-sm text-slate-500">{overallProgress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="file"
          multiple
          onChange={handleFileInput}
          className="hidden"
          id="file-input"
        />
        <label htmlFor="file-input">
          <Button variant="outline" className="cursor-pointer">
            <File className="w-4 h-4 mr-2" />
            Add Files
          </Button>
        </label>

        <Button
          onClick={startUploads}
          disabled={uploadTasks.length === 0 || isUploading || !isAuthenticated}
          variant="primary"
        >
          <Play className="w-4 h-4 mr-2" />
          Start Upload
        </Button>

        <Button
          onClick={clearCompleted}
          disabled={uploadTasks.filter(t => t.status === 'completed').length === 0}
          variant="outline"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Clear Completed
        </Button>

        <Button
          onClick={clearAll}
          disabled={uploadTasks.length === 0}
          variant="ghost"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All
        </Button>

        <div className="flex items-center gap-2 ml-auto">
          <label className="text-sm text-slate-600 dark:text-slate-400">
            Concurrent:
          </label>
          <select
            value={concurrentUploads}
            onChange={(e) => setConcurrentUploads(Number(e.target.value))}
            className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-sm"
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>
      </div>

      {!isAuthenticated && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Connect to Google Drive to enable uploads
            </span>
            <Button
              onClick={login}
              variant="outline"
              size="sm"
              className="ml-auto"
            >
              Connect
            </Button>
          </div>
        </div>
      )}

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={(e) => e.preventDefault()}
        className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center hover:border-blue-400 dark:hover:border-blue-400 transition-colors"
      >
        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">
          Drop files here to add to upload queue
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500">
          Or click "Add Files" to browse
        </p>
      </div>

      {/* Upload Tasks List */}
      {uploadTasks.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Upload Queue</h3>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {uploadTasks.map((task) => (
              <div key={task.id} className="p-4 border-b border-slate-100 dark:border-slate-700 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(task.status)}
                    <span className="font-medium text-slate-900 dark:text-white truncate max-w-xs">
                      {task.file.name}
                    </span>
                    <span className="text-sm text-slate-500">
                      ({formatBytes(task.file.size)})
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {task.status === 'uploading' && (
                      <Button
                        onClick={() => pauseUpload(task.id)}
                        variant="ghost"
                        size="sm"
                      >
                        <Pause className="w-4 h-4" />
                      </Button>
                    )}
                    
                    {task.status === 'paused' && (
                      <Button
                        onClick={() => resumeUpload(task.id)}
                        variant="ghost"
                        size="sm"
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    )}
                    
                    {task.status === 'error' && (
                      <Button
                        onClick={() => retryUpload(task.id)}
                        variant="ghost"
                        size="sm"
                      >
                        <Upload className="w-4 h-4" />
                      </Button>
                    )}
                    
                    <Button
                      onClick={() => removeTask(task.id)}
                      variant="ghost"
                      size="sm"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Progress Bar */}
                {(task.status === 'uploading' || task.status === 'paused' || task.status === 'completed') && (
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>{task.progress.toFixed(1)}%</span>
                      {task.speed > 0 && (
                        <span>{formatSpeed(task.speed)}</span>
                      )}
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          task.status === 'completed' ? 'bg-green-500' :
                          task.status === 'paused' ? 'bg-yellow-500' :
                          'bg-blue-500'
                        }`}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {/* Error Message */}
                {task.error && (
                  <div className="text-sm text-red-600 dark:text-red-400 mt-1">
                    Error: {task.error}
                  </div>
                )}
                
                {/* Success URL */}
                {task.url && (
                  <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                    <a href={task.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      View in Google Drive →
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedUploadTester;
