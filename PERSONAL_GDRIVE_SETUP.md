# 🚀 Personal Google Drive Integration Setup Guide

This guide will help you set up Google Drive integration for your Fashion Order Management app following the personal use approach (no Google verification needed).

## 📋 Prerequisites

✅ **What you need:**
- A Google account
- This web application running locally
- 5 minutes to complete setup

✅ **What you get:**
- Upload files directly to YOUR Google Drive
- No backend server required
- No Google approval needed (stays in "Testing" mode)
- Perfect for personal dashboards and admin tools

---

## 🔧 Step 1: Google Cloud Console Setup

### 1.1 Create OAuth Credentials

1. **Go to Google Cloud Console:**
   ```
   https://console.cloud.google.com/apis/credentials
   ```

2. **Create OAuth 2.0 Client ID:**
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: **Web application**
   - Name: `Personal WebApp` (or any name you prefer)
   
3. **Set Authorized Redirect URIs:**
   ```
   http://localhost:5173
   https://your-vercel-url.vercel.app
   ```
   
4. **Copy the Client ID:**
   - It will look like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`

### 1.2 Enable Google Drive API

1. Go to **APIs & Services** → **Library**
2. Search for "Google Drive API"
3. Click **Enable**

---

## ⚙️ Step 2: Configure Your Project

### 2.1 Update Environment Variables

Edit your `.env` file and replace the Client ID:

```env
VITE_GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
```

**Example:**
```env
VITE_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
```

### 2.2 Verify Other Settings

Your `.env` should look like this:
```env
# Your actual Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com

# API scope (allows file uploads to your Drive)
VITE_GOOGLE_API_SCOPE=https://www.googleapis.com/auth/drive.file

# Optional: Folder ID for organized uploads
VITE_DRIVE_FOLDER_ID=your-folder-id

# Platform configuration
VITE_DEPLOY_PLATFORM=local
```

---

## 🧪 Step 3: Test Locally

### 3.1 Start Development Server

```bash
npm install
npm run dev
```

The app will start on `http://localhost:5173`

### 3.2 Test Upload Flow

1. **Open the app:** `http://localhost:5173`
2. **Navigate to Testing:** Click "Google Drive Testing" in the sidebar
3. **Login:** Click "Login with Google" 
4. **Upload a file:** Drag & drop or click to select
5. **Verify:** Check if the file appears in your Google Drive

### 3.3 Troubleshooting

**Common Issues:**

❌ **"redirect_uri_mismatch" error**
- Make sure `http://localhost:5173` is in your OAuth redirect URIs

❌ **"This app isn't verified" warning**
- Click "Advanced" → "Go to [App Name] (unsafe)"
- This is normal for personal use apps in testing mode

❌ **"Access blocked" error**
- Check that Google Drive API is enabled
- Verify your Client ID is correct

---

## 🚀 Step 4: Deploy to Production

### 4.1 Vercel Deployment

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Personal GDrive integration setup"
   git push origin main
   ```

2. **Vercel Auto-Deploy:**
   - Your app will auto-deploy to Vercel
   - Get your production URL: `https://your-app-name.vercel.app`

3. **Update OAuth Settings:**
   - Go back to Google Cloud Console
   - Add your Vercel URL to authorized redirect URIs
   - Update `.env` with your production URL

### 4.2 Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Project Settings → Environment Variables
3. Add:
   ```
   VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   VITE_GOOGLE_API_SCOPE=https://www.googleapis.com/auth/drive.file
   VITE_DRIVE_FOLDER_ID=your-folder-id (optional)
   ```

---

## ✨ Step 5: You're Ready!

🎉 **Congratulations!** You now have:

✅ **Personal Google Drive integration**
- Upload files directly to your Drive
- No third-party storage costs
- All data stays in your Google account

✅ **Perfect for:**
- Personal dashboards
- Admin tools
- Content management
- File organization

✅ **No limits:**
- Stay in Google's "Testing" mode indefinitely
- No verification needed for personal use
- Upload as many files as your Drive allows

---

## 🔧 Advanced Configuration

### Custom Upload Folder

To upload files to a specific folder in your Drive:

1. **Create a folder** in Google Drive
2. **Get the folder ID** from the URL: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`
3. **Set in `.env`:** `VITE_DRIVE_FOLDER_ID=FOLDER_ID_HERE`

### Test Mode

Add `?test=true` to your URL to skip login during development:
```
http://localhost:5173?test=true
```

---

## 📞 Support

**Need help?** Check these resources:

- **Google Cloud Console:** https://console.cloud.google.com/
- **OAuth Setup Guide:** https://developers.google.com/identity/protocols/oauth2
- **Drive API Docs:** https://developers.google.com/drive/api/v3/quickstart/js

**Common Solutions:**
- Clear browser cache and cookies
- Try in Chrome for best compatibility
- Check browser console for detailed error messages
- Ensure all URLs match exactly (no trailing slashes)

---

**🎯 Pro Tip:** This setup is perfect for personal use and can handle all your file upload needs without any ongoing costs or complicated backend infrastructure!
