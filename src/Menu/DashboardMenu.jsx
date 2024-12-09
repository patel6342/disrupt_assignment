import React, { useState, useCallback } from 'react';
import { debounce } from 'lodash';

const DashboardMenu = React.memo(({ onSearch, handleAddChallengeClick, role, username }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce the search input to improve performance
  const debouncedSearch = useCallback(
    debounce((term) => {
      onSearch(term);
    }, 300),
    [onSearch]
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <div className="container mx-auto py-4">
      <div className="flex flex-col md:flex-row justify-between bg-white shadow-md p-4 rounded-md">
        <div className="flex flex-col items-start justify-center space-y-4 md:space-y-0 md:space-x-4 pt-3">
          <h1 className="work-sans-style text-gray-800 ml-4">Hello!</h1>
          <span className="text-gray-600 inter-style capitalize pt-1">{username}</span>
        </div>

        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto pt-3">
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search By Title..."
              className="px-4 py-2 border inter-style border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-auto pl-10"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1114.1 3.6a7.5 7.5 0 012.55 12.9z" />
              </svg>
            </div>
          </div>
          {role === 'game_master' && (
            <button
              onClick={handleAddChallengeClick}
              className="px-4 py-2 text-blue-500 font-bold border border-blue-500 rounded-md hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-auto"
            >
              + Add Challenge
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default DashboardMenu;
