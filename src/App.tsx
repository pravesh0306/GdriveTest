/// <reference types="react" />
import { useEffect, useState } from 'react';

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploaded, setUploaded] = useState<{ name: string; id: string }[]>([]);

  useEffect(() => {
    // Debug logging
    console.log('Environment check:', {
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      window: typeof window !== 'undefined',
      hasToken: !!token
    });

    // Test mode: bypass Google OAuth for automation
    const testMode = typeof window !== 'undefined' && window.location.search.includes('test=true');
    if (testMode) {
      setToken('TEST_MODE_TOKEN');
      return;
    }
    // Only run Google OAuth logic if running in browser and env var is available
    if (
      typeof window !== 'undefined' &&
      import.meta.env.VITE_GOOGLE_CLIENT_ID &&
      !token
    ) {
      // @ts-ignore
      const g = (window as any).google;
      if (
        g &&
        g.accounts &&
        g.accounts.oauth2 &&
        typeof g.accounts.oauth2.initTokenClient === 'function'
      ) {
        g.accounts.oauth2.initTokenClient({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/drive',
          prompt: '',
          callback: (res: any) => {
            if (res?.access_token) setToken(res.access_token);
          }
        }).requestAccessToken();
      } else {
        alert('Google API script not loaded. Please check your public/index.html and internet connection.');
      }
    }
  }, [token]);

  const upload = async () => {
    if (!token) return alert('No token');
    if (!files.length) return alert('No files selected');
    for (const file of files) {
      const metadata = { name: file.name, mimeType: file.type };
      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', file);
      const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form
      });
      const data = await res.json();
      console.log('Upload response:', data);
      // Set file permission to anyone with the link can view
      const permRes = await fetch(`https://www.googleapis.com/drive/v3/files/${data.id}/permissions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          role: 'reader',
          type: 'anyone'
        })
      });
      const permData = await permRes.json();
      console.log('Permission response:', permData);
      if (!permRes.ok) {
        alert(`Failed to set sharing permissions: ${permData.error?.message || permRes.status}`);
      }
      alert(`Uploaded: ${data.name}`);
      setUploaded(prev => [...prev, { name: data.name, id: data.id }]);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🔐 Google Drive Upload Test</h1>
      <input
        type="file"
        aria-label="file"
        multiple
        onChange={e => setFiles(Array.from(e.target.files || []))}
      />
      <button onClick={upload}>Upload</button>
      <ul>
        {uploaded.map((file, i) => (
          <li key={i}>
            <a
              href={`https://drive.google.com/file/d/${file.id}/view`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {file.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
