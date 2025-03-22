"use client";
import React, { useState, useRef } from 'react';

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    if (selectedFile.size > 2 * 1024 * 1024) {
      alert("File is too large. Maximum size is 2MB.");
      return;
    }
    
    setFile(selectedFile);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(selectedFile);
    
    // Simulate upload progress
    simulateUpload();
  };
  
  const simulateUpload = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      if (droppedFile.size > 2 * 1024 * 1024) {
        alert("File is too large. Maximum size is 2MB.");
        return;
      }
      
      setFile(droppedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(droppedFile);
      
      // Simulate upload progress
      simulateUpload();
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };
  
  return (
    <div>
      {preview ? (
        <div className="relative mt-2 p-2 bg-white border border-gray-200 rounded-xl">
          <img className="mb-2 w-full object-cover rounded-lg" src={preview} alt="Upload preview" />
          
          <div className="mb-1 flex justify-between items-center gap-x-3 whitespace-nowrap">
            <div className="w-10">
              <span className="text-sm text-gray-800">
                {progress}%
              </span>
            </div>
            
            <div className="flex items-center gap-x-2">
              <button 
                type="button" 
                className="text-gray-500 hover:text-gray-800 focus:outline-hidden focus:text-gray-800"
                onClick={removeFile}
              >
                <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  <line x1="10" x2="10" y1="11" y2="17"></line>
                  <line x1="14" x2="14" y1="11" y2="17"></line>
                </svg>
              </button>
            </div>
          </div>
          
          <div className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
            <div 
              className={`flex flex-col justify-center rounded-full overflow-hidden bg-blue-600 text-xs text-white text-center whitespace-nowrap transition-all duration-500 ${progress === 100 ? 'bg-green-500' : ''}`} 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      ) : (
        <div 
          className="cursor-pointer p-12 flex justify-center bg-white border border-dashed border-gray-300 rounded-xl"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleBrowseClick}
        >
          <div className="text-center">
            <span className="inline-flex justify-center items-center size-16 bg-gray-100 text-gray-800 rounded-full">
              <svg className="shrink-0 size-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" x2="12" y1="3" y2="15"></line>
              </svg>
            </span>
            
            <div className="mt-4 flex flex-wrap justify-center text-sm/6 text-gray-600">
              <span className="pe-1 font-medium text-gray-800">
                Drop your file here or
              </span>
              <span className="bg-white font-semibold text-blue-600 hover:text-blue-700 rounded-lg decoration-2 hover:underline focus-within:outline-hidden focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2">browse</span>
            </div>
            
            <p className="mt-1 text-xs text-gray-400">
              Pick a file up to 2MB.
            </p>
          </div>
        </div>
      )}
      
      <input 
        type="file" 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange} 
        ref={fileInputRef}
      />
    </div>
  );
};

export default ImageUpload;