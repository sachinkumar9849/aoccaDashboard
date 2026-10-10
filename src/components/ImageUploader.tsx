"use client";
import React, { useState, useRef, useEffect } from "react";
import { Upload, X, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  onImageChange: (file: File | null) => void;
  currentImage?: string | null;
  allowedTypes?: string[];
  maxSizeMB?: number;
}

const compressImage = async (file: File, maxTargetSizeBytes = 950 * 1024): Promise<File> => {
  if (typeof window === "undefined" || file.size <= maxTargetSizeBytes || !file.type.startsWith("image/")) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;
      const maxDimension = 1600;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      const outputType = file.type === "image/png" ? "image/webp" : (file.type === "image/jpeg" || file.type === "image/jpg" ? "image/jpeg" : file.type);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const extension = outputType === "image/jpeg" ? ".jpg" : (outputType === "image/webp" ? ".webp" : "");
          const newName = extension ? file.name.replace(/\.[^.]+$/, extension) : file.name;
          const compressedFile = new File([blob], newName, {
            type: outputType,
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        },
        outputType,
        0.82
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
};

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageChange,
  currentImage = null,
  allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"],
  maxSizeMB = 5,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
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

  const handleFileValidation = async (file: File) => {
    setError(null);
    
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      setError(`Invalid file type. Allowed types: ${allowedTypes.join(", ")}`);
      return;
    }
    
    // Check hard limit against maxSizeMB before compression
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`File size exceeds ${maxSizeMB}MB limit`);
      return;
    }

    let processedFile = file;

    // Automatically optimize images larger than 900KB so they fit within server limit (~1MB)
    if (file.size > 900 * 1024) {
      try {
        setIsCompressing(true);
        processedFile = await compressImage(file, 900 * 1024);
      } catch (err) {
        console.error("Compression error:", err);
      } finally {
        setIsCompressing(false);
      }
    }
    
    // Create preview
    const objectUrl = URL.createObjectURL(processedFile);
    setPreview(objectUrl);
    
    // Pass file to parent component
    onImageChange(processedFile);
    
    return () => URL.revokeObjectURL(objectUrl);
  };

  const handleRemoveImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
        accept={allowedTypes.join(",")}
        className="hidden"
        aria-label="Upload image"
      />
      
      {!preview ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            isDragging ? "border-brand-500 bg-brand-50" : "border-gray-300 hover:border-brand-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClickUpload}
          style={{ maxHeight: "200px" }}
        >
          {isCompressing ? (
            <>
              <Loader2 className="w-10 h-10 text-brand-500 animate-spin mb-2" />
              <p className="text-sm font-medium text-gray-700">
                Optimizing image for upload...
              </p>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-700">
                Drag and drop an image here or click to browse
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: {allowedTypes.map(type => type.split("/")[1]).join(", ")}
              </p>
              <p className="text-xs text-gray-500">
                Max size: {maxSizeMB}MB (auto-optimized)
              </p>
            </>
          )}
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
