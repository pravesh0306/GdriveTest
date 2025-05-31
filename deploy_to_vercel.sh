#!/bin/zsh

echo "🚀 Beginning deployment process to Vercel..."
echo "---------------------------------------"

# Step 1: Clean the workspace
echo "\n📦 Step 1: Cleaning workspace..."
rm -rf dist .vercel/output node_modules/.vite

# Step 2: Check environment setup
echo "\n🔍 Step 2: Checking environment setup..."
if [ ! -f ".env.production" ]; then
  echo "⚠️ Warning: .env.production file not found."
  echo "Creating a basic .env.production file..."
  cat > .env.production << EOL
# Production configuration for Vercel deployment
VITE_GOOGLE_CLIENT_ID=$(grep VITE_GOOGLE_CLIENT_ID .env | cut -d '=' -f2)
VITE_GOOGLE_API_SCOPE=$(grep VITE_GOOGLE_API_SCOPE .env | cut -d '=' -f2)
VITE_DRIVE_FOLDER_ID=$(grep VITE_DRIVE_FOLDER_ID .env | cut -d '=' -f2)
VITE_DEPLOY_PLATFORM=production
EOL
  echo "✅ Created .env.production with values from .env"
fi

# Step 3: Verify Vercel configuration
echo "\n🔍 Step 3: Checking Vercel configuration..."
if [ ! -f "vercel.json" ]; then
  echo "⚠️ Warning: vercel.json not found"
  echo "Creating a basic vercel.json file..."
  cat > vercel.json << EOL
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    }
  ]
}
EOL
  echo "✅ Created basic vercel.json"
fi

# Step 4: Install dependencies
echo "\n📦 Step 4: Installing dependencies..."
npm install

# Step 5: Build project
echo "\n📦 Step 5: Building project..."
npm run build

# Check if build succeeded
if [ ! -d "dist" ] || [ ! -f "dist/index.html" ]; then
  echo "❌ Build failed! Check errors above."
  exit 1
fi

# Step 6: Verify build output has CSS and JS
css_count=$(find dist -name "*.css" | wc -l | tr -d ' ')
js_count=$(find dist -name "*.js" | wc -l | tr -d ' ')

echo "\n📦 Step 6: Verifying build output..."
echo "  - HTML files: $(find dist -name "*.html" | wc -l | tr -d ' ')"
echo "  - CSS files: $css_count"
echo "  - JS files: $js_count"

if [ $css_count -eq 0 ] || [ $js_count -eq 0 ]; then
  echo "❌ Build verification failed! Missing CSS or JS files."
  exit 1
fi

# Step 7: Check Google OAuth configuration
echo "\n🔍 Step 7: Checking Google OAuth configuration..."
PROD_CLIENT_ID=$(grep VITE_GOOGLE_CLIENT_ID .env.production | cut -d '=' -f2)
if [ -z "$PROD_CLIENT_ID" ] || [ "$PROD_CLIENT_ID" = "your-client-id.apps.googleusercontent.com" ]; then
  echo "⚠️ Warning: Production Google Client ID not properly configured!"
  echo "Please update VITE_GOOGLE_CLIENT_ID in .env.production"
else
  echo "✅ Google Client ID configured"
fi

# Step 8: Checking Vercel URL configuration
echo "\n🔍 Step 8: Checking Vercel URL configuration..."
PROD_URL=$(grep VITE_APP_URL_PROD .env.production | cut -d '=' -f2)
if [ -z "$PROD_URL" ] || [ "$PROD_URL" = "https://your-vercel-url.vercel.app" ]; then
  echo "⚠️ Warning: Production URL not properly configured in .env.production"
  echo "Please update VITE_APP_URL_PROD in .env.production with your actual Vercel URL"
  read -p "Enter your Vercel deployment URL (https://...): " VERCEL_URL
  if [ ! -z "$VERCEL_URL" ]; then
    sed -i '' "s|VITE_APP_URL_PROD=.*|VITE_APP_URL_PROD=$VERCEL_URL|" .env.production
    echo "✅ Updated VITE_APP_URL_PROD to $VERCEL_URL"
  fi
else
  echo "✅ Vercel URL configured: $PROD_URL"
fi

# Step 9: Add and commit changes
echo "\n📦 Step 9: Committing changes to git..."
git add .
git commit -m "Build: Ready for Vercel deployment $(date +%Y-%m-%d)"

# Step 10: Push to GitHub
echo "\n📦 Step 10: Pushing to GitHub..."
git push origin main

echo "\n✅ DEPLOYMENT PROCESS COMPLETE!"
echo "---------------------------------------"
echo "Your code has been pushed to GitHub."
echo "Vercel should automatically deploy your changes."
echo ""
echo "🔍 NEXT STEPS:"
echo "1. Visit your Vercel dashboard to check deployment status"
echo "2. Ensure these environment variables are set in Vercel:"
echo "   - VITE_GOOGLE_CLIENT_ID"
echo "   - VITE_GOOGLE_API_SCOPE"
echo "   - VITE_DRIVE_FOLDER_ID (optional)"
echo "3. Add your Vercel URL to the authorized redirect URIs in Google Cloud Console"
echo ""
echo "🔗 Your app should be live at: ${PROD_URL}"
