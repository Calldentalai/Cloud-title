'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, Image } from 'lucide-react';
import { FileData } from '@/lib/types';

interface FileDropzoneProps {
  onFileSelect: (file: FileData) => void;
  accept?: string;
  currentFile?: FileData | null;
  onRemove?: () => void;
}

export default function FileDropzone({
  onFileSelect,
  accept = '*',
  currentFile,
  onRemove,
}: FileDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const reader = new FileReader();

        reader.onload = () => {
          const base64 = reader.result as string;
          onFileSelect({
            filename: file.name,
            base64,
            type: file.type,
            size: file.size,
          });
        };

        reader.readAsDataURL(file);
      }
    },
    [onFileSelect]
  );

  const acceptObj = accept.split(',').reduce((acc, type) => {
    const trimmed = type.trim();
    acc[trimmed] = [];
    return acc;
  }, {} as Record<string, string[]>);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptObj,
    maxFiles: 1,
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const isImage = currentFile?.type.startsWith('image/');

  if (currentFile) {
    return (
      <div className="w-full p-6 border-2 border-green-200 bg-green-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isImage ? (
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border">
                <img
                  src={currentFile.base64}
                  alt={currentFile.filename}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="text-blue-600" size={32} />
              </div>
            )}
            <div>
              <p className="font-medium text-gray-800">{currentFile.filename}</p>
              <p className="text-sm text-gray-500">{formatFileSize(currentFile.size)}</p>
            </div>
          </div>
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`w-full p-12 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
        isDragActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="p-4 bg-blue-100 rounded-full">
          <Upload className="text-blue-600" size={32} />
        </div>
        {isDragActive ? (
          <p className="text-lg text-blue-600">Drop the file here...</p>
        ) : (
          <>
            <p className="text-lg text-gray-600">
              Drag & drop your file here, or <span className="text-blue-600 font-medium">browse</span>
            </p>
            <p className="text-sm text-gray-400">
              {accept.includes('image') && 'PNG, SVG, JPG'}
              {accept.includes('pdf') && !accept.includes('image') && 'PDF files'}
              {accept.includes('pdf') && accept.includes('image') && 'Images or PDF'}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
