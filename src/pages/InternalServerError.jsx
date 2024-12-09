import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const InternalServerError = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-800">500</h1>
        <p className="text-2xl font-semibold text-gray-600">Internal Server Error</p>
        <p className="text-gray-500 my-4">Something went wrong on our end. Please try again later.</p>
        <button
        onClick={() => useNavigate('/challenges')}
        className="mt-8 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
      >
        Go Back
      </button>
      </div>
    </div>
  );
};

export default InternalServerError;
