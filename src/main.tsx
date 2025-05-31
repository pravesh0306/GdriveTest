import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { GoogleAuthWrapper } from './contexts/GoogleAuthContext';
import { NotificationProvider } from './components/ui/Notifications';
import { LoadingProvider } from './components/ui/LoadingBar';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <GoogleAuthWrapper>
        <NotificationProvider>
          <LoadingProvider>
            <App />
          </LoadingProvider>
        </NotificationProvider>
      </GoogleAuthWrapper>
    </BrowserRouter>
  </React.StrictMode>
);