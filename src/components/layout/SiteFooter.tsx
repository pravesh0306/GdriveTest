import React from 'react';

const SiteFooter: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 py-6 px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          &copy; {new Date().getFullYear()} Fashion Order Management. All rights reserved.
        </p>
        <div className="mt-4 sm:mt-0 flex space-x-4">
          <a href="#" className="text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">
            Privacy
          </a>
          <a href="#" className="text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">
            Terms
          </a>
          <a href="#" className="text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
