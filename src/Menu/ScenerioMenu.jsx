import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import leftArrowIcon from "./../assets/icons/leftArrowIcon.svg";

const ScenerioMenu = ({
  onSearch,
  challengeName,
  handleAddScenarioClick,
  role,
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const goBack = () => navigate(-1);

  return (
    <div className="container mx-auto py-4 rounded-tl-lg rounded-tr-lg items-center">
      <div className="flex flex-col md:flex-row justify-between  items-center max-w-full py-2 px-3 linearbg border border-gray-200 rounded-tl-[18px] rounded-tr-[18px] shadow">
        <h1 className="capitalize work-sans-challengeName-style text-[#4C6EF5]">
          {challengeName}
        </h1>

        <div className="flex flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full py-2 md:w-auto ">
          {role === "game_master" && (
            <>
              <button
                onClick={handleAddScenarioClick}
                className="px-4 py-2 text-blue-500 border font-bold inter-style border-blue-500 rounded-md hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-auto"
              >
                + Add Scenario
              </button>
            </>
          )}

          <div
            className="flex justify-center items-center w-9 h-9 border border-gray-200 rounded cursor-pointer"
            onClick={goBack}
          >
            <img loading='lazy' src={leftArrowIcon} alt="back" className="w-4 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenerioMenu;
