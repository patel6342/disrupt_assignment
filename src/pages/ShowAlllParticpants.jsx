import React, { useState, useEffect } from "react";
import DefaultTable from "../components/defaultTable/DefaultTable";
import ResultMenu from "../Menu/ResultMenu";
import { cn } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllParticipantsByScenarioId } from "../redux/participant";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import nodata from "../assets/image.png";
import { useAuth } from "../routes/AuthContext";
import { toast } from "react-toastify";
import ComponentLoader from "../components/ComponentLoader/ComponentLoader";
import viewIcon from "../assets/icons/view.svg";

import { clearJudgeState } from "../redux/judge";

const ShowAllParticipants = () => {
  const { isLoggedIn, role, checkAuthToken, username } = useAuth();
  const { challengeId, scenarioId } = useParams();
  const dispatch = useDispatch();
  const { submitJudgeData ,isJudgeDataError,isJudgeDataSuccess,judgeErrorMessage,judgeSuccessMessage} = useSelector((state) => state.judgeSlice);
  const { participants, isParticipantSliceFetching } = useSelector((state) => state.participantSlice);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  // Check authentication token
  useEffect(() => {
    checkAuthToken();
  }, [checkAuthToken]);

 
  // Fetch participants data when scenarioId changes
  useEffect(() => {
    if (scenarioId) {
      dispatch(getAllParticipantsByScenarioId(scenarioId))
        .catch(error => {
          console.error('Error fetching participants:', error);
        });
    }
  }, [scenarioId]);

  useEffect(() => {
    if (Array.isArray(participants)) {
      const filteredData = participants
        .filter((participant) =>
          participant.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((participant, index) => ({
          id: participant.id,
         
          "Participant Name": participant.name,
          is_judged: participant.is_judged,
        }));
      setData(filteredData);
    }
  }, [participants, searchTerm]);
  // Define table columns
  const columns = [ "Participant Name", "Actions"];

  // Define actions based on participant status
  const actions = (row) => {
    if (row.is_judged) {
      return [
        {
          className: "text-gray-500 px-3 py-1",
          onClick: () => {}, // No action needed
          icon: <span>Already Judged</span>, // Display message or an icon
        },
      ];
    }
    return [
      {
        className: "text-black px-3 py-1 hover:text-blue-700",
        onClick: () => handleView(row),
        icon:<img src={viewIcon} alt="view" loading='lazy' className="w-4 h-4"/>
        // icon: <FontAwesomeIcon icon={faArrowUpRightFromSquare} size="sm" />,
      },
    ];
  };

  // Handle search term input
  const handleSearch = (term) => {
  
    setSearchTerm(term);
  };

  // Navigate to a different route on view action
  const handleView = (obj) => {
   
    let participantId=obj.id
    navigate(`/challenge/${challengeId}/scenario/${scenarioId}/showAllParticipants/participant/${participantId}/judge`);
  };

  useEffect(() => {
    if (isJudgeDataSuccess) {
      toast.success(judgeSuccessMessage);
    } 
  return(()=>{
    dispatch(clearJudgeState())
  })
  
  }, [
 
    isJudgeDataSuccess,
   
    judgeSuccessMessage,
   
  ]);


  return (
    <div className={cn("my-5 flex-grow flex flex-col", "relative")} style={{ backgroundColor: "#f9f9f9" }}>
      {isParticipantSliceFetching && <ComponentLoader />}
      <div className="w-full flex flex-col">
        <ResultMenu onSearch={handleSearch} />
        {participants.length > 0 ? (
          <DefaultTable columns={columns} data={data} actions={actions} />
        ) : (
          <div className="flex flex-col w-full h-96 bg-white justify-center items-center">
             <div className=" flex flex-col gap-4 justify-center items-center ">
              <img src={nodata} loading='lazy' alt="No Data" className="w-40 h-40" />
              <h1 className="work-sans-style text-[#A5A3A9]">No Participant Found</h1>
           </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ShowAllParticipants;
