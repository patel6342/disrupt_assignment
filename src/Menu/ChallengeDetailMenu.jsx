import { useEffect, useState } from "react";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import delIcon from "../assets/icons/delIcon.svg";
import leftArrowIcon from "../assets/icons/leftArrowIcon.svg"
import ProgressBar from "../components/ProgressBar/ProgressBar";
import ConfirmationPopup from "../Modal/ConfirmationModal/ConfirmationModal";



const ChallengeDetailMenu = ({ 
  scenarioDetails, 
  participantDetails, 
  Role, 
  handleDelScenerio, 
  setProgress, 
  isDirty,
  totalDemands,
  progress,
  setTotalDemands,
  completedDemands,
  onSubmit,
  setCompletedDemands,
  showSavedMessage,
  participantSaveMsg,
  judgeSaveMsg,
  setFlagBackEvent
}) => {
  const navigate = useNavigate();
  const getAutoSave = localStorage.getItem("autoSave");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);


  const handleBackClick = () => {
    if(Role==="judge" && typeof onSubmit === 'function'){
      setFlagBackEvent(true);
     
      // onSubmit(true);
    }
    if(Role==="participant" && typeof onSubmit === 'function'){
      onSubmit(true);
      setTimeout(() => {
        navigate(-1);
      }, 1000)
    }
    if(Role==="game_master" && typeof onSubmit === 'function'){
      console.log("BIKIR@","HAPPY NOW")
      onSubmit(true);
    }
 
  };

  const handleConfirmGoBack = () => {
    setShowConfirmationModal(false);
    navigate(-1);
  };
  const handleToggle = () => {
   
  };


  return (
    <>
      {showConfirmationModal && (

        <ConfirmationPopup
          confirmTitle="Confirm Navigation"
          confirmDesc="Are you sure you want to go back? Any Data Entered will be lost"
          item={{ "S No.": "1" }}
          onClose={() => setShowConfirmationModal(false)}
          onConfirm={handleConfirmGoBack}
          onSubmit={onSubmit}
          participantFinalSubmit={false}
        />

      )}

      <div className="mx-auto w-full mt-4">
        <div className="flex flex-col md:flex-row justify-between block max-w-full py-2 px-3 linearbg border border-gray-200 rounded-tr-[18px] rounded-bl-[0px] rounded-br-[0px] shadow">
          <div className="flex flex-row items-center">
            <h1 className="text-[#4C6EF5] text-[22px] leading-[20px] tracking-[-1px]">
              {scenarioDetails?.challenge_name}
            </h1>
            <div className="flex justify-center items-center w-9 h-9">
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="#4C6EF5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9 18l6-6-6-6"></path>
              </svg>
            </div>
            <h5 className="text-[#4C6EF5] work-sans-challengeName-style capitalize">
              {scenarioDetails?.name}
            </h5>
            <div className="text-[#4C6EF5] text-[20px] font-semibold p-[10px]">{participantDetails}</div>
          </div>
          
          {(showSavedMessage || participantSaveMsg || judgeSaveMsg) &&<div
              style={{
                display: 'flex',
                alignItems: 'center', // Align the text and icon together
                marginLeft: '10px',
              opacity: showSavedMessage || participantSaveMsg || judgeSaveMsg ? 1 : 0,
                transition: 'opacity 1s ease-out', // Smooth transition
              }}
            >
              <FontAwesomeIcon icon={faCircleCheck} size="2xl" style={{ color: "#63E6BE", }} />
              <p style={{ marginLeft: "5px" }}>Saved...</p>
 
            </div>}

          <div className="flex flex-row w-full md:w-8/12 gap-2 m-2 p-2 justify-end items-center ">
            {Role !== 'game_master' && (
              <div className="w-full md:w-8/12 flex flex-row">
                <div className="w-10/12 md:w-11/12 flex items-center justify-center">
                  <ProgressBar
                    progress={progress}
                    height="15px"
                    color="#4C6EF5"
                  />
                </div>
                <div className="w-2/12 md:w-1/12 flex items-center justify-center">
                  <p className="info text-[#4C6EF5]">
                    {completedDemands} / {totalDemands}
                  </p>
                </div> </div>
            )}

            {Role === 'game_master' && (
              <>

                <div className="flex gap-2 items-center">
                  <button className="text-gray-500 text-sm border border-gray-300 px-2 py-2 shadow-lg rounded-md hover:text-gray-700 hover:border-gray-400" onClick={handleDelScenerio}>
                    <img src={delIcon} alt="Delete" loading='lazy' className="w-4 h-4" />

                  </button>
                </div>
              </>
            )}
            <button className="text-gray-500 text-sm border border-gray-300 px-2 py-2 shadow-lg rounded-md hover:text-gray-700 hover:border-gray-400" onClick={() => {handleBackClick(); console.log("BIKIR@","OOK")}}>
              <img src={leftArrowIcon} alt="Back" loading='lazy' className="w-3 h-4" />

            </button>
          </div>
        </div>
      </div>
    </>
  );
};


export default ChallengeDetailMenu;
