

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, clearUserData } from '../redux/auth'; 
// import CryptoJS from 'crypto-js';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState('');
  const [username, setUserName] = useState('');

  const clearAuthData = () => {
    setRole('');
    setUserId('');
    setUserName('');
    setIsLoggedIn(false);
    dispatch(clearUserData());
  };

  const checkAuthToken=async()=>{
    try {
            const resultAction = await dispatch(getUser());
    
            if (getUser.fulfilled.match(resultAction)) {
              const { role, username, id } = resultAction.payload;
              
              setRole(role);
              setUserId(id);
              setUserName(username);
              setIsLoggedIn(true);
            } else {
              clearAuthData();
              Navigate('/')
            }
          } catch (error) {
            clearAuthData();
          }
        }
  
  return (
    <AuthContext.Provider value={{ isLoggedIn, role, username, userId, setIsLoggedIn, checkAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
