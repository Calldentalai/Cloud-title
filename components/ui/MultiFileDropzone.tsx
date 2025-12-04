'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, Loader2 } from 'lucide-react';
import { FileData } from '@/lib/types';

interface MultiFileDropzoneProps {
  onFilesSelect: (files: FileData[]) => void;
  accept?: string;
  currentFiles: FileData[];
  onRemove: (index: number) => void;
}

export default function MultiFileDropzone({
  onFilesSelect,
  accept = '*',
  currentFiles,
  onRemove,
}: MultiFileDropzoneProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsUploading(true);
      setUploadError(null);
      const newFiles: FileData[] = [];

      try {
        for (const file of acceptedFiles) {
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Failed to upload ${file.name}`);
          }

          const data = await response.json();

          newFiles.push({
            filename: data.filename,
            url: data.url,
            type: data.type,
            size: data.size,
          });
        }

        onFilesSelect([...currentFiles, ...newFiles]);
      } catch (error) {
        console.error('Upload error:', error);
        setUploadError('Failed to upload one or more files. Please try again.');
      } finally {
        setIsUploading(false);
      }
    },
    [currentFiles, onFilesSelect]
  );

  const acceptObj = accept.split(',').reduce((acc, type) => {
    const trimmed = type.trim();
    acc[trimmed] = [];
    return acc;
  }, {} as Record<string, string[]>);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptObj,
    multiple: true,
    disabled: isUploading,
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full space-y-4">
      <div
        {...getRootProps()}
        className={`w-full p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          isUploading
            ? 'border-blue-300 bg-blue-50 cursor-wait'
            : isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3 text-center">
          {isUploading ? (
            <>
              <Loader2 className="text-blue-500 animate-spin" size={28} />
              <p className="text-blue-600">Uploading files...</p>
            </>
          ) : isDragActive ? (
            <>
              <Upload className="text-blue-500" size={28} />
              <p className="text-blue-600">Drop files here...</p>
            </>
          ) : (
            <>
              <Upload className="text-gray-400" size={28} />
              <p className="text-gray-600">
                Drag & drop files here, or <span className="text-blue-600 font-medium">browse</span>
              </p>
            </>
          )}
        </div>
      </div>

      {uploadError && (
        <p className="text-sm text-red-500 text-center">{uploadError}</p>
      )}

      {currentFiles.length > 0 && (
        <div className="space-y-2">
          {currentFiles.map((file, index) => (
            <div
              key={`${file.filename}-${index}`}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
            >
              <div className="flex items-center gap-3">
                <FileText className="text-blue-500" size={24} />
                <div>
                  <p className="font-medium text-gray-800 text-sm">{file.filename}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
