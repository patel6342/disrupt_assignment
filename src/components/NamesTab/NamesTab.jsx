import React, { useState, useEffect } from "react";

const NamesTab = ({
  setActiveNameTab,
  sectionNames,
  setDemandTab,
  setActiveTab,
  demands,
  headerText,
  description,
  isOpen,
  onTabChange,
  isDisabled, 
  judgeData,
  demandTab,
  responseById,
  completedDemandTab,
  sectionKey,responses,
  setTabFlagIndex
}) => {
  const [activeIndex, setActiveIndex] = useState(null);
  // const [setflag1, setTabFlagIndex1] = useState(0);

  const isAnswerFilled = (demand_id) => {
    const response = responses?.find((res) => res?.demand_id === demand_id);
    return response && response?.content && response.content.trim() !== "";
  };

  useEffect(() => {
    if (isOpen !== null) {
      setActiveIndex(isOpen);
    }
    
  }, [isOpen]);

   
  useEffect(()=>{
    setActiveIndex(null)
  
  },[location])

  useEffect(() => {
    if (demands && demands.length > 0) {
      setDemandTab(demands[0]);
      setActiveIndex(0)
    }
  }, [demands, setDemandTab]);


  const handleTabClick = (tab, index) => {
    setTabFlagIndex();
    if (isDisabled || demands?.length === 0) return;
  
    setActiveIndex(index);
    setDemandTab(demands[index]);
    setActiveTab(index);
    setActiveNameTab(index);
    
    // console.log("jjr", setflag1);
  };


  const isAllFieldsFilled = (response) => {
    const demandsArray = responseById?.requirements?.find(d => d.type === sectionKey);
    const answer_id = demandsArray?.demands?.find(d => d?.id === response)?.answer_id
    const newObj = judgeData?.judgeData?.scores?.find(d => d?.response_id === answer_id);
    if(!newObj){
      return false
    }
    const fieldsToCheck = [
      newObj?.originality,
      newObj?.feasibility,
      newObj?.consistency,
      newObj?.efficiency,
      newObj?.value_for_money,
      newObj?.security,
      newObj?.originality_comment,
      newObj?.feasibility_comment,
      newObj?.consistency_comment,
      newObj?.efficiency_comment,
      newObj?.value_for_money_comment, // Ensure the key with a space is correctly handled
      newObj?.security_comment,
      newObj?.demand_comment,
    ];
  
    // Check if all fields are filled
    return fieldsToCheck?.every(field => field !== '' && field !== undefined && field !== null);
  };
  

  return (
    <div className="flex flex-col bg-[#f9faff] p-4 h-full mx-2">
      <div className="w-full p-4 rounded-md mb-4">
        <h5 className="text-lg font-semibold text-[#4C6EF5]">
          {headerText || sectionNames}
        </h5>
        <p className="mb-2 text-md font-medium text-[#666b72]">
          Description: {description || `${sectionNames} description`}
        </p>
      </div>

      <div className="flex flex-col h-auto overflow-y-scroll hide-scrollbar gap-2">
        {demands?.length ? (
          demands.map((tab, index) => (
            <Tab
              key={tab.id}
              title={tab.text}
              isActive={activeIndex === index}
              isDisabled={isDisabled}
              onClick={() => {
                // console.log ("jjr", tab, index);
                handleTabClick(tab, index);
                
              }
              }
              highlight={isAllFieldsFilled(tab.id)}
              ansHighlight={isAnswerFilled(tab.id)}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">No demands available</p>
        )}
      </div>
    </div>
  );
};

const Tab = ({ title, isActive, onClick, isDisabled,highlight ,ansHighlight  }) => {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`w-full py-3 inter-deamndName-style capitalize px-4 text-left font-semibold  text-[#4C6EF5] rounded-md ${
        isActive ? "border-2 border-[#4C6EF5]" : "border border-[#4C6EF5]"
      } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
       ${highlight ? "bg-green-100 border-2 border-green-500 text-green-900": "bg-white"}
       ${ansHighlight ? "bg-green-100 border-2 border-green-500 text-green-900" : "bg-white"}
       `}
    >
      {title} 
    </button>
  );
};

export default NamesTab;
