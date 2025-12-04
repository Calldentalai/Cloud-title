'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText } from 'lucide-react';
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
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const newFiles: FileData[] = [];

      for (const file of acceptedFiles) {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        newFiles.push({
          filename: file.name,
          base64,
          type: file.type,
          size: file.size,
        });
      }

      onFilesSelect([...currentFiles, ...newFiles]);
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
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3 text-center">
          <Upload className="text-gray-400" size={28} />
          {isDragActive ? (
            <p className="text-blue-600">Drop files here...</p>
          ) : (
            <p className="text-gray-600">
              Drag & drop files here, or <span className="text-blue-600 font-medium">browse</span>
            </p>
          )}
        </div>
      </div>

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
