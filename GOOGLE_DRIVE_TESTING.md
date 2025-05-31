# Google Drive Integration Testing Guide

## Overview

This document provides comprehensive testing instructions for the enhanced Google Drive integration in the Fashion Order Management application.

## Enhanced Features

### 1. File Validation System
- **Comprehensive Type Checking**: Validates file types against allowed MIME types and extensions
- **Size Validation**: Configurable file size limits with warnings for large files
- **Count Limits**: Maximum file count validation to prevent system overload
- **Error Reporting**: Detailed error messages with actionable feedback

### 2. Batch Upload Progress Tracking
- **Individual File Progress**: Real-time progress tracking for each file
- **Cancel & Retry**: Individual file cancel/retry capabilities
- **Status Indicators**: Visual progress bars and status icons
- **Error Recovery**: Smart retry logic for failed uploads

### 3. Smart File Removal
- **Context-Aware Dialogs**: Different removal prompts based on upload status
- **Google Drive Integration**: Handles both local and Drive-uploaded files
- **Bulk Operations**: Remove multiple files with confirmation
- **Undo Protection**: Confirmation dialogs prevent accidental deletions

### 4. Image Compression
- **Automatic Optimization**: Compresses large images before upload
- **Quality Control**: Configurable compression settings
- **Size Reduction**: Reduces bandwidth usage and storage requirements
- **Format Support**: Supports JPEG, PNG, and WebP formats

## Testing Routes

### Main Application Routes
- `/orders` - Orders Dashboard (main page)
- `/new-order` - New Order Creation
- `/admin` - Admin Dashboard
- `/testing` - **NEW: Google Drive Testing Suite**

## Testing Page Features

### 1. Interactive Testing Suite
Navigate to `/testing` to access the comprehensive testing environment:

#### **Validation Tests**
- Automated file validation testing
- Tests various file types and sizes
- Validates error handling and warnings
- Real-time test result logging

#### **File Upload Testing**
- Drag & drop functionality testing
- Multiple file selection
- Progress tracking verification
- Error handling validation

#### **Integration Testing**
- Google Drive authentication flow
- Upload success/failure scenarios
- File removal testing
- Batch operation validation

### 2. Test Controls
- **Run Validation Tests**: Execute automated validation scenarios
- **Clear Results**: Reset test output log
- **Clear Files**: Remove all uploaded test files
- **Real-time Logging**: View detailed test execution logs

### 3. Feature Status Dashboard
Visual indicators showing implementation status:
- ✅ Enhanced Validation - Complete
- ✅ Batch Progress - Complete
- ✅ Smart Removal - Complete
- ✅ Image Compression - Complete

## Manual Testing Procedures

### Test Case 1: File Validation
1. Navigate to `/testing`
2. Click "Run Validation Tests"
3. Verify test results show:
   - ✅ Valid files pass validation
   - ❌ Invalid files show specific errors
   - ⚠️ Large files show warnings

### Test Case 2: Drag & Drop Upload
1. Drag multiple files to the upload area
2. Verify:
   - File validation occurs before upload
   - Progress bars appear for each file
   - Invalid files are rejected with clear messages
   - Valid files show upload progress

### Test Case 3: File Removal
1. Upload several files
2. Click remove on different files
3. Verify:
   - Confirmation dialogs appear
   - Different dialogs for different file states
   - Files are removed from both UI and storage

### Test Case 4: Batch Operations
1. Upload 5+ files simultaneously
2. Verify:
   - Individual progress tracking
   - Ability to cancel individual uploads
   - Overall batch progress indication
   - Error handling for failed uploads

### Test Case 5: Image Compression
1. Upload large image files (>5MB)
2. Verify:
   - Images are compressed before upload
   - Quality remains acceptable
   - File sizes are reduced
   - Upload times improve

## Google Drive Authentication Setup

### Development Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Drive API
4. Create OAuth 2.0 credentials
5. Add authorized origins:
   - `http://localhost:5179`
   - Your production domain
6. Update `src/contexts/GoogleAuthContext.tsx` with your client ID

### Production Setup
1. Update OAuth redirect URIs for production domain
2. Configure proper scopes:
   - `https://www.googleapis.com/auth/drive.file`
3. Set up proper CORS policies
4. Configure environment variables

## Error Scenarios to Test

### 1. Network Errors
- Disconnect internet during upload
- Verify retry mechanisms work
- Check error messages are clear

### 2. Authentication Errors
- Test expired token scenarios
- Verify re-authentication flow
- Check unauthorized access handling

### 3. File System Errors
- Test with corrupted files
- Verify large file handling
- Check disk space scenarios

### 4. Concurrent Operations
- Upload multiple batches simultaneously
- Test system stability under load
- Verify resource cleanup

## Performance Testing

### File Size Testing
- Small files (< 1MB): Should upload instantly
- Medium files (1-10MB): Should show progress
- Large files (10MB+): Should compress and show detailed progress

### Batch Size Testing
- 1-5 files: Normal operation
- 5-10 files: Batch progress tracking
- 10+ files: Queue management and throttling

### Network Condition Testing
- Fast connection: Quick uploads with minimal compression
- Slow connection: More aggressive compression, better progress feedback
- Intermittent connection: Robust retry mechanisms

## Known Limitations

1. **File Size Limits**: 15MB per file (Google Drive API limit)
2. **Rate Limiting**: Google Drive API has usage quotas
3. **Browser Compatibility**: Modern browsers only (ES6+ features)
4. **Mobile Support**: Touch devices may need additional testing

## Troubleshooting

### Common Issues
1. **"Authentication failed"**: Check OAuth credentials
2. **"File too large"**: Verify file size limits
3. **"Upload failed"**: Check network connection and Google Drive API quotas
4. **"Invalid file type"**: Review allowed file types configuration

### Debug Mode
Enable debug logging in the browser console to see detailed operation logs.

## Future Enhancements

1. **Background Uploads**: Continue uploads when page is not active
2. **Resume Uploads**: Resume interrupted uploads
3. **Advanced Compression**: More compression options and formats
4. **Cloud Storage Options**: Support for additional cloud providers
5. **Offline Support**: Queue uploads when offline

## Security Considerations

1. **Client-side Validation**: First line of defense, not security boundary
2. **Server-side Validation**: Should mirror client-side rules
3. **Access Tokens**: Handle securely, implement refresh logic
4. **File Content Scanning**: Consider malware scanning for production
5. **User Permissions**: Implement proper access controls

---

## Quick Start Testing

1. Start development server: `npm run dev`
2. Navigate to `http://localhost:5179/testing`
3. Click "Run Validation Tests" to verify system functionality
4. Upload test files to verify integration
5. Check browser console for detailed logs

For issues or questions, refer to the codebase documentation or raise an issue in the project repository.
