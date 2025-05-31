import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FloatingActionButtonProps {
  to?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ 
  to = '/orders/new', 
  onClick,
  icon = <PlusCircle className="h-6 w-6" />
}) => {
  const content = (
    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg transition-colors">
      {icon}
    </div>
  );
  
  if (to) {
    return (
      <Link to={to} className="fixed bottom-8 right-8 z-50">
        {content}
      </Link>
    );
  }
  
  return (
    <button onClick={onClick} className="fixed bottom-8 right-8 z-50">
      {content}
    </button>
  );
};

export default FloatingActionButton;
