import React from 'react';
import { AlertCircle } from 'lucide-react';

export const StorageAlertBar: React.FC = () => {
  const totalItems = JSON.parse(localStorage.getItem('orders') || '[]').length;
  const usedStoragePercent = Math.min(100, (totalItems / 100) * 100); // Assuming 100 items is max capacity

  // Only show if we're using more than 80% of storage
  if (usedStoragePercent < 80) {
    return null;
  }

  return (
    <div className="bg-amber-500/20 text-amber-800 dark:text-amber-200 p-2 flex items-center justify-between">
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 mr-2" />
        <span className="text-sm">
          Local storage is {usedStoragePercent.toFixed(0)}% full. Consider exporting your data.
        </span>
      </div>
      <button className="text-xs bg-amber-600 text-white px-2 py-1 rounded-md hover:bg-amber-700">
        Learn More
      </button>
    </div>
  );
};
