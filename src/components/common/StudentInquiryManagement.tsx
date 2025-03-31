import React, { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  options: Option[];
  placeholder?: string;
  label?: string;
  onChange: (value: string) => void;
  value?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  options,
  placeholder = "Select an option",
  label,
  onChange,
  value
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (option: Option): void => {
    onChange(option.value);
    setIsOpen(false);
    setSearchTerm('');
  };

  const toggleDropdown = (): void => {
    setIsOpen(!isOpen);

    // When opening, clear the search and focus the input
    if (!isOpen) {
      setSearchTerm('');
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 10);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div ref={dropdownRef} className="w-full">
        {/* Selection display */}
        <button
          type="button"
          onClick={toggleDropdown}
          className="relative w-full flex items-center justify-between bg-white border border-gray-300 rounded-md py-2 px-3 text-left cursor-pointer focus:outline-none "
        >
          <span className={`block truncate ${!selectedOption ? 'text-gray-500' : ''}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className="pointer-events-none">
            <svg className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md overflow-hidden border border-gray-300">
            {/* Search input */}
            <div className="p-2 border-b border-gray-300">
              <input
                ref={searchInputRef}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0e569f] focus:border-[#0e569f] text-sm"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Options list */}
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option)}
                    className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${option.value === value ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                      }`}
                  >
                    {option.label}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500 text-center">No options found</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Example usage
const StudentInquiryManagement: React.FC = () => {
  const [selectedValue, setSelectedValue] = useState<string>('');

  const options: Option[] = [
    { value: 'apple', label: 'Phone'},
    { value: 'banana', label: 'Physical Visit'},
    { value: 'Website', label: 'Website '},
    { value: 'Social', label: 'Social'},
  ];

  return (
    <div className="">
      <SelectField
        options={options}
        value={selectedValue}
        onChange={setSelectedValue}
        label="Lead Status"
        placeholder="Choose a "
      />
    </div>
  );
};

export default StudentInquiryManagement;