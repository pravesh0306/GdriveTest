/// <reference types="react" />
import { useEffect, useState } from 'react';

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploaded, setUploaded] = useState<{ name: string; id: string }[]>([]);

  useEffect(() => {
    // Test mode: bypass Google OAuth for automation
    const testMode = typeof window !== 'undefined' && window.location.search.includes('test=true');
    if (testMode) {
      setToken('TEST_MODE_TOKEN');
      return;
    }
    // Only run Google OAuth logic if running in browser and env var is available
    if (
      typeof window !== 'undefined' &&
      typeof process !== 'undefined' &&
      process.env &&
      process.env.VITE_GOOGLE_CLIENT_ID &&
      !token
    ) {
      // @ts-ignore
      if (window.google && window.google.accounts && window.google.accounts.oauth2) {
        window.google.accounts.oauth2.initTokenClient({
          // @ts-ignore
          client_id: process.env.VITE_GOOGLE_CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/drive.file',
          prompt: '',
          callback: (res: any) => {
            if (res?.access_token) setToken(res.access_token);
          }
        }).requestAccessToken();
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
