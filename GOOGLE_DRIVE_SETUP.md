# Google Drive Integration Setup Guide

## Overview

This Fashion Order Management app now includes complete Google Drive integration for secure file storage. Users can upload order attachments directly to their Google Drive, and files are organized in a dedicated folder structure.

## Features Implemented

### ✅ Core Functionality
- **Google OAuth Authentication** - Secure login with Google account
- **File Upload to Google Drive** - Direct upload from the order form
- **Drag & Drop Interface** - Modern file upload experience
- **Image Compression** - Automatic optimization for large images
- **File Preview & Management** - View, download, and manage uploaded files
- **Progress Tracking** - Real-time upload progress with cancellation
- **Toast Notifications** - User feedback for all operations
- **Folder Organization** - Automatic folder creation for file organization

### ✅ UI Components
- **DragDropUpload** - Drag-and-drop file upload with compression
- **AttachmentGrid** - File preview grid with thumbnails
- **AttachmentModal** - Modal for viewing order attachments
- **LoadingBar** - Progress bar with cancellation support
- **Notifications** - Toast notification system

### ✅ Integration Points
- **NewOrder Page** - File attachment functionality
- **Orders Page** - View attachments for existing orders
- **Type System** - Proper TypeScript interfaces for attachments

## Setup Instructions

### 1. Google Cloud Console Setup

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Google Drive API**
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Drive API"
   - Click "Enable"

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add your domain to "Authorized JavaScript origins":
     - For development: `http://localhost:5173`, `http://localhost:5174`, etc.
     - For production: `https://yourdomain.com`
   - Copy the Client ID

### 2. Environment Configuration

Update your `.env` file with the Google credentials:

```env
# Google Drive Integration
VITE_GOOGLE_CLIENT_ID=your_actual_google_client_id_here
VITE_GOOGLE_API_SCOPE=https://www.googleapis.com/auth/drive.file
VITE_DRIVE_FOLDER_ID=your_google_drive_folder_id_here
VITE_DEPLOY_PLATFORM=local
```

### 3. Google Drive Folder Setup

1. **Create a Shared Folder** (Optional but recommended)
   - Create a folder in Google Drive for the app
   - Share it with appropriate permissions
   - Copy the folder ID from the URL

2. **Get Folder ID**
   - Open the folder in Google Drive
   - The folder ID is in the URL: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`

### 4. Test the Integration

1. **Start the Development Server**
   ```bash
   npm run dev
   ```

2. **Test Authentication**
   - Navigate to "New Order" page
   - Try uploading a file
   - You should see Google sign-in prompt

3. **Verify File Upload**
   - Complete the authentication
   - Upload a file
   - Check your Google Drive for the uploaded file

## Usage Guide

### For Users

1. **Creating an Order with Attachments**
   - Go to "New Order" page
   - Fill out the order details
   - Drag and drop files or click to upload
   - Files are automatically uploaded to Google Drive
   - Submit the order

2. **Viewing Order Attachments**
   - Go to "Orders" page
   - Click "View Attachments" for any order
   - Preview, download, or view files in modal

### For Developers

#### Key Files Structure
```
src/
├── components/ui/
│   ├── DragDropUpload.tsx      # File upload component
│   ├── AttachmentGrid.tsx      # File preview grid
│   ├── AttachmentModal.tsx     # Attachment viewing modal
│   ├── LoadingBar.tsx          # Progress bar
│   └── Notifications.tsx       # Toast system
├── contexts/
│   └── GoogleAuthContext.tsx   # Google auth provider
├── utils/
│   └── googleDriveService.ts   # Google Drive API service
└── types/
    └── order.ts                # Updated with attachments
```

#### Google Drive Service Methods
```typescript
// Authentication
await authenticateAndLoadApi()
signIn()
signOut()

// File Operations
uploadFile(file, fileName, folderId?)
downloadFile(fileId)
createFolder(name, parentId?)
listFiles(folderId?)
deleteFile(fileId)
```

#### Attachment Type Interface
```typescript
interface Attachment {
  id: string
  name: string
  size: number
  type: string
  url?: string
  driveFileId?: string
  file?: File
}
```

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Check if Google Client ID is correct
   - Verify domain is added to OAuth origins
   - Clear browser cache and try again

2. **Upload Failures**
   - Check Google Drive API is enabled
   - Verify folder permissions
   - Check console for detailed error messages

3. **File Not Appearing**
   - Check folder ID in environment variables
   - Verify user has access to the target folder
   - Check network connectivity

### Debug Mode

Enable detailed logging by adding to your environment:
```env
VITE_DEBUG_GOOGLE_DRIVE=true
```

## Security Considerations

1. **OAuth Scope** - Uses minimal `drive.file` scope for security
2. **File Access** - Users can only access files they uploaded
3. **Authentication** - Secure Google OAuth 2.0 flow
4. **Environment Variables** - Sensitive data stored in environment variables

## Future Enhancements

### Potential Improvements
- [ ] Batch file upload with progress tracking
- [ ] File versioning and history
- [ ] Advanced file type validation
- [ ] File sharing between users
- [ ] Bulk file operations
- [ ] File thumbnail generation
- [ ] Search functionality
- [ ] File tags and metadata

### Performance Optimizations
- [ ] Lazy loading for large file lists
- [ ] Image thumbnail caching
- [ ] Background upload queue
- [ ] Compression settings customization

## API Reference

### GoogleAuthContext Methods
```typescript
const {
  isAuthenticated,
  user,
  signIn,
  signOut,
  loading,
  error
} = useGoogleAuth()
```

### Google Drive Service Usage
```typescript
import { googleDriveService } from '@/utils/googleDriveService'

// Upload a file
const result = await googleDriveService.uploadFile(
  file,
  'custom-filename.jpg',
  folderId
)

// Create folder
const folder = await googleDriveService.createFolder(
  'Order Attachments',
  parentFolderId
)
```

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify your Google Cloud Console configuration
3. Ensure all environment variables are set correctly
4. Test with a fresh browser session

---

**Note**: This integration provides a complete Google Drive file management system integrated into your Fashion Order Management application. All files are stored securely in the user's Google Drive account with proper authentication and permission controls.
