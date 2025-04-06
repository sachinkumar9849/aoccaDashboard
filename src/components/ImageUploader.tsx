"use client";
import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
interface ImageUploaderProps {
  onImageUpload?: (file: File) => void;
  preview?: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match('image.*')) {
      setUploadStatus('Please select an image file');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    setSelectedImage(file);
    setUploadStatus('');
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
    
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0];
      
      if (!file.type.match('image.*')) {
        setUploadStatus('Please select an image file');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      setSelectedImage(file);
      setUploadStatus('');
    }
  };

  const handleUpload = async (): Promise<void> => {
    if (!selectedImage) {
      setUploadStatus('Please select an image first');
      return;
    }

    setUploadStatus('Uploading...');

    // Example upload implementation
    // In a real application, you would send this to your backend API
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      
      // Example API call - replace with your actual API endpoint
      // const response = await fetch('https://your-api.com/upload', {
      //   method: 'POST',
      //   body: formData,
      // });
      
      // Simulating upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUploadStatus('Upload successful!');
      // Optionally clear the image after successful upload
      // setSelectedImage(null);
      // setPreviewUrl('');
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStatus('Upload failed. Please try again.');
    }
  };

  const triggerFileInput = (): void => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />
      
      {/* Drag & drop area */}
      <div
        className="border-1 border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors mb-4"
        onClick={triggerFileInput}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
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
      
      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={!selectedImage}
        className={`mx-auto flex text-center py-2 px-4 rounded ${
          selectedImage
            ? 'bg-brand-500 hover:bg-blue-600 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        } transition-colors`}
      >
        Upload Image
      </button>
      
      {/* Status message */}
      {uploadStatus && (
        <p className={`absolute bottom-[10px] mt-2 text-sm ${
          uploadStatus.includes('successful')
            ? 'text-green-600'
            : uploadStatus.includes('Uploading')
              ? 'text-blue-600'
              : 'text-red-600'
        }`}>
          {uploadStatus}
        </p>
      )}

      {/* Image details */}
      {/* {selectedImage && (
        <div className="mt-4 text-sm text-gray-600">
          <p><span className="font-medium">File name:</span> {selectedImage.name}</p>
          <p><span className="font-medium">Size:</span> {Math.round(selectedImage.size / 1024)} KB</p>
          <p><span className="font-medium">Type:</span> {selectedImage.type}</p>
        </div>
      )} */}
    </div>
  );
};

export default ImageUploader;