import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardHeader from './components/layout/DashboardHeader';
import Sidebar from './components/layout/Sidebar';
import SiteFooter from './components/layout/SiteFooter';
import Dashboard from './components/layout/Dashboard';
import Orders from './pages/Orders';
import NewOrder from './pages/NewOrder';
import AdminDashboard from './pages/AdminDashboard';
import { StorageAlertBar } from './components/ui/StorageAlertBar';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      {/* Storage Alert Bar */}
      <StorageAlertBar />
      
      {/* Header */}
      <DashboardHeader 
        onToggleSidebar={toggleSidebar}
        onToggleDarkMode={toggleDarkMode}
        darkMode={darkMode}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 pt-16">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/new-order" element={<NewOrder />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<Navigate to="/orders" replace />} />
          </Routes>
        </main>
      </div>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}

export default App;
