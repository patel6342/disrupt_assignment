import React, { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import AutoResizeTextarea from "../AutoResizeTextArea/AutoResizeTextArea";

const Accordion = ({ demands, headerText, sectionNames, sectionKey, description, responses, setResponses, participantAnswer, setParticipantAnswer }) => {
  const { scenarioId } = useParams();
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // const handleAutoSave = useCallback((answer, demand_id, sectionKey)=>{
  //   setParticipantAnswer((prevAnswer)=>{
  //     console.log("prevAnswer",prevAnswer);
  //     const updatedAnswer = { ...prevAnswer };

  //     // Find the requirement section that matches the sectionKey (type)
  //     const requirementSection = updatedAnswer?.requirements.find(
  //       (requirement) => requirement.type === sectionKey
  //     );

  //     if (requirementSection) {
  //       // Find the specific demand within the section using the demand_id
  //       const demandToUpdate = requirementSection.demands.find(
  //         (demand) => demand.id === demand_id
  //       );

  //       if (demandToUpdate) {
  //         // Update the answer field of the specific demand
  //         demandToUpdate.answer = answer;
  //         demandToUpdate.action = "update";
  //       }
  //     }

  //     return updatedAnswer;
  //   })
  
  const handleChange = useCallback(
    (answer, demand_id, sectionKey) => { // Use demand_id as parameter
      setResponses((prevResponses) => {
        const existingResponseIndex = prevResponses.findIndex(
          (response) => response.demand_id === demand_id // Use demand_id for comparison
        );

        if (existingResponseIndex > -1) {
          console.log("demand exists",)
          const updatedResponses = [...prevResponses];
          updatedResponses[existingResponseIndex] = {
            ...updatedResponses[existingResponseIndex],
            content: answer,
            scenario_id: scenarioId,
          };
          return updatedResponses;
        } else {
          console.log("demand doesnt exists",)
          let answer_id = null;
          participantAnswer.requirements.forEach((requirement) => {
            if (requirement.demands && requirement.demands.length > 0) {
              const matchingDemand = requirement.demands.find(
                (demand) => demand.id === demand_id
              );
              if (matchingDemand) {
                answer_id = matchingDemand.answer_id; // Extract the answer_id from the matching demand
              }
            }
          });
          // Add a new response
          return [
            ...prevResponses,
            {
              id:answer_id&&answer_id,
              scenario_id: scenarioId,
              content: answer,
              demand_id: demand_id,
              // response_type:sectionKey,
            },
          ];
        }
      });
    },
    [scenarioId, setResponses]
  );

  const isAnswerFilled = (demand_id) => {
    const response = responses.find((res) => res.demand_id === demand_id);
    return response && response.content && response.content.trim() !== "";
  };

  return (
    <div className="flex flex-col bg-[#f9faff] p-4 rounded-md shadow-md h-full">

      <div className="w-full flex flex-col bg-white p-4 rounded-md mb-4 ">
        <h5 className="text-lg font-semibold text-[#4C6EF5]">{headerText ? headerText : sectionNames}</h5>
        <p className="mb-2 text-md font-medium text-[#666b72]">Description: {description ? description : sectionNames + ' Description'}</p>
      </div>

      <div className="overflow-hidden hide-scrollbar flex flex-col gap-2 ">
        {demands?.map((item, index) => {
          const formattedContent =
            typeof item?.constraints === "string"
              ? item.constraints.split(",").map((str) => str.trim())
              : item.constraints;

          const response = responses.find(
            (res) => res.demand_id === item.id
          )?.content || "";

          return (
            <AccordionItem
              key={item.id}
              title={item.text}
              content={formattedContent}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
              response={response}
              highlight={isAnswerFilled(item.id)}
              onResponseChange={(answer) => {handleChange(answer, item.id, sectionKey);
                //  handleAutoSave(answer,item.id,sectionKey)
                }}
            />
          );
        })}
      </div>
    </div>
  );
};

const AccordionItem = ({ title, content, isOpen, onToggle, response, onResponseChange, highlight }) => {
  return (
    <div className="bg-white shadow-md ">
      <button
        className={`flex items-center rounded-lg justify-between w-full py-3 px-4 text-left text-gray-800 font-semibold ${isOpen ? "bg-white" : "bg-white"}  ${highlight ? "bg-green-100 border-2 border-green-500" : ""}`}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className={`text-[#4C6EF5] inter-deamndName-style  capitalize   ${highlight ? "text-green-900" : ""}   `} dangerouslySetInnerHTML={{ __html: title }} />
        <svg
          className={`w-4 h-4 transition-transform text-[#4C6EF5] duration-200 ${isOpen ? "rotate-180" : "rotate-0"
            }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="px-4 flex flex-col gap-4 mb-3 text-gray-700">
          <div className="flex flex-row flex-wrap gap-2 items-center">
            <span
              style={{
                fontFamily: "Inter",
                fontSize: "16px",
                fontWeight: "500",
                lineHeight: "19.36px",
                textAlign: "left",
                color: "#9127AC",
              }}
            >
              Constraints:
            </span>
            {content?.map((constraint, index) => (
              <span
                key={index}
                className="p-2 rounded-md"
                style={{
                  fontFamily: "Inter",
                  fontSize: "16px",
                  fontWeight: "400",
                  lineHeight: "19.36px",
                  textAlign: "center",
                  color: "#9127AC",
                  backgroundColor: "#9329AE0A",
                  marginRight: "4px",
                }}
              >
                {constraint}
              </span>
            ))}
          </div>

          <div className="relative border-0 rounded-lg px-2 py-2  bg-[#F9F9F999]">


            <AutoResizeTextarea
              className="w-full textarea-no-border hide-scrollbar bg-[#F9F9F999]"
              rows={3}
              value={response}
              onChange={(value) => onResponseChange(value)}
              placeholder="Answer :"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Accordion;
