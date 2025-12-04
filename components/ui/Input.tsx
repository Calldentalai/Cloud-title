'use client';

import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'tel' | 'url';
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autoFocus?: boolean;
  required?: boolean;
  className?: string;
}

export default function Input({
  type = 'text',
  value,
  onChange,
  onKeyDown,
  placeholder,
  autoFocus = false,
  required = false,
  className = '',
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative w-full">
      <input
        type={inputType}
        value={value}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        required={required}
        className={`w-full px-4 py-3 md:px-6 md:py-4 text-base md:text-xl border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors bg-white ${className}`}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  );
}
