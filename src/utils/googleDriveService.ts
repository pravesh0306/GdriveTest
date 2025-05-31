class GoogleDriveService {
  private static instance: GoogleDriveService;
  private accessToken: string | null = null;
  private readonly API_BASE_URL = 'https://www.googleapis.com/drive/v3';
  private get SHARED_FOLDER_ID() {
    return import.meta.env.VITE_SHARED_DRIVE_FOLDER_ID || import.meta.env.VITE_DRIVE_FOLDER_ID;
  }

  private constructor() {}

  static getInstance(): GoogleDriveService {
    if (!GoogleDriveService.instance) {
      GoogleDriveService.instance = new GoogleDriveService();
    }
    return GoogleDriveService.instance;
  }

  initialize(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async makeRequest(endpoint: string, options: RequestInit) {
    if (!this.accessToken) {
      throw new Error('Google Drive not initialized');
    }

    const response = await fetch(`${this.API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Google Drive API error: ${response.statusText}`);
    }

    return response.json();
  }

  async createFolder(folderName: string): Promise<string> {
    try {
      const response = await this.makeRequest('/files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: folderName,
          mimeType: 'application/vnd.google-apps.folder',
        }),
      });
      return response.id;
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  }

  // Add a platform marker for uploads
  private get platform() {
    return (
      import.meta.env.VITE_DEPLOY_PLATFORM ||
      (typeof window !== 'undefined' && window.location.hostname.includes('vercel') ? 'vercel' :
       typeof window !== 'undefined' && window.location.hostname.includes('stackblitz') ? 'stackblitz' :
       'local')
    );
  }

  async setFilePublic(fileId: string): Promise<void> {
    if (!this.accessToken) throw new Error('Google Drive not initialized');
    const response = await fetch(`${this.API_BASE_URL}/files/${fileId}/permissions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role: 'reader',
        type: 'anyone',
      }),
    });
    if (!response.ok) {
      const text = await response.text();
      console.error(`Failed to set file public: ${text}`);
      throw new Error(`Failed to set file public: ${response.statusText}`);
    }
  }

  async uploadFile(file: File): Promise<string> {
    if (!this.accessToken) {
      throw new Error('Google Drive not initialized');
    }
    try {
      // Use shared folder for all uploads
      const folderId = this.SHARED_FOLDER_ID;
      if (!folderId) throw new Error('Shared Google Drive folder ID not set');
      const metadata = {
        name: `${file.name} [${this.platform}]`,
        parents: [folderId],
      };
      const formData = new FormData();
      formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      formData.append('file', file);
      const response = await fetch(`${this.API_BASE_URL}/files?uploadType=multipart`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
        body: formData,
      });
      if (!response.ok) {
        const text = await response.text();
        console.error(`Upload failed: ${text}`);
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      const data = await response.json();
      await this.setFilePublic(data.id);
      return `https://drive.google.com/file/d/${data.id}/view`;
    } catch (error) {
      console.error('Error uploading to Google Drive:', error);
      throw error;
    }
  }

  async listAppFolderFiles(): Promise<any[]> {
    if (!this.accessToken) throw new Error('Google Drive not initialized');
    const folderId = this.SHARED_FOLDER_ID;
    if (!folderId) throw new Error('Shared Google Drive folder ID not set');
    // Request id, name, size, createdTime for each file for debug/deploy and UI
    const response = await this.makeRequest(`/files?q='${folderId}'+in+parents+and+trashed=false&fields=files(id,name,size,createdTime)`, {
      method: 'GET',
    });
    return response.files || [];
  }

  async downloadFile(fileId: string): Promise<Blob> {
    if (!this.accessToken) throw new Error('Google Drive not initialized');
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${this.accessToken}` },
    });
    if (!response.ok) throw new Error('Failed to download file');
    return await response.blob();
  }

  async syncAppFolderToLocal(localCallback: (fileName: string, blob: Blob) => Promise<void>): Promise<void> {
    const files = await this.listAppFolderFiles();
    for (const file of files) {
      const blob = await this.downloadFile(file.id);
      await localCallback(file.name, blob);
    }
  }

  async deleteFile(fileId: string): Promise<void> {
    if (!this.accessToken) throw new Error('Google Drive not initialized');
    const response = await fetch(`${this.API_BASE_URL}/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to delete file: ${response.statusText}`);
    }
  }
}

export const driveService = GoogleDriveService.getInstance();
