import React, { useState } from 'react';
import { TestTube, ArrowLeft, Monitor, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import FileUploadTester from '../components/ui/FileUploadTester';
import GoogleDriveMonitor from '../components/ui/GoogleDriveMonitor';
import Button from '../components/ui/Button';

const TestingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'monitor'>('upload');
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <TestTube className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Google Drive Integration Testing
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Test enhanced file upload, validation, and Google Drive integration features
              </p>
            </div>
          </div>
          <Link to="/orders">
            <Button variant="outline" icon={<ArrowLeft className="w-4 h-4" />}>
              Back to Orders
            </Button>
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8">
          <Button
            variant={activeTab === 'upload' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('upload')}
            icon={<Upload className="w-4 h-4" />}
          >
            Upload Testing
          </Button>
          <Button
            variant={activeTab === 'monitor' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('monitor')}
            icon={<Monitor className="w-4 h-4" />}
          >
            System Monitor
          </Button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'upload' ? (
          <>
            {/* Testing Suite */}
            <FileUploadTester />

            {/* Documentation */}
            <div className="mt-12 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Enhanced Features Documentation
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                    File Validation Enhancements
                  </h3>
                  <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Detailed Type Checking:</strong> Validates both MIME type and file extension</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Size Warnings:</strong> Shows warnings for large files before upload</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Batch Validation:</strong> Validates multiple files with individual feedback</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>File Type Icons:</strong> Displays appropriate icons based on file type</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                    Batch Upload Progress
                  </h3>
                  <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Individual Tracking:</strong> Track progress for each file separately</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Cancel/Retry:</strong> Cancel individual uploads or retry failed ones</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Minimize Option:</strong> Collapse progress panel to save space</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Status Indicators:</strong> Clear visual status for each file state</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                    Smart File Removal
                  </h3>
                  <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Context Awareness:</strong> Different dialogs for uploaded vs. pending files</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Drive Status:</strong> Shows if file is already uploaded to Google Drive</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Clear Warnings:</strong> Explains consequences of file removal</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Confirmation Required:</strong> Prevents accidental file deletion</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                    Image Compression
                  </h3>
                  <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Automatic Compression:</strong> Compresses images before upload</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Progress Feedback:</strong> Shows compression progress separately</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Size Optimization:</strong> Reduces file size while maintaining quality</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Fallback Handling:</strong> Uses original file if compression fails</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                  Testing Instructions
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-slate-700 dark:text-slate-300">
                  <li>Click "Run Validation Tests" to see how different file types are validated</li>
                  <li>Try uploading multiple files to test batch progress tracking</li>
                  <li>Upload large images to see compression in action</li>
                  <li>Upload files to Google Drive (if authenticated) to test cloud integration</li>
                  <li>Try removing files to see the enhanced removal dialog</li>
                  <li>Test different file types: images, PDFs, documents, and invalid types</li>
                </ol>
              </div>
            </div>
          </>
        ) : (
          <GoogleDriveMonitor />
        )}

        {/* Documentation */}
        <div className="mt-12 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Enhanced Features Documentation
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                File Validation Enhancements
              </h3>
              <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Detailed Type Checking:</strong> Validates both MIME type and file extension</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Size Warnings:</strong> Shows warnings for large files before upload</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Batch Validation:</strong> Validates multiple files with individual feedback</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>File Type Icons:</strong> Displays appropriate icons based on file type</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Batch Upload Progress
              </h3>
              <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Individual Tracking:</strong> Track progress for each file separately</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Cancel/Retry:</strong> Cancel individual uploads or retry failed ones</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Minimize Option:</strong> Collapse progress panel to save space</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Status Indicators:</strong> Clear visual status for each file state</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Smart File Removal
              </h3>
              <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Context Awareness:</strong> Different dialogs for uploaded vs. pending files</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Drive Status:</strong> Shows if file is already uploaded to Google Drive</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Clear Warnings:</strong> Explains consequences of file removal</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Confirmation Required:</strong> Prevents accidental file deletion</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Image Compression
              </h3>
              <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Automatic Compression:</strong> Compresses images before upload</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Progress Feedback:</strong> Shows compression progress separately</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Size Optimization:</strong> Reduces file size while maintaining quality</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Fallback Handling:</strong> Uses original file if compression fails</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
              Testing Instructions
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-slate-700 dark:text-slate-300">
              <li>Click "Run Validation Tests" to see how different file types are validated</li>
              <li>Try uploading multiple files to test batch progress tracking</li>
              <li>Upload large images to see compression in action</li>
              <li>Upload files to Google Drive (if authenticated) to test cloud integration</li>
              <li>Try removing files to see the enhanced removal dialog</li>
              <li>Test different file types: images, PDFs, documents, and invalid types</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestingPage;
