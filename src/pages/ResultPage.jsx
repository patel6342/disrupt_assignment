import React, { useState, useEffect } from "react";
import DefaultTable from "../components/defaultTable/DefaultTable";
import ResultMenu from "../Menu/ResultMenu";
import { cn } from "../lib/utils";
import CommentModal from "../Modal/CommentModal/CommentModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllParticipantsByScenarioId ,clearParticipantState, getParticipantById } from "../redux/participant";
import { useAuth } from "../routes/AuthContext";
import eyeIcon from "../assets/icons/eyeIcon.svg"
import ComponentLoader from "../components/ComponentLoader/ComponentLoader";
import { filter } from "lodash";
const ResultPage = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, role, checkAuthToken, username } = useAuth();
  const { statusCode } = useSelector((state) => state.errorSlice);

  useEffect(() => {
    checkAuthToken();
  }, [checkAuthToken]);

  const { participants ,isParticipantSliceFetching } = useSelector((state) => state.participantSlice);
  const { scenarioId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "Participant Name", direction: "asc" });
  const [partname, setPartName] = useState("");

 useEffect(() => {
    if (scenarioId) {
      dispatch(getAllParticipantsByScenarioId(scenarioId))
        .catch(error => {
          console.error('Error fetching participants:', error);
        });
    }
  }, [scenarioId]);


    useEffect(()=>{
      if (participants) {

        // console.log("jjrp", participants);

        const filteredParticipants = participants.filter((participant) => 
          participant.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // console.log("participant", participants)
        

        const data = filteredParticipants.map((participant) => {
          return {
            "Participant Name": participant?.name,
            "Complexity Score": `${parseFloat(participant?.cumulative_scores?.avg_complexity).toFixed(1) || 0}`,       
            "Economic Score": `${parseFloat(participant?.cumulative_scores?.avg_economic).toFixed(1) || 0}`,
            "Engineering Score": `${parseFloat(participant?.cumulative_scores?.avg_engineering).toFixed(1) || 0}`,
            "Science Score": `${parseFloat(participant?.cumulative_scores?.avg_science).toFixed(1) || 0}`,
            "Talent Score": `${parseFloat(participant?.cumulative_scores?.avg_talent).toFixed(1) || 0}`,
          };
        });
        
        setData(data);

      }
    }, [participants, searchTerm]);

  const columns = [
    
    {name :"Participant Name",sortable: true },
    {name :"Complexity Score",sortable: true },
    {name :"Economic Score",sortable: true },
    {name :"Engineering Score",sortable: true },
    {name :"Science Score",sortable: true },
    {name :"Talent Score",sortable: true },
    // {name :"Total Score",sortable: true },
     
    "Comments",
   
  ];

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleShowComments = (index) => {
    const participant = participants[index];  
    setIsModalOpen(true)
    if (participant) {
      setComments(participant?.comments_by_requirements); 
      setPartName(participant?.name);
      console.log("BIKIR@", participant?.comments_by_requirements)
    } else {
      setComments([]); 
      setPartName("");
    }
  
    setIsModalOpen(true);
  };
  
  
  const actions = (row, index) => [
    {
      className: "text-black px-3 py-1 hover:text-blue-700",
      onClick: () => handleShowComments(index),
      icon: <img loading="lazy" src={eyeIcon} alt="view" className="w-5 h-5" />,
    },
  ];
  
  const handleCloseModal = () => setIsModalOpen(false);
 
  const bubbleSort = (arr, key, direction) => {
    let sortedArray = [...arr];
    const n = sortedArray.length;

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            const aValue = sortedArray[j][key];
            const bValue = sortedArray[j + 1][key];

        
            const aNum = parseFloat(aValue.split('/')[0].trim());
            const bNum = parseFloat(bValue.split('/')[0].trim());

            let shouldSwap;

            if (!isNaN(aNum) && !isNaN(bNum)) {
                shouldSwap = direction === 'asc' ? aNum > bNum : aNum < bNum;
            } else {
             
                shouldSwap = direction === 'asc' ? aValue.localeCompare(bValue) > 0 : aValue.localeCompare(bValue) < 0;
            }

            if (shouldSwap) {
                [sortedArray[j], sortedArray[j + 1]] = [sortedArray[j + 1], sortedArray[j]];
            }
        }
    }

    return sortedArray;
};
  
  const handleSorting = (key) => {
    setSortConfig((prevConfig) => {
      let direction = 'asc';
      if (prevConfig.key === key && prevConfig.direction === 'asc') {
        direction = 'desc';
      }
  
      const updatedConfig = { key, direction };
  
     
      const sortedData = bubbleSort(data, key, direction);
  
      setData(sortedData);
      return updatedConfig;
    });
  };
  
  

  useEffect(()=>{
    if(clearParticipantState){
      dispatch(clearParticipantState())
    }
  },[])
  
  useEffect(() => {
    if (data.length > 0) {
      const sortedData = bubbleSort(data, sortConfig.key, sortConfig.direction);
      // Only update if the sorted data is different from the current data
      if (JSON.stringify(sortedData) !== JSON.stringify(data)) {
        setData(sortedData);
      }
      // setData(sortedData);
    }
  }, [sortConfig]);
  return (
    <>
    {isParticipantSliceFetching && <ComponentLoader/>}
      <CommentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        comments={comments}
        partname={partname}
      />
      <div
        className={cn("my-5 flex-grow flex flex-col", "relative")}
        style={{ backgroundColor: "#f9f9f9" }}
      >
        <div className="w-full flex flex-col">
          <ResultMenu onSearch={handleSearch} />
          <DefaultTable columns={columns} data={data}   actions={(row, index) => actions(row, index)}  onSort={handleSorting} sortConfig={sortConfig} isLoading={isParticipantSliceFetching} />
        </div>
      </div>
    </>
  );
};

export default ResultPage;
