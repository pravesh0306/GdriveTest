// File validation utilities for enhanced upload experience

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  warnings?: string[];
}

export interface FileValidationOptions {
  maxSize: number; // in MB
  allowedTypes: string[];
  maxFiles?: number;
  requireValidExtension?: boolean;
}

// Comprehensive file type mappings
export const FILE_TYPE_MAPPINGS = {
  // Images
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  'image/svg+xml': ['.svg'],
  'image/bmp': ['.bmp'],
  'image/tiff': ['.tiff', '.tif'],
  
  // Documents
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'text/plain': ['.txt'],
  'text/csv': ['.csv'],
  'application/rtf': ['.rtf'],
  
  // Archives
  'application/zip': ['.zip'],
  'application/x-rar-compressed': ['.rar'],
  'application/x-7z-compressed': ['.7z'],
  'application/x-tar': ['.tar'],
  'application/gzip': ['.gz'],
  
  // Audio
  'audio/mpeg': ['.mp3'],
  'audio/wav': ['.wav'],
  'audio/ogg': ['.ogg'],
  'audio/aac': ['.aac'],
  'audio/webm': ['.webm'],
  
  // Video
  'video/mp4': ['.mp4'],
  'video/webm': ['.webm'],
  'video/ogg': ['.ogv'],
  'video/avi': ['.avi'],
  'video/quicktime': ['.mov'],
  'video/x-msvideo': ['.avi'],
};

export const DEFAULT_ALLOWED_TYPES = [
  'image/*',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/csv'
];

export const validateFile = (file: File, options: FileValidationOptions): FileValidationResult => {
  const warnings: string[] = [];
  
  // Check file size
  if (file.size > options.maxSize * 1024 * 1024) {
    return {
      isValid: false,
      error: `File "${file.name}" is too large. Maximum size is ${options.maxSize}MB, but file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`
    };
  }
  
  // Check if file is empty
  if (file.size === 0) {
    return {
      isValid: false,
      error: `File "${file.name}" is empty.`
    };
  }
  
  // Check file type
  const isValidType = options.allowedTypes.some(allowedType => {
    if (allowedType.endsWith('/*')) {
      // Handle wildcard types like 'image/*'
      const category = allowedType.replace('/*', '');
      return file.type.startsWith(category + '/');
    } else if (allowedType.startsWith('.')) {
      // Handle extension-based validation
      return file.name.toLowerCase().endsWith(allowedType.toLowerCase());
    } else {
      // Handle exact MIME type matching
      return file.type === allowedType;
    }
  });
  
  if (!isValidType) {
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    return {
      isValid: false,
      error: `File type "${file.type || fileExtension}" is not allowed. Allowed types: ${options.allowedTypes.join(', ')}`
    };
  }
  
  // Extension validation (if required)
  if (options.requireValidExtension) {
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const validExtensions = FILE_TYPE_MAPPINGS[file.type as keyof typeof FILE_TYPE_MAPPINGS];
    
    if (validExtensions && !validExtensions.includes(fileExtension)) {
      warnings.push(`File extension "${fileExtension}" doesn't match MIME type "${file.type}". This might indicate a renamed file.`);
    }
  }
  
  // Check for potentially dangerous file names
  const dangerousPatterns = [
    /[\x00-\x1f\x80-\x9f]/,  // Control characters
    /[<>:"/\\|?*]/,          // Reserved characters
    /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(\.|$)/i, // Windows reserved names
  ];
  
  if (dangerousPatterns.some(pattern => pattern.test(file.name))) {
    warnings.push(`File name "${file.name}" contains potentially problematic characters.`);
  }
  
  return {
    isValid: true,
    warnings: warnings.length > 0 ? warnings : undefined
  };
};

export const validateFiles = (files: File[], options: FileValidationOptions): {
  validFiles: File[];
  invalidFiles: { file: File; error: string }[];
  warnings: { file: File; warnings: string[] }[];
} => {
  const validFiles: File[] = [];
  const invalidFiles: { file: File; error: string }[] = [];
  const warnings: { file: File; warnings: string[] }[] = [];
  
  // Check total file count
  if (options.maxFiles && files.length > options.maxFiles) {
    throw new Error(`Too many files selected. Maximum allowed: ${options.maxFiles}, selected: ${files.length}`);
  }
  
  for (const file of files) {
    const result = validateFile(file, options);
    
    if (result.isValid) {
      validFiles.push(file);
      if (result.warnings) {
        warnings.push({ file, warnings: result.warnings });
      }
    } else {
      invalidFiles.push({ file, error: result.error! });
    }
  }
  
  return { validFiles, invalidFiles, warnings };
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileTypeIcon = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType.startsWith('video/')) return '🎥';
  if (mimeType.startsWith('audio/')) return '🎵';
  if (mimeType === 'application/pdf') return '📄';
  if (mimeType.includes('word')) return '📝';
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
  if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return '📽️';
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('7z')) return '🗜️';
  if (mimeType.startsWith('text/')) return '📋';
  
  return '📎';
};
