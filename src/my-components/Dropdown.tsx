import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../js/cn';

interface Option {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface DropdownProps {
  options: Option[];
  label?: string;
  placeholder?: string;
  isMulti?: boolean;
  isSearchable?: boolean;
  isPaginated?: boolean;
  onChange: (selected: Option[] | Option | null) => void;
  pageSize?: number;
  className?: string;
  isDarkMode?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  label,
  placeholder = 'Select...',
  isMulti = false,
  isSearchable = false,
  isPaginated = false,
  onChange,
  pageSize = 5,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentOptions, setCurrentOptions] = useState<Option[]>(
    options.slice(0, pageSize),
  );
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search functionality
  useEffect(() => {
    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setCurrentOptions(
      filteredOptions.slice(0, isPaginated ? pageSize : filteredOptions.length),
    );
  }, [searchQuery, options, isPaginated, pageSize]);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelect = (option: Option) => {
    if (isMulti) {
      const alreadySelected = selectedOptions.find(
        (opt) => opt.value === option.value,
      );
      const updatedOptions = alreadySelected
        ? selectedOptions.filter((opt) => opt.value !== option.value)
        : [...selectedOptions, option];
      setSelectedOptions(updatedOptions);
      onChange(updatedOptions);
    } else {
      setSelectedOptions([option]);
      onChange(option);
      setIsOpen(false);
    }
  };

  const loadMore = () => {
    const currentLength = currentOptions.length;
    const nextOptions = options.slice(currentLength, currentLength + pageSize);
    setCurrentOptions((prev) => [...prev, ...nextOptions]);
  };

  return (
    <div ref={dropdownRef} className={cn('relative w-full', className)}>
      {label && (
        <label className={cn('block mb-2 dark:text-white text-black')}>
          {label}
        </label>
      )}
      <div
        className={cn(
          'border w-full rounded-md px-4 py-2 cursor-pointer bg-gray-800 border-gray-700 dark:text-white bg-white border-gray-300 text-black',
        )}
        onClick={toggleDropdown}
      >
        {selectedOptions.length > 0
          ? isMulti
            ? selectedOptions.map((option) => option.label).join(', ')
            : selectedOptions[0].label
          : placeholder}
      </div>
      {isOpen && (
        <div
          className={cn(
            'absolute w-full z-10 mt-1 border rounded-md shadow-lg max-h-60 overflow-auto bg-gray-800 border-gray-700 dark:text-white bg-white border-gray-300 text-black',
          )}
        >
          {isSearchable && (
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'w-full px-3 py-2 border-b outline-none bg-gray-700 dark:text-white bg-white text-black',
              )}
            />
          )}
          {currentOptions.map((option) => (
            <div
              key={option.value}
              className={cn(
                'flex w-full items-center gap-2 px-4 py-2 cursor-pointer dark:bg-slate-900 dark:hover:bg-slate-800 bg-slate-100 hover:bg-slate-300',
                selectedOptions.find((opt) => opt.value === option.value) &&
                  'font-semibold',
              )}
              onClick={() => handleSelect(option)}
            >
              {option.icon && <span className="w-5 h-5">{option.icon}</span>}
              <span>{option.label}</span>
            </div>
          ))}
          {isPaginated && currentOptions.length < options.length && (
            <div
              className={cn(
                'px-4 py-2 text-center text-sm cursor-pointer hover:bg-gray-700 hover:bg-gray-200',
              )}
              onClick={loadMore}
            >
              Load More
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
