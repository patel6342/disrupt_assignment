import React from 'react';

const Dropdown = ({ label, options, selected, onChange }) => {
  const placeholder = "Select an option";

  return (
    <div className="relative flex flex-row justify-between items-center gap-2">
      
      <label className="block mb-1  text-sm  text-center font-medium text-[#1D1929B2]">{label}</label>
      <select
        value={selected || ""} 
        onChange={(e) => onChange({id:e.target.value})} 
        className="block  border border-gray-300 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="" disabled>
          {selected ? options.find(option => option.id === selected)?.name || placeholder : placeholder}
        </option>

      
        {options.map(option => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
