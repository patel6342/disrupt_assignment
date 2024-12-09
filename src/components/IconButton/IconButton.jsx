// IconButton.js
import React from 'react';

const IconButton = ({ IconComponent, alt, color = '#000', onClick, className = '' }) => {
  return (
    <div
      onClick={onClick}
      className={`w-5 h-5 cursor-pointer ${className}`}
      style={{ color }}
    >
      <IconComponent />
    </div>
  );
};

export default IconButton;
