import React from 'react';
import { Link } from 'react-router-dom';

const UnprocessableEntity = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-800">422</h1>
        <p className="text-2xl font-semibold text-gray-600">Unprocessable Entity</p>
        <p className="text-gray-500 my-4">The server was unable to process the request because it contains invalid data..</p>
        <Link
          to="/"
          className="mt-8 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default UnprocessableEntity;
