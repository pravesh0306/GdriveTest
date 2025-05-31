import React from 'react';
import { Sun, Moon, Menu } from 'lucide-react';

interface DashboardHeaderProps {
  onToggleSidebar: () => void;
  onToggleDarkMode: () => void;
  darkMode: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  onToggleSidebar, 
  onToggleDarkMode, 
  darkMode 
}) => {
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
      <div className="flex justify-between items-center">
        {/* Left side - Logo and mobile menu */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Fashion Orders
            </h1>
          </div>
        </div>

        {/* Right side - Theme toggle */}
        <div className="flex items-center space-x-4">
          <div className="flex rounded-full bg-slate-100 dark:bg-slate-700 p-1">
            <button
              onClick={() => onToggleDarkMode()}
              className={`p-2 rounded-full ${!darkMode ? 'bg-white shadow-sm' : ''} transition-colors`}
            >
              <Sun className="h-5 w-5 text-amber-500" />
              <span className="sr-only">Light Mode</span>
            </button>
            <button
              onClick={() => onToggleDarkMode()}
              className={`p-2 rounded-full ${darkMode ? 'bg-slate-600 shadow-sm' : ''} transition-colors`}
            >
              <Moon className="h-5 w-5 text-indigo-400" />
              <span className="sr-only">Dark Mode</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
