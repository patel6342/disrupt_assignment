import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import { toast } from "react-toastify";
import delIcon from "../../assets/icons/delIcon.svg";
import editIcon from "../../assets/icons/editIcon.svg";

const ScenarioTable = ({
  scenarios,
  chId,
  updateScenarioStatus,
  handleDeleteScenario,
  handleEditScenario,
  role,
}) => {
  const navigate = useNavigate();
  const [editScenarioId, setEditScenarioId] = useState(null);
  const [editedName, setEditedName] = useState("");

  const handleEditClick = (scenario) => {
    setEditScenarioId(scenario.id);
    setEditedName(scenario.name);
  };

  const handleSaveClick = (id) => {
    handleEditScenario(id, editedName);
    setEditScenarioId(null);
  };

  const handleCancelClick = () => {
    setEditScenarioId(null);
  };

  const handleDeleteClick = (id) => {
    handleDeleteScenario(id);
  };

  const handleNavigate = (scenario) => {
    if (scenario?.is_completed) {
      toast.info("Already Submitted");
    } else if (chId) {
      const path =
        role === "judge"
          ? `/challenge/${chId}/scenario/${scenario.id}/showAllParticipants`
          : `/challenge/${chId}/scenario/${scenario.id}`;
      navigate(path);
    } else {
      console.error("chId is undefined or empty");
    }
  };

  const handleResultClick = (id) => {
    navigate(`/challenge/${chId}/scenario/${id}/resultPage`);
  };

  return (
    <div className="container mx-auto space-y-4">
      {scenarios?.map((scenario) => (
        <div
          key={scenario.id}
          className="bg-white shadow-lg rounded-lg w-full hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 border border-transparent"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 rounded-lg">
            <div
              className="flex items-center rounded-lg"
              style={{ backgroundColor: "#f7f8fc" }}
            >
              <div className="p-4">
                {editScenarioId === scenario.id ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className=" work-sans-style"
                  />
                ) : (
                  <span
                    className="cursor-pointer capitalize work-sans-style"
                    onClick={() => handleNavigate(scenario)}
                  >
                    {scenario.name}
                  </span>
                )}
              </div>
            </div>
            <div className="flex  items-center">
              {scenario.background && (
                // <p className="inter-small-style p-2">
                //   Background Details:{" "}
                //   {scenario.background.split(" ").slice(0, 10).join(" ")}...
                // </p>
                <p className="inter-small-style p-2">
                  Background Details:{" "}
                  <span
                    dangerouslySetInnerHTML={{
                      __html: scenario.background.split(" ").slice(0, 10).join(" ") + "...",
                    }}
                  />
                </p>
              )}
            </div>

            <div className="flex  flex-col md:flex-row space-x-2 gap-2 justify-start md:justify-end items-center p-4">
              {role === "participant" && scenario.is_completed && (
                <Button
                  buttonName="Submitted"
                  className="no-cursor-pointer"
                  onClick={() => toast.info("Already Submitted")}
                />
              )}

              {role === "game_master" && (
                <>
                  {editScenarioId === scenario.id ? (
                    <>
                      <button
                        className="text-gray-500 border border-gray-300 px-3 py-2 shadow-lg rounded-md hover:text-gray-700 hover:border-gray-400"
                        onClick={() => handleSaveClick(scenario.id)}
                      >
                        Save
                      </button>
                      <button
                        className="text-gray-500 border border-gray-300 px-3 py-2 shadow-lg rounded-md hover:text-gray-700 hover:border-gray-400"
                        onClick={handleCancelClick}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      {role === "game_master" && scenario?.results === true && (
                        <Button
                          buttonName="Results"
                          onClick={() => handleResultClick(scenario.id)}
                        />
                      )}
                      <span className="flex flex-row gap-2 justify-start md:justify-end items-center">
                      <button
                        className="hover:text-gray-500 border border-gray-300 px-3 py-2 shadow-lg rounded-md text-gray-700 hover:border-gray-400"
                        onClick={() => handleDeleteClick(scenario.id)}
                      >
                        <img src={delIcon} loading='lazy' alt="Delete" className="w-5 h-5" />
                      </button>
                      <button
                        className="hover:text-gray-500 border border-gray-300 px-3 py-2 shadow-lg rounded-md text-gray-700 hover:border-gray-400"
                        onClick={() => handleEditClick(scenario)}
                      >
                        <img loading='lazy' src={editIcon} alt="Edit" className="w-5 h-5" />
                      </button>
                      </span>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScenarioTable;
