import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser ,clearAllSliceStates } from "../redux/auth";
import loginPic from "../assets/login.png";
import vector from "../assets/vector.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../routes/AuthContext';
import ComponentLoader from '../components/ComponentLoader/ComponentLoader';
import { replace } from 'lodash';
import emailIcon from "../assets/icons/emailIcon.svg";
import passwordIcon from "../assets/icons/passwordIcon.svg"
const customInputStyles = {
  fontFamily: 'Inter,sans-serif',
  fontSize: '15px',
  fontWeight: '400',
  lineHeight: '18.15px',
  letterSpacing: '-0.02em',
  textAlign: 'left',
  
};

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthSliceFetching,authSliceSuccessMessage,isGetUserFetching,isAuthSliceUserFetching, isAuthSliceSuccess, isAuthSliceError, authSliceErrorMessage } = useSelector(state => state.authentication);
  const { setIsLoggedIn,isLoggedIn, role } = useAuth();  

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({ username: '', password: '' });

    let valid = true;
    const newErrors = { username: '', password: '' };

    if (!formData.username) {
      newErrors.username = 'Username is required';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    }

    if (valid) {
      dispatch(loginUser(formData))
        .unwrap()
        .then((result) => {
         
          setIsLoggedIn(true);
        
          console.log('User role:', role);
        
          if (role === 'admin') {
            navigate("/admin");
          } else if (role === 'game_master' || role === 'judge' || role === 'participant') {
            navigate("/challenges");
          } else {
            navigate("/"); 
          }
      
             })
        .catch((error) => {
          console.error('Login failed:', error);
         
        });
       
    } else {
      setErrors(newErrors);
    }
  };

 
  useEffect(() => {
   
    if (isAuthSliceError) {
    
      toast.error(authSliceErrorMessage, {
        autoClose: 3000,
        hideProgressBar: false,
        pauseOnHover: true,
      });
    }
    return (()=>{
      dispatch(clearAllSliceStates())
    })
  }, [isAuthSliceError,authSliceErrorMessage]);


  useEffect(() => {
    dispatch(clearAllSliceStates());
    return (()=>{
      dispatch(clearAllSliceStates())
    })
  },[])

  return (
    <>
    <ToastContainer/>
    {/* {isAuthSliceFetching  && <ComponentLoader/>} */}
    <div className="flex min-h-screen relative">
      <div className="absolute inset-0">
        <div className="w-full h-full bg-[#3474F61A] relative">
          <img
          loading='lazy'
            src={vector}
            alt="Background Vector"
            className="absolute inset-0 w-full h-full object-contain"
          />
        </div>
      </div>

   
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative z-10">
        <img
        loading='lazy'
          src={loginPic}
          alt="Login Illustration"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Always visible on small screens */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white relative z-10">
        <div className="max-w-md w-full p-8 bg-white">
          <p className="text-4xl font-semibold mb-2 text-[#1D1929] ">
            Welcome Back to
          </p>
          <span className="text-4xl font-semibold text-[#3474F6] font-inter">
            Disrupt
          </span>
          <p className="text-lg text-[#1D1929] font-inter my-4">
            Sign in to your account below
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 relative">
              <div className="flex items-center border border-gray-300 rounded-md">
                <div className="p-2">
                <img  loading='lazy' src={emailIcon} alt="email" className="w-4 h-4" />
                    
                  {/* <FontAwesomeIcon icon={faEnvelope} className="text-black" /> */}
                </div>
                <input
                  type="text"
                  id="username"
                  placeholder="Enter your username"
                  style={customInputStyles}
                  className="w-full px-3 py-2 border-none rounded-lg focus:outline-none text-[#1D192980]"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>
            
            <div className="mb-6 relative">
              <div className="flex items-center border border-gray-300 rounded-md">
                <div className="p-2">
                <img  loading='lazy' src={passwordIcon} alt="Password" className="w-4 h-4" />
                    
                  {/* <FontAwesomeIcon icon={faLock} className="text-black" /> */}
                </div>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  style={customInputStyles}
                  className="w-full px-3 py-2 border-none rounded-md focus:outline-none text-[#1D192980]"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            
            <div className='flex flex-col gap-2 md:flex-row justify-between mb-6'>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  className="form-checkbox h-4 w-4 text-blue-500"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <label htmlFor="rememberMe" className="ml-2 text-gray-700">
                  Remember me
                </label>
              </div>
              
              <a href="#" className="text-blue-500 hover:underline">Forgot password?</a>
            </div>
            
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
              disabled={isAuthSliceFetching}
            >
              {isAuthSliceFetching ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default LoginPage;
