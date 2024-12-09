import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import DefaultTab from "../components/DefaultTab/DefaultTab";
import { useAuth } from "../routes/AuthContext";

const ProfileCard = ({ image, name, role, email }) => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row justify-between items-center bg-white shadow-md rounded-lg p-6 w-full mb-6">
      <div className="flex flex-col gap-4 md:flex-row items-center ">
        <img
          loading="lazy"
          src={image}
          alt={name}
          className="w-24 h-24 rounded-full object-cover mb-4"
        />
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold mb-2 text-[#1D1929]">{name}</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <p className="mb-1 text-[#1D1929] capitalize">{role} |</p>
            <p className="mb-4 text-[#1D1929] ">{email}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-4">
        <button className="bg-white text-gray-700 border border-gray-300 rounded-md py-2 px-2 rounded-md flex items-center">
          <FontAwesomeIcon icon={faEdit} className="" />
        </button>
        <div
          className="flex justify-center py-2 items-center w-8 h-8 border border-gray-200 rounded"
          onClick={goBack}
        >
          <svg
            width="24"
            height="22"
            fill="none"
            stroke="#4C6EF5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M15.375 5.25 8.625 12l6.75 6.75"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const { isLoggedIn, role, checkAuthToken, username } = useAuth();

  useEffect(() => {
    checkAuthToken();
  }, [checkAuthToken]);

  // Define profileData and tabs inside the component where username and role are available
  const profileData = [
    { label: "Profile Name", value: username },
    { label: "Role", value: role }
  ];

  const tabs = [
    {
      name: "Basic Details",
      content: (
        <div className="flex flex-col">
          {profileData.map((item, index) => (
            <React.Fragment key={index}>
            <div className="flex flex-row gap-4">
              <p className="capitalize profileHeading">{item.label}</p>
              <p className="capitalize profileHeading">{item.value}</p>
              </div>
            </React.Fragment>
          ))}
        </div>
      ),
    },
    {
      name: "Related Challenges/Scenarios",
      content: <h1>Challenges / Scenarios</h1>,
    },
  ];

  const userProfileData = [
    {
      image: "https://via.placeholder.com/150",
      name: username,
      role: role,
      email: "john.doe@example.com",
    },
  ];

  return (
    <div className="flex flex-col w-11/12 mx-auto mt-4">
      <div className="flex flex-col w-full items-center px-6">
        {userProfileData.map((profile, index) => (
          <ProfileCard
            key={index}
            image={profile.image}
            name={profile.name}
            role={profile.role}
            email={profile.email}
          />
        ))}
      </div>
      <div className="flex flex-col w-full mx-auto px-6">
        <div className="flex flex-col overflow-x-scroll hide-scrollbar gap-4 md:flex-row justify-between items-center bg-white shadow-md rounded-lg p-6 w-full mb-6">
          <div className="m-4 w-full">
          <DefaultTab tabs={tabs} dir="row" dirTop='col'/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
