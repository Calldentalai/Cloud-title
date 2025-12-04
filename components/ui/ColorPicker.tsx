'use client';

import { ChangeEvent } from 'react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleHexChange = (e: ChangeEvent<HTMLInputElement>) => {
    let hex = e.target.value;
    if (!hex.startsWith('#')) {
      hex = '#' + hex;
    }
    if (/^#[0-9A-Fa-f]{0,6}$/.test(hex)) {
      onChange(hex);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <div className="flex items-center gap-3 md:gap-4">
        <div className="relative shrink-0">
          <input
            type="color"
            value={value}
            onChange={handleColorChange}
            className="w-12 h-12 md:w-16 md:h-16 rounded-lg cursor-pointer border-2 border-gray-200"
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={handleHexChange}
          placeholder="#000000"
          className="flex-1 px-3 py-2 md:px-4 md:py-3 text-base md:text-lg border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors uppercase"
        />
        <div
          className="w-12 h-12 md:w-16 md:h-16 rounded-lg border-2 border-gray-200 shrink-0"
          style={{ backgroundColor: value }}
        />
      </div>
    </div>
  );
}
