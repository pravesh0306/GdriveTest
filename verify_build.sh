#!/bin/zsh

# Check if the build folder exists
if [ -d "dist" ]; then
  echo "✅ dist folder exists"
else
  echo "❌ dist folder is missing! Run npm run build first."
  exit 1
fi

# Check if index.html exists in dist
if [ -f "dist/index.html" ]; then
  echo "✅ dist/index.html exists"
else
  echo "❌ dist/index.html is missing! Build may be corrupted."
  exit 1
fi

# Check if CSS files exist
css_files=$(find dist -name "*.css" | wc -l)
if [ $css_files -gt 0 ]; then
  echo "✅ CSS files found: $css_files"
else
  echo "❌ No CSS files found in dist! Styles will be missing."
  exit 1
fi

# Check if JS files exist
js_files=$(find dist -name "*.js" | wc -l)
if [ $js_files -gt 0 ]; then
  echo "✅ JS files found: $js_files"
else
  echo "❌ No JS files found in dist! App functionality will be missing."
  exit 1
fi

echo "\n📦 BUILD VALIDATION SUCCESSFUL"
echo "Your app is ready to be deployed to Vercel."
echo "Make sure to set these environment variables in Vercel:"
echo "- VITE_GOOGLE_CLIENT_ID"
echo "- VITE_GOOGLE_API_SCOPE"
echo "- VITE_DRIVE_FOLDER_ID (optional)"

echo "\n🚀 Starting preview server on port 5173..."
npx vite preview
