import React, { useState, useRef, useEffect } from "react";
import { Upload, X } from "lucide-react";

interface ImageUploaderProps {
  onImageChange: (file: File | null) => void;
  currentImage?: string | null;
  allowedTypes?: string[];
  maxSizeMB?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageChange,
  currentImage = null,
  allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"],
  maxSizeMB = 5,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when currentImage prop changes
  useEffect(() => {
    if (currentImage) {
      setPreview(currentImage);
    } else {
      setPreview(null);
    }
  }, [currentImage]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileValidation(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileValidation(e.target.files[0]);
    }
  };

  const handleFileValidation = (file: File) => {
    setError(null);
    
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      setError(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
      return;
    }
    
    // Check file size (convert MB to bytes)
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`File size exceeds ${maxSizeMB}MB limit`);
      return;
    }
    
    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    
    // Pass file to parent component
    onImageChange(file);
    
    return () => URL.revokeObjectURL(objectUrl);
  };

  const handleRemoveImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setPreview(null);
    onImageChange(null);
  };

  const handleClickUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={allowedTypes.join(',')}
        className="hidden"
        aria-label="Upload image"
      />
      
      {!preview ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            isDragging ? 'border-brand-500 bg-brand-50' : 'border-gray-300 hover:border-brand-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClickUpload}
          style={{ maxHeight: "200px" }}
        >
          <Upload className="w-12 h-12 text-gray-400 mb-2" />
          <p className="text-sm font-medium text-gray-700">
            Drag and drop an image here or click to browse
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: {allowedTypes.map(type => type.split('/')[1]).join(', ')}
          </p>
          <p className="text-xs text-gray-500">
            Max size: {maxSizeMB}MB
          </p>
        </div>
      ) : (
        <div className="relative border rounded-lg overflow-hidden" style={{ maxHeight: "200px" }}>
          <img 
            src={preview} 
            alt="Image preview" 
            className="w-full h-full object-cover"
            style={{ maxHeight: "300px" }}
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
            aria-label="Remove image"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
};

export default ImageUploader;