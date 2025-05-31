import React from 'react';
import { 
  Scissors, 
  PackageSearch, 
  PlusCircle, 
  Settings, 
  LogOut,
  User,
  X
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/orders', icon: <PackageSearch className="w-5 h-5" />, label: 'Orders Dashboard' },
    { path: '/new-order', icon: <PlusCircle className="w-5 h-5" />, label: 'New Order' },
    { path: '/admin', icon: <Settings className="w-5 h-5" />, label: 'Admin Dashboard' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden ${isOpen ? 'block' : 'hidden'}`} 
        onClick={onClose} 
      />

      {/* Sidebar */}
      <div className={`fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Mobile close button */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
        </div>

        <div className="h-full flex flex-col">
          {/* Logo Section */}
          <div className="flex items-center justify-center h-16 border-b border-slate-200 dark:border-slate-700 px-4">
            <Link to="/orders" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Scissors className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800 dark:text-white">Fashion</span>
            </Link>
          </div>

          {/* User Info */}
          <div className="border-b border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                <User className="h-6 w-6 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white">John Doe</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Designer</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    onClick={() => onClose()} // Close mobile menu on navigation
                    className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="mr-3">{item.icon}</div>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <button className="w-full flex items-center rounded-lg px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950 transition-colors">
              <LogOut className="w-5 h-5 mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
