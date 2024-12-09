import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import delIcon from '../../assets/icons/delIcon.svg';
import editIcon from "../../assets/icons/editIcon.svg";
import viewIcon from "../../assets/icons/view.svg";

const Challengetable = ({
  challenges,
  handleDeleteChallenge,
  handleChangeStatus,
  handleEditChallenge,
  role,
}) => {
  const navigate = useNavigate();
  const [editChallengeId, setEditChallengeId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [toggleStates, setToggleStates] = useState({});

  const handleToggleStatus = (id, currentStatus) => {
    const newStatus = !currentStatus;
    setToggleStates((prevState) => ({
      ...prevState,
      [id]: newStatus
    }));
    handleChangeStatus({ id, is_enabled: newStatus });
  };

  const handleEditClick = (challenge) => {
    setEditChallengeId(challenge.id);
    setEditedName(challenge.challenge_name);
  };

  const handleSaveClick = (id) => {
    const updatedChallenge = { id, challenge_name: editedName };
    handleEditChallenge(updatedChallenge);
    setEditChallengeId(null);
  };

  const handleCancelClick = () => {
    setEditChallengeId(null);
  };

  const handleDeleteClick = (id) => {
    handleDeleteChallenge(id);
  };

  const handleNavigate = (id) => {
    navigate(`/challenge/${id}/scenarios`);
  };

  return (
    <div className="container mx-auto py-2">
      <div className="space-y-4">
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            onClick={() => handleNavigate(challenge.id)}
            className="bg-white shadow-lg rounded-lg w-full cursor-pointer hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 border border-transparent"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg">
              <div
                className="flex flex-col md:flex-row rounded-lg"
                style={{ backgroundColor: "#f7f8fc" }}
              >
                <div className="flex flex-col">
                  <span
                    className={`text-sm mr-4 p-2 inter-status-style ${challenge.is_enabled ? "text-blue-500" : "text-gray-500"
                      } rounded-br-lg rounded-tl-lg`}
                    style={{ backgroundColor: "#edf0fd" }}
                  >
                    {challenge.is_enabled ? "Open" : "Closed"}
                  </span>
                </div>
                <div className="flex flex-col p-4" onClick={(e) => { if (editChallengeId === challenge.id) e.stopPropagation();}}>
                  {editChallengeId === challenge.id ? (
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => {e.stopPropagation();setEditedName(e.target.value)}}
                      className=" work-sans-style"
                    />
                  ) : (
                    <>
                      <div className="flex gap-2">
                      
                        <span className="capitalize work-sans-style cursor-pointer" onClick={() => handleNavigate(challenge.id)} >
                          {challenge.challenge_name}
                        </span>
                          {role ==='game_master'&& <button
                            className=" hover:text-gray-500 hover:border-gray-300 px-2 py-1 shadow-lg rounded-[4px] text-gray-700 border-gray-400 border flex items-center justify-center"
                              onClick={(e) => { e.stopPropagation(); handleEditClick(challenge) }}
                            >
                              <img
                                src={editIcon}
                                alt="Edit"
                                className="h-3"
                                loading="lazy"
                              />
                            </button>}
                        <br/> 
                      </div>
                        <span className="text-sm">
                          Total Scenario: {challenge.num_scenarios || 0}
                        </span>

                    </>

                  )}
                </div>
              </div>

              <div className="flex space-x-2 justify-end items-center p-4">
                {editChallengeId === challenge.id ? (
                  <>
                    <button
                      className="text-blue-500 border border-gray-300 px-3 py-2 shadow-lg rounded-md hover:text-blue-700 hover:border-blue-400"
                      onClick={(e) => {e.stopPropagation();handleSaveClick(challenge.id)}}
                    >
                      Save
                    </button>
                    <button
                      className="text-gray-500 border border-gray-300 px-3 py-2 shadow-lg rounded-md hover:text-gray-700 hover:border-gray-400"
                      onClick={(e) => { e.stopPropagation(); handleCancelClick()}}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    {role === "game_master" && (
                      <div className="grid grid-cols-2 sm:grid-cols-2  gap-4">
                        <div className="flex flex-col items-center justify-center px-2" onClick={(e)=>e.stopPropagation()}>
                          <Toggle
                            checked={toggleStates[challenge.id] ?? challenge.is_enabled}
                            onChange={(e) =>{
                                e.stopPropagation();
                              handleToggleStatus(
                                challenge.id,
                                toggleStates[challenge.id] ?? challenge.is_enabled
                              )
                            }
                            }
                            icons={false}
                            onClick={(e)=>{e.stopPropagation();}}
                            className="custom-toggle"
                          />
                          <div
                            className={`text-xs inter-status-style ${toggleStates[challenge.id] ?? challenge.is_enabled
                                ? "text-blue-500"
                                : "text-gray-500"
                              }`}
                          >
                            {toggleStates[challenge.id] ?? challenge.is_enabled
                              ? "Open"
                              : "Closed"}
                          </div>
                        </div>
                        <button
                          className="hover:text-gray-500 hover:border-gray-300 px-3 py-1 shadow-lg rounded-md text-gray-700 border-gray-400 border flex items-center justify-center"
                          onClick={(e) => { e.stopPropagation(); handleDeleteClick(challenge.id) }}
                        >
                          <img
                            src={delIcon}
                            alt="Delete"
                            className="w-5 h-5"
                            loading="lazy"
                          />
                        </button>



                        {/* <button
            className="hover:text-gray-500 border hover:border-gray-300 px-3 py-2 shadow-lg rounded-md text-gray-700 border-gray-400 flex items-center justify-center"
            onClick={() => handleNavigate(challenge.id)}
          >
            <img
              src={viewIcon}
              alt="View"
              className="w-5 h-5"
              loading="lazy"
            />
          </button> */}
                      </div>
                    )}

                    {/* {role !== "game_master" && (
                      <div className="grid grid-cols-1  justify-end ">
                        <button
                          className="hover:text-gray-500 border hover:border-gray-300 px-3 py-2 shadow-lg rounded-md text-gray-700 border-gray-400 flex items-center justify-center"
                          onClick={() => handleNavigate(challenge.id)}
                        >
                          <img
                            src={viewIcon}
                            alt="View"
                            loading="lazy"
                            className="w-5 h-5"
                          />
                        </button>
                      </div>
                    )} */}
                  </>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Challengetable;
