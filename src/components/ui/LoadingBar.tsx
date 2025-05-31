import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X } from 'lucide-react';

interface LoadingConfig {
  color?: string;
  showPercentage?: boolean;
  onCancel?: () => void;
}

interface LoadingContextType {
  isLoading: boolean;
  progress: number;
  startLoading: (config?: LoadingConfig) => void;
  updateProgress: (progress: number) => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [config, setConfig] = useState<LoadingConfig>({});

  const startLoading = useCallback((loadingConfig?: LoadingConfig) => {
    setIsLoading(true);
    setProgress(0);
    setConfig(loadingConfig || {});
  }, []);

  const updateProgress = useCallback((newProgress: number) => {
    setProgress(Math.min(100, Math.max(0, newProgress)));
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setProgress(0);
    setConfig({});
  }, []);

  const handleCancel = () => {
    if (config.onCancel) {
      config.onCancel();
    }
    stopLoading();
  };

  return (
    <LoadingContext.Provider value={{ isLoading, progress, startLoading, updateProgress, stopLoading }}>
      {children}
      
      {/* Loading Bar */}
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 z-50">
          {/* Progress Bar */}
          <div className="h-1 bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
                backgroundColor: config.color || '#4f46e5',
              }}
            />
          </div>
          
          {/* Progress Indicator */}
          {(config.showPercentage || config.onCancel) && (
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-2 flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-3">
                {config.showPercentage && (
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {Math.round(progress)}%
                  </span>
                )}
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Uploading files...
                </span>
              </div>
              
              {config.onCancel && (
                <button
                  onClick={handleCancel}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
                  title="Cancel upload"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </LoadingContext.Provider>
  );
};
