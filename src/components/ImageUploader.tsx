"use client";
import React, { useRef, ChangeEvent, DragEvent } from 'react';
interface ImageUploaderProps {
  onImageUpload?: (file: File) => void;
  preview?: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, preview }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file || !file.type.match('image.*')) return;
    if (onImageUpload) onImageUpload(file);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.currentTarget.classList.add('border-blue-500');
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>): void => {
    event.currentTarget.classList.remove('border-blue-500');
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.currentTarget.classList.remove('border-blue-500');
    
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.match('image.*') && onImageUpload) {
      onImageUpload(file);
    }
  };

  const triggerFileInput = (): void => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />
      
      <div
        className="border-1 border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors mb-4"
        onClick={triggerFileInput}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="max-h-48 mx-auto mb-2"
          />
        ) : (
          <div className="py-8">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-600">
              Click to select or drag and drop an image here
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Supports: JPG, PNG, GIF, etc.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;