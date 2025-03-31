import React, { useState, useRef, useEffect } from 'react';

const TaggingDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const dropdownRef = useRef(null);

  // Sample tag options
  const tagOptions = [
    { id: 1, name: 'Hot' },
    { id: 2, name: 'Warm' },
    { id: 3, name: 'Cold' },
   
  ];

  // Filter options based on input
  const filteredOptions = tagOptions.filter(
    tag => tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
    !selectedTags.some(selectedTag => selectedTag.id === tag.id)
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Select a tag
  const selectTag = (tag) => {
    setSelectedTags([...selectedTags, tag]);
    setInputValue('');
    setIsOpen(false);
  };

  // Remove a tag
  const removeTag = (tagId) => {
    setSelectedTags(selectedTags.filter(tag => tag.id !== tagId));
  };

  return (
    <div className="">
      <div className="relative" ref={dropdownRef}>
        {/* Input field with tags */}
        <div 
          className="relative w-full flex items-center justify-between bg-white border border-gray-300 rounded-md py-1 px-3 text-left cursor-pointer focus:outline-none"
          onClick={() => setIsOpen(true)}
        >
          {selectedTags.map(tag => (
            <div key={tag.id} className="flex items-center bg-blue-100 text-blue-800 rounded-md m-1">
              <span>{tag.name}</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(tag.id);
                }}
                className="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none"
              >
                ×
              </button>
            </div>
          ))}
          <input 
            type="text"
            className="flex-grow outline-none p-1 min-w-[80px]"
            placeholder={selectedTags.length === 0 ? "Select tags..." : ""}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
          />
        </div>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <div 
                  key={option.id}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => selectTag(option)}
                >
                  {option.name}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500">No tags found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaggingDropdown;