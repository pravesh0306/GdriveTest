import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { driveService } from '../utils/googleDriveService';

interface GoogleAuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  uploadFile: (file: File) => Promise<string>;
  accessToken: string | null;
  isProduction: boolean; // Added to determine environment
}

const GoogleAuthContext = createContext<GoogleAuthContextType | undefined>(undefined);

export const useGoogleAuth = () => {
  const context = useContext(GoogleAuthContext);
  if (!context) {
    throw new Error('useGoogleAuth must be used within a GoogleAuthProvider');
  }
  return context;
};

interface GoogleAuthProviderProps {
  children: ReactNode;
}

export const GoogleAuthProvider: React.FC<GoogleAuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const isProduction = import.meta.env.VITE_DEPLOY_PLATFORM === 'production' || 
                       import.meta.env.MODE === 'production';

  // Log auth state on component mount
  useEffect(() => {
    console.log(`[GoogleAuth] Provider initialized. Environment: ${isProduction ? 'Production' : 'Development'} (${import.meta.env.MODE})`);
    console.log(`[GoogleAuth] App URL: ${window.location.origin}`);
  }, [isProduction]);

  const login = useGoogleLogin({
    onSuccess: (response) => {
      console.log('[GoogleAuth] Login successful!', {
        token: response.access_token ? `${response.access_token.substring(0, 10)}...` : 'missing',
        expires: response.expires_in || 'unknown',
        env: import.meta.env.MODE,
        origin: window.location.origin,
        href: window.location.href
      });
      
      setAccessToken(response.access_token);
      setIsAuthenticated(true);
      driveService.initialize(response.access_token);
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('google-auth-success', { 
          detail: { timestamp: new Date().toISOString() }
        }));
      }
    },
    onError: (error) => {
      console.error('Login Failed:', error);
      setIsAuthenticated(false);
      
      // Dispatch error event for the debug overlay to catch
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('google-auth-error', {
          detail: { message: error.error || 'Google login failed', timestamp: new Date().toISOString() }
        }));
      }
    },
    scope: import.meta.env.VITE_GOOGLE_API_SCOPE || 'https://www.googleapis.com/auth/drive.file',
    flow: 'implicit',
    // Using a unique state helps prevent CSRF attacks and can help with debugging
    state: `${import.meta.env.MODE}_${window.location.hostname}_${new Date().getTime()}`
  });

  const uploadFile = async (file: File): Promise<string> => {
    if (!isAuthenticated) {
      throw new Error('Not authenticated with Google Drive');
    }
    return driveService.uploadFile(file);
  };

  // Restore token from localStorage on load, if available
  useEffect(() => {
    const stored = localStorage.getItem('gdrive_token');
    if (stored) {
      driveService.initialize(stored);
      setAccessToken(stored);
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <GoogleAuthContext.Provider value={{ isAuthenticated, login, uploadFile, accessToken, isProduction }}>
      {children}
    </GoogleAuthContext.Provider>
  );
};

// In GoogleAuthContext.tsx, use a fallback for clientId for StackBlitz/demo environments
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const apiScope = import.meta.env.VITE_GOOGLE_API_SCOPE;
const folderId = import.meta.env.VITE_DRIVE_FOLDER_ID || import.meta.env.VITE_SHARED_DRIVE_FOLDER_ID;
const isProduction = import.meta.env.VITE_DEPLOY_PLATFORM === 'production' || 
                     import.meta.env.MODE === 'production' ||
                     window.location.hostname.includes('vercel.app');
const appUrl = isProduction 
  ? import.meta.env.VITE_APP_URL_PROD || window.location.origin
  : import.meta.env.VITE_APP_URL_LOCAL || 'http://localhost:5173';

export const GoogleAuthWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showDebug, setShowDebug] = useState(false);
  
  useEffect(() => {
    // Log environment details for debugging on initial load
    console.warn('GOOGLE AUTH WRAPPER DEBUG:');
    console.warn(`Client ID: ${clientId ? `${clientId.substring(0, 10)}...` : 'undefined'}`);
    console.warn(`API Scope: ${apiScope || 'undefined'}`);
    console.warn(`Folder ID: ${folderId || 'undefined'}`);
    console.warn(`Environment: ${isProduction ? 'Production' : 'Development'} (${import.meta.env.MODE})`);
    console.warn(`App URL: ${appUrl}`);
    console.warn(`Current URL: ${window.location.origin}`);
    console.warn(`Build timestamp: ${new Date().toISOString()}`);
    console.warn('All ENV vars:', Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')));
  }, []);
  
  if (!clientId || clientId === "YOUR_GOOGLE_CLIENT_ID_HERE") {
    console.error('Google Client ID is not configured. Please set VITE_GOOGLE_CLIENT_ID in your environment variables');
    console.log('Current Client ID:', clientId ? `${clientId.substring(0, 10)}...` : 'undefined');
    console.log('API Scope:', apiScope);
    console.log('Folder ID:', folderId);
    console.log('All VITE env vars:', Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')));
    // Collect all VITE_ env vars and their values for debug overlay
    const viteEnvVars = Object.entries(import.meta.env)
      .filter(([k]) => k.startsWith('VITE_'))
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center max-w-md p-6 bg-slate-800 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Google Authentication Not Configured</h2>
          <p className="text-slate-400 mb-4">
            The Google Client ID environment variable is missing or invalid on this deployment.<br />
            <span className="text-xs text-yellow-400">If you are deploying to Vercel, set <b>VITE_GOOGLE_CLIENT_ID</b> and other required variables in <b>Project &rarr; Settings &rarr; Environment Variables</b>.</span>
          </p>
          <div className="text-sm text-red-400 mb-4 p-2 bg-red-900/20 rounded">
            <div>Client ID: {clientId ? '✓ SET' : '✗ MISSING'}</div>
            <div>API Scope: {apiScope ? '✓ SET' : '✗ MISSING'}</div>
            <div>Folder ID: {folderId ? '✓ SET' : '✗ MISSING'}</div>
            <div>Environment: {import.meta.env.MODE}</div>
          </div>
          <button 
            onClick={() => setShowDebug(prev => !prev)}
            className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded mb-3"
          >
            {showDebug ? 'Hide Details' : 'Show Details'}
          </button>
          {showDebug && (
            <div className="text-xs text-left bg-slate-900 p-2 rounded overflow-x-auto">
              <pre>VITE_GOOGLE_CLIENT_ID: {clientId || 'undefined'}</pre>
              <pre>VITE_GOOGLE_API_SCOPE: {apiScope || 'undefined'}</pre>
              <pre>VITE_DRIVE_FOLDER_ID: {import.meta.env.VITE_DRIVE_FOLDER_ID || 'undefined'}</pre>
              <pre>\n<b>All VITE_ env vars:</b>\n{viteEnvVars}</pre>
              <div className="mt-2 text-slate-400">Copy this info when asking for support.</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Add a console message showing we're attempting to initialize Google OAuth
  console.log('Attempting to initialize GoogleOAuthProvider with client ID:', 
    clientId ? `${clientId.substring(0, 10)}...${clientId.slice(-5)}` : 'missing');

  return (
    <GoogleOAuthProvider 
      clientId={clientId}
      onScriptLoadError={() => {
        console.error('⛔ Google API script failed to load');
        // Dispatch a custom event that we can listen for in the debug overlay
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('google-auth-error', { 
            detail: { message: 'Script load error', timestamp: new Date().toISOString() } 
          }));
        }
      }}
    >
      <GoogleAuthProvider>{children}</GoogleAuthProvider>
    </GoogleOAuthProvider>
  );
};
