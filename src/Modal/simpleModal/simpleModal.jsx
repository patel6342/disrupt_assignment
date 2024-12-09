import React from 'react';
import Button from '../../components/Button/Button';
import { useAuth } from '../../routes/AuthContext';
const SimplePopup = ({ confirmTitle, confirmDesc, onClose, onConfirm }) => {
  const {role} = useAuth();

  const handleConfirm = () => {
    if(role==="judge"){
      onConfirm(false); 
    }
    if(role!=='judge'){
      onConfirm();
    }
    onClose();   
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 p-4">
      <div className="relative bg-white rounded-lg flex flex-col justify-center shadow-lg w-full max-w-md md:max-w-lg h-auto">
      <div className='flex linearbg p-4 '>
        <button
          type="button"
          onClick={onClose}
          className="absolute text-2xl md:text-3xl p-2 top-2 right-2 text-gray-600 hover:text-gray-900"
          aria-label="Close"
        >
          &times;
        </button>

        <h2
          className=""
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '20px',
            fontWeight: 600,
            lineHeight: '30px',
            textAlign: 'left',
         color: '#4C6EF5'
          }}
        >
          {confirmTitle}
        </h2>
        </div>
        <p className="p-4" style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '25px',
            textAlign: 'center',
            color: '#1D1929'
          }}>
          {confirmDesc}
        </p>
        <div className="p-4 flex flex-col sm:flex-row justify-center gap-2">
          <Button
            buttonName="Confirm"
            type="button"
            bg="#D32F2F"
            color="white"
            className="rounded"
            onClick={handleConfirm}  
          />
          <Button
            buttonName="Cancel"
            type="button"
            bg="white"
            color="green"
            className="rounded "
            onClick={onClose}  
          />
        </div>
        
      </div>
    </div>
  );
};

export default SimplePopup;
