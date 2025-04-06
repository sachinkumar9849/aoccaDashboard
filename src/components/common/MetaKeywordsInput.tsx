

import { useField } from 'formik';
import React, { useState, KeyboardEvent } from 'react';


interface MetaKeywordsInputProps {
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
}

const MetaKeywordsInput: React.FC<MetaKeywordsInputProps> = ({ 
  name, 
  label, 
  placeholder = "Enter keywords and press Enter", 
  className = "" 
}) => {
  const [field, meta, helpers] = useField<string[]>(name || "keywords");
  const [inputValue, setInputValue] = useState<string>('');
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault();
      const newKeywords = [...field.value, inputValue.trim()];
      helpers.setValue(newKeywords);
      setInputValue('');
    }
  };
  
  const removeKeyword = (index: number) => {
    const newKeywords = [...field.value];
    newKeywords.splice(index, 1);
    helpers.setValue(newKeywords);
  };

  return (
    <div className={className}>
      <label className="mb-2.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="flex flex-col gap-2">
        <input
          className="w-full rounded-md border border-gray-300 bg-white py-2 px-4 text-sm outline-none transition focus:border-primary focus:shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {meta.touched && meta.error ? (
          <div className="text-error-500 text-xs mt-1">{meta.error}</div>
        ) : null}
        
        {field.value && field.value.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {field.value.map((keyword, index) => (
              <div 
                key={index} 
                className="bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded-full flex items-center gap-1 text-sm"
              >
                <span>{keyword}</span>
                <button 
                  type="button" 
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                  onClick={() => removeKeyword(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetaKeywordsInput;