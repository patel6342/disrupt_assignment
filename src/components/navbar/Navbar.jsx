import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSignOut, faTimes, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../routes/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { logOut, clearAllSliceStates } from "../../redux/auth";
import SimplePopup from "../../Modal/simpleModal/simpleModal";
import ComponentLoader from "../ComponentLoader/ComponentLoader";
import DropActions from "../DropActions/DropAction";
import headerSvg from "../../assets/svg/header.svg"
const Navbar = () => {
  const { isLoggedIn, role, username, setIsLoggedIn } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthSliceFetching } = useSelector(state => state.authentication);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    dispatch(logOut()).then(() => {
      // toast.success("LogOut sucessfully")
      dispatch(clearAllSliceStates());
      setIsLoggedIn(false);
      navigate("/");
    });
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(true);
  };

  const handleClosePopup = () => {
    setShowLogoutConfirm(false);
  };

  useEffect(() => {
    dispatch(clearAllSliceStates());
    return (()=>{
      dispatch(clearAllSliceStates())
    })
  },[])

  return (
    <>
      {isAuthSliceFetching && <ComponentLoader />}
      <nav
        className="px-4 py-2 bg-white shadow-lg md:h-auto lg:h-16 relative "
        // style={{ backgroundColor: "#4C6EF5" }}
        style={{
          backgroundColor: "#4C6EF5", // Base color
          backgroundImage: `url(${headerSvg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay', // Blend mode for overlay effect
        }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between w-full h-full">
          <div className="text-xl items-center md:items-start w-full md:w-auto font-medium text-white font-bold text-violet-700">
            DISRUPT: Stimulating Innovation
          </div>

          <div className="flex w-full bg-[#4C6EF5]  md:w-auto flex-row justify-between">
            {/* User Info for Mobile View */}

            {/* Mobile Menu Button */}

            <div className="md:hidden flex flex-row items-center cursor-pointer">
              <button
                className="block md:hidden text-violet-700 focus:outline-none"
                onClick={toggleMenu}
              >
                <FontAwesomeIcon
                  icon={isMenuOpen ? faTimes : faBars}
                  size="lg"
                  className="text-white text-2xl"
                />
              </button>
            </div>
            <div className="flex items-center md:hidden py-2 cursor-pointer">
              <DropActions
                heading={
                  <>
                    <span className="username capitalize text-white ml-2">
                      {username}
                    </span>
                    <div className="flex items-center justify-center rounded-full ml-4">
                      <FontAwesomeIcon
                        icon={faUserCircle}
                        className="text-white text-2xl"
                      />
                    </div>
                  </>
                }
                options={[
                  {
                    name: (
                      <>
                      <div className="flex flex-row gap-4">
                        <FontAwesomeIcon
                          icon={faUserCircle}
                          className="text-[#4C6EF5] text-2xl"
                        />{" "}
                      <p className="inter-style">Profile</p>  
                        </div>
                      </>
                      
                    ),
                    onClick: () => navigate("/profilePage", { replace: true }),
                  },
                  {
                    name: (
                      <>
                        <div className="flex flex-row gap-4">
                        <FontAwesomeIcon
                          icon={faSignOut}
                          className="text-[#4C6EF5] text-2xl"
                        />{" "}
                        <p className="inter-style"> Log Out </p>
                        </div>
                      </>
                    ),
                    onClick: () => handleConfirmLogout(),
                  },
                ]}
              />
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex justify-end w-full md:w-auto">
            <div
              className={`flex flex-col md:flex-row lg:m-5 p-2 justify-end items-center gap-5 transition-transform duration-300 ease-in-out ${
                isMenuOpen ? "translate-x-0 bg-[#4C6EF5] " : "translate-x-full"
              } md:translate-x-0 absolute md:relative  top-25 right-0 md:top-auto md:right-auto w-full md:w-auto z-[9999]`}
            >
              {role === "admin" ? (
                <NavLink to={"/Admin"}>
                  {({ isActive }) => (
                    <div
                      className={`px-2 py-1 text-white nav-style ${
                        isActive ? "font-bold" : ""
                      }`}
                    >
                      Dashboard
                    </div>
                  )}
                </NavLink>
              ) : (
                <NavLink to={"/challenges"}>
                  {({ isActive }) => (
                    <div
                      className={`px-2 py-1 text-white nav-style ${
                        isActive ? "font-bold" : ""
                      }`}
                    >
                      Dashboard
                    </div>
                  )}
                </NavLink>
              )}
            </div>

            {/* User Info and Logout for Larger Screens */}
            <div className="hidden md:flex items-center cursor-pointer">
              <DropActions
                heading={
                  <>
                    <span className="username capitalize text-white ml-2">
                      {username}
                    </span>
                    <div className="flex items-center justify-center rounded-full ml-4">
                      <FontAwesomeIcon
                        icon={faUserCircle}
                        className="text-white text-2xl"
                      />
                    </div>
                  </>
                }
                options={[
                  {
                    name: (
                      <>
                      <div className="flex flex-row gap-4">
                        <FontAwesomeIcon
                          icon={faUserCircle}
                          className="text-[#4C6EF5] text-2xl"
                        />{" "}
                      <p className="inter-style">Profile</p>  
                        </div>
                      </>
                      
                    ),
                    onClick: () => navigate("/profilePage", { replace: true }),
                  },
                  {
                    name: (
                      <>
                        <div className="flex flex-row gap-4">
                        <FontAwesomeIcon
                          icon={faSignOut}
                          className="text-[#4C6EF5] text-2xl"
                        />{" "}
                        <p className="inter-style"> Log Out </p>
                        </div>
                      </>
                    ),
                    onClick: () => handleConfirmLogout(),
                  },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Confirmation Popup */}
        {showLogoutConfirm && (
          <SimplePopup
            confirmTitle="Confirm Logout"
            confirmDesc="Are you sure you want to log out?"
            onConfirm={handleLogout}
            onClose={handleClosePopup}
          />
        )}
      </nav>
    </>
  );
};

export default Navbar;
