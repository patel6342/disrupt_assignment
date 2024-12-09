import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useNavigationPrompt = (message, when, handleSubmitAllDetails) => {
  const navigate = useNavigate();
  const [isBlocking, setIsBlocking] = useState(when);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isBlocking) {
        
        event.preventDefault();
        handleSubmitAllDetails(true);
       window.confirm("called the reload");
        event.returnValue = "called the reload"; // Standard for the beforeunload event
      }
      //  const confirmed = window.confirm("data will be saved");
      // if(confirmed){
      //   console.log("called the reload");
      // }
      // else{
      //   event.preventDefault();
      //   console.log("canceled the return");
      // }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isBlocking, message]);

  
  useEffect(() => {
    setIsBlocking(when);
  }, [when]);

  return null;
};

export default useNavigationPrompt;
