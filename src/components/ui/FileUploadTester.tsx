import React, { useState } from 'react';
import { Upload, FileCheck, AlertTriangle, RefreshCw } from 'lucide-react';
import DragDropUpload from './DragDropUpload';
import AttachmentGrid from './AttachmentGrid';
import Button from './Button';
import { validateFiles, FileValidationOptions } from '../../utils/fileValidation';

interface TestFile {
  id: string;
  file: File;
  driveUrl?: string;
  uploadedAt?: string;
}

const FileUploadTester: React.FC = () => {
  const [testFiles, setTestFiles] = useState<TestFile[]>([]);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${result}`]);
  };

  const handleFileUpload = (files: File[]) => {
    addTestResult(`✅ Upload successful: ${files.length} files`);
    const newTestFiles: TestFile[] = files.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      driveUrl: (file as any).driveUrl,
      uploadedAt: new Date().toISOString()
    }));
    setTestFiles(prev => [...prev, ...newTestFiles]);
  };

  const handleRemove = (index: number) => {
    addTestResult(`🗑️ File removed: ${testFiles[index].file.name}`);
    setTestFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleError = (error: string) => {
    addTestResult(`❌ Error: ${error}`);
  };

  const runValidationTests = () => {
    setIsLoading(true);
    addTestResult('🧪 Running validation tests...');
    
    // Create test files
    const testCases = [
      { name: 'valid-image.jpg', type: 'image/jpeg', size: 1024 * 1024 }, // 1MB
      { name: 'large-image.jpg', type: 'image/jpeg', size: 15 * 1024 * 1024 }, // 15MB - should trigger warning
      { name: 'invalid-file.exe', type: 'application/x-msdownload', size: 1024 }, // Invalid type
      { name: 'valid-document.pdf', type: 'application/pdf', size: 2 * 1024 * 1024 }, // 2MB
    ];

    testCases.forEach(testCase => {
      const mockFile = new File([''], testCase.name, { type: testCase.type });
      Object.defineProperty(mockFile, 'size', { value: testCase.size });

      const options: FileValidationOptions = {
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['image/*', 'application/pdf', 'text/*'],
        maxFiles: 10,
        requireValidExtension: true
      };

      const { validFiles, invalidFiles, warnings } = validateFiles([mockFile], options);

      if (invalidFiles.length > 0) {
        addTestResult(`❌ ${testCase.name}: ${invalidFiles[0].error}`);
      } else if (warnings.length > 0) {
        addTestResult(`⚠️ ${testCase.name}: ${warnings[0].warnings.join(', ')}`);
      } else {
        addTestResult(`✅ ${testCase.name}: Valid`);
      }
    });

    setIsLoading(false);
    addTestResult('🏁 Validation tests completed');
  };

  const clearResults = () => {
    setTestResults([]);
    addTestResult('🧹 Test results cleared');
  };

  const clearFiles = () => {
    setTestFiles([]);
    addTestResult('🗂️ All test files cleared');
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          File Upload Testing Suite
        </h2>
      </div>

      {/* Test Controls */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button
          variant="primary"
          onClick={runValidationTests}
          disabled={isLoading}
          icon={isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileCheck className="w-4 h-4" />}
        >
          Run Validation Tests
        </Button>
        <Button
          variant="outline"
          onClick={clearResults}
        >
          Clear Results
        </Button>
        <Button
          variant="outline"
          onClick={clearFiles}
        >
          Clear Files
        </Button>
      </div>

      {/* Upload Component */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Enhanced Drag & Drop Upload
        </h3>
        <DragDropUpload
          onUpload={handleFileUpload}
          maxSize={10 * 1024 * 1024} // 10MB
          acceptedTypes={['image/*', 'application/pdf', 'text/*']}
          maxFiles={5}
          enableBatchProgress={true}
        />
      </div>

      {/* Uploaded Files Grid */}
      {testFiles.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Uploaded Files ({testFiles.length})
          </h3>
          <AttachmentGrid
            attachments={testFiles.map(tf => ({
              name: tf.file.name,
              size: `${(tf.file.size / 1024).toFixed(1)} KB`,
              type: tf.file.type,
              file: tf.file,
              driveUrl: tf.driveUrl,
              uploadedAt: tf.uploadedAt
            }))}
            onRemove={handleRemove}
          />
        </div>
      )}

      {/* Test Results */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Test Results
        </h3>
        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 max-h-96 overflow-y-auto">
          {testResults.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 italic">
              No test results yet. Run some tests or upload files to see results.
            </p>
          ) : (
            <div className="space-y-1">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className="text-sm font-mono text-slate-700 dark:text-slate-300 p-2 rounded bg-white dark:bg-slate-800"
                >
                  {result}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Feature Status */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h4 className="font-semibold text-green-800 dark:text-green-200">Enhanced Validation</h4>
          </div>
          <p className="text-sm text-green-700 dark:text-green-300">
            Comprehensive file validation with detailed error messages and warnings
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h4 className="font-semibold text-blue-800 dark:text-blue-200">Batch Progress</h4>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Individual file progress tracking with cancel and retry capabilities
          </p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h4 className="font-semibold text-purple-800 dark:text-purple-200">Smart Removal</h4>
          </div>
          <p className="text-sm text-purple-700 dark:text-purple-300">
            Context-aware file removal with Google Drive status awareness
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUploadTester;
