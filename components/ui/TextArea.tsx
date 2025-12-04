'use client';

import { ChangeEvent, KeyboardEvent } from 'react';

interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export default function TextArea({
  value,
  onChange,
  onKeyDown,
  placeholder,
  rows = 4,
  className = '',
}: TextAreaProps) {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <textarea
      value={value}
      onChange={handleChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors resize-none ${className}`}
    />
  );
}
