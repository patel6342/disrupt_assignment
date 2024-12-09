import { useEffect, useState, useCallback, useMemo } from "react";
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import AutoResizeTextarea from "../AutoResizeTextArea/AutoResizeTextArea";


const wordCount = (text) => {
   return text ? text.trim().split(/\s+/).length : 0;
};

const BasicDetail = ({ scenarioDetails, setScenarioDetails, Role }) => {
  const [role, setRole] = useState(Role);
  const [isEditing, setIsEditing] = useState({
    background: false,
    deliverable: false,
    timeline: false,
  });


  const [backgroundWordCount, setBackgroundWordCount] = useState(0);
  const [deliverableWordCount, setDeliverableWordCount] = useState(0);
  const [timelineWordCount, setTimelineWordCount] = useState(0);

  

  useEffect(() => {
    // setBackgroundWordCount(wordCount(scenarioDetails.backgroundDescription || ""));
    setBackgroundWordCount(wordCount(scenarioDetails.background || ""));
  
  }, [scenarioDetails.background]);

  useEffect(() => {
    // setDeliverableWordCount(wordCount(scenarioDetails.deliverableDescription || ""));
    setDeliverableWordCount(wordCount(scenarioDetails.deliverable || ""));
  }, [scenarioDetails.deliverable]);

  useEffect(() => {
    // setTimelineWordCount(wordCount(scenarioDetails.timelineDesc || ""));
    setTimelineWordCount(wordCount(scenarioDetails.timeline || ""));
  }, [scenarioDetails.timeline]);

  const handleChange = useCallback((event, field) => {
    const value = event?event:"";
    // const value = event?.htmlValue ??"";
    console.log(event,"onchange value for textedito");
    setScenarioDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  }, [setScenarioDetails]);

  
  const handleInputChange = useCallback((event, field) => {
    const value = event.target.value;
    setScenarioDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));

    switch (field) {
      case "background":
        setBackgroundWordCount(wordCount(value));
        break;
      case "deliverable":
        setDeliverableWordCount(wordCount(value));
        break;
      case "timeline":
        setTimelineWordCount(wordCount(value));
        break;
      default:
        break;
    }
  }, [setScenarioDetails]);


  const handleEditClick = (field) => {
    setIsEditing((prevState) => ({
      ...prevState,
      [field]: true,
    }));
  };

  const handleSaveClick = useCallback((field) => {
    setIsEditing((prevState) => ({
      ...prevState,
      [field]: false,
    }));
  }, []);

  const handleCancelClick = useCallback((field) => {
    setIsEditing((prevState) => ({
      ...prevState,
      [field]: false,
    }));
  }, []);

  if(Role === 'game_master'  ){
  return (
    <>
      <div className="border border-gray-200 rounded-lg p-4 my-2 linearbg box">
        <div className="block max-w-full">
          <h5 className="blackHeadings">Background</h5>
          <span className="flex flex-row py-2 justify-between">
            {isEditing.background ? (
              <>
                <textarea
                  className="w-full"
                  rows={1}
                  placeholder="Enter background details"
             
                  value={scenarioDetails.background || "What needs to be done and why. What needs to be disrupted"}
                  onChange={(e) => handleChange(e, "background")}
                ></textarea>
                <div className="flex space-x-2">
                  <button
                    className="text-green-500"
                    onClick={() => handleSaveClick("background")}
                  >
                    <FontAwesomeIcon icon={faSave} size="sm" />
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => handleCancelClick("background")}
                  >
                    <FontAwesomeIcon icon={faTimes} size="sm" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <small className=" inter-small-style ">
                  {/* {scenarioDetails.background ||  */}
                  What needs to be done and why. What needs to be disrupted
                  {/* } */}
                </small>
                {/* {role === "game_master" && (
                  <small className="text-gray-400">
                    <FontAwesomeIcon
                      icon={faPen}
                      size="sm"
                      onClick={() => handleEditClick("background")}
                      className="cursor-pointer"
                    />
                  </small>
                )} */}
              </>
            )}
          </span>
          <div className={`relative border-0 rounded-lg px-2  ${role !== "game_master" ? 'bg-[#F9F9F999]' : ''}`}>
          
            <AutoResizeTextarea
              className="w-full textarea-no-border hide-scrollbar"
              rows={3}
              // value={scenarioDetails.backgroundDescription || ""}
              // onChange={(e) => handleChange(e, "backgroundDescription")}
              value={scenarioDetails.background || ""}
              onChange={(value) => handleChange(value, "background")}
              placeholder="Enter background description"
              disabled={role !== "game_master"}
              role={role}
              wordCount={backgroundWordCount}
              controls={true}
            />
              
  
            {/* <div className="text-end text-xs p-2 text-gray-300">
              word count: {backgroundWordCount}
            </div> */}
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 my-2 linearbg box">
        <div className="block max-w-full">
          <h5 className="blackHeadings">Deliverable</h5>
          <span className="flex flex-row py-2 justify-between">
            {isEditing.deliverable ? (
              <>
                <textarea
                  className="w-full textarea-no-border hide-scrollbar"
                  rows={1}
              
                  value={scenarioDetails.deliverable || "The solution you will propose should meet this deliverable."}
                  onChange={(e) => handleChange(e, "deliverable")}
                  placeholder="Enter deliverable"
                ></textarea>
                <div className="flex space-x-2">
                  <button
                    className="text-green-500"
                    onClick={() => handleSaveClick("deliverable")}
                  >
                    <FontAwesomeIcon icon={faSave} size="sm" />
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => handleCancelClick("deliverable")}
                  >
                    <FontAwesomeIcon icon={faTimes} size="sm" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <small className=" inter-small-style ">
                  {/* {scenarioDetails.deliverable || */}
                   The solution you will propose should meet this deliverable. 
                   {/* } */}
                </small>
                {/* {role === "game_master" && ( */}
                  {/* <small className="text-gray-400">
                    <FontAwesomeIcon
                      icon={faPen}
                      size="sm"
                      onClick={() => handleEditClick("deliverable")}
                      className="cursor-pointer"
                    />
                  </small> */}
                {/* )} */}
              </>
            )}
          </span>
          <div className={`relative border-0 rounded-lg px-2  ${role !== "game_master" ? 'bg-[#F9F9F999]' : ''}`}>
           
             <AutoResizeTextarea
              className="w-full textarea-no-border hide-scrollbar"
              rows={3}
              // value={scenarioDetails.backgroundDescription || ""}
              // onChange={(e) => handleChange(e, "backgroundDescription")}
              value={scenarioDetails.deliverable || ""}
              onChange={(value) => handleChange(value, "deliverable")}
              placeholder="Enter deliverable description"
              disabled={role !== "game_master"}
              role={role}
              wordCount={deliverableWordCount}
              controls={true}
            />
            {/* <div className="text-end text-xs p-2 text-gray-300">
              word count: {deliverableWordCount}
            </div> */}
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 my-2 linearbg box">
        <div className="block max-w-full">
          <h5 className="blackHeadings">Timeline</h5>
          <span className="flex flex-row py-2 justify-between">
            {isEditing.timeline ? (
              <>
                <textarea
                  className="w-full textarea-no-border"
                  rows={1}
                  value={scenarioDetails.timeline || "Timeline"}
                  onChange={(e) => handleChange(e, "timeline")}
                  placeholder="Enter timeline"
                ></textarea>
                <div className="flex space-x-2">
                  <button
                    className="text-green-500"
                    onClick={() => handleSaveClick("timeline")}
                  >
                    <FontAwesomeIcon icon={faSave} size="sm" />
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => handleCancelClick("timeline")}
                  >
                    <FontAwesomeIcon icon={faTimes} size="sm" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <small className=" inter-small-style ">
                  {/* {scenarioDetails.timeline ||  */}
                 Ex : 2024-2025
                  {/* } */}
                </small>
                {/* {role === "game_master" && (
                  <small className="text-gray-400">
                    <FontAwesomeIcon
                      icon={faPen}
                      size="sm"
                      onClick={() => handleEditClick("timeline")}
                      className="cursor-pointer"
                    />
                  </small>
                )} */}
              </>
            )}
          </span>
          <div className={`relative border-0 rounded-lg px-2 innerBox ${role !== "game_master" ? 'bg-[#F9F9F999]' : ''}`}>
          <input
              // name="timelineDesc"
              name="timeline"
           
              className="w-full border-none outline-none" 
              //  value={scenarioDetails.timelineDesc || ""}  
              value={scenarioDetails.timeline || ""}  
             
              // onChange={(e) => handleChange(e, "timelineDesc")}
              onChange={(e) => handleInputChange(e, "timeline")}
              placeholder="Enter timeline description"
              disabled={role !== "game_master"}
            ></input>
            {/* <div className="text-end text-xs p-2 text-gray-300">
              word count: {timelineWordCount}
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

if(Role=== 'participant'){
 return(
  <>
  <div className="border border-gray-200 rounded-lg  my-2  box">
    <div className="block max-w-full ">
    <div className="linearbg p-4 rounded-t-lg">
      <h5 className="blackHeadings">Background</h5>
      <span className="flex flex-row py-2 justify-between">
        {isEditing.background ? (
          <>
            <textarea
              className="w-full"
              rows={1}
              placeholder="Enter background details"
         
              value={scenarioDetails.background || "What needs to be done and why. What needs to be disrupted"}
              onChange={(e) => handleChange(e, "background")}
            ></textarea>
            
            <div className="flex space-x-2">
              <button
                className="text-green-500"
                onClick={() => handleSaveClick("background")}
              >
                <FontAwesomeIcon icon={faSave} size="sm" />
              </button>
              <button
                className="text-red-500"
                onClick={() => handleCancelClick("background")}
              >
                <FontAwesomeIcon icon={faTimes} size="sm" />
              </button>
            </div>
          </>
        ) : (
          <>
            <small className=" inter-small-style ">
              {/* {scenarioDetails.background ||  */}
              What needs to be done and why. What needs to be disrupted
              {/* } */}
            </small>
            {/* {role === "game_master" && (
              <small className="text-gray-400">
                <FontAwesomeIcon
                  icon={faPen}
                  size="sm"
                  onClick={() => handleEditClick("background")}
                  className="cursor-pointer"
                />
              </small>
            )} */}
          </>
        )}
      </span>
      </div>
      <div className={`relative border-0 px-4 py-2 ${role !== "game_master" ? 'bg-[white]' : ''}`}>
       
         
            <p className="basic-details-style capitalize ">
           <span
             dangerouslySetInnerHTML={{
               __html: scenarioDetails.background
             }}/>
            </p>
      </div>
    </div>
  </div>

  <div className="border border-gray-200 rounded-lg  my-2  box">
   <div className="block max-w-full">
   <div className="linearbg p-4 rounded-t-lg">
      <h5 className="blackHeadings">Deliverable</h5>
      <span className="flex flex-row py-2 justify-between">
        {isEditing.deliverable ? (
          <>
            <textarea
              className="w-full hide-scrollbar"
              rows={1}
          
              value={scenarioDetails.deliverable || "The solution you will propose should meet this deliverable. "}
              onChange={(e) => handleChange(e, "deliverable")}
              placeholder="Enter deliverable"
            ></textarea>
            <div className="flex space-x-2">
              <button
                className="text-green-500"
                onClick={() => handleSaveClick("deliverable")}
              >
                <FontAwesomeIcon icon={faSave} size="sm" />
              </button>
              <button
                className="text-red-500"
                onClick={() => handleCancelClick("deliverable")}
              >
                <FontAwesomeIcon icon={faTimes} size="sm" />
              </button>
            </div>
          </>
        ) : (
          <>
            <small className=" inter-small-style ">
              {/* {scenarioDetails.deliverable || */}
               The solution you will propose should meet this deliverable.
               {/* } */}
            </small>
            {/* {role === "game_master" && ( */}
              {/* <small className="text-gray-400">
                <FontAwesomeIcon
                  icon={faPen}
                  size="sm"
                  onClick={() => handleEditClick("deliverable")}
                  className="cursor-pointer"
                />
              </small> */}
            {/* )} */}
          </>
        )}
      </span>
      </div>
      <div className={`relative border-0 px-4 py-2 ${role !== "game_master" ? 'bg-[white]' : ''}`}>
     
       
           <p className="basic-details-style capitalize"><span
             dangerouslySetInnerHTML={{
               __html: scenarioDetails.deliverable
             }}
           /></p>
      </div>
    </div>
  </div>

  <div className="border border-gray-200 rounded-lg  my-2  box">
    <div className="block max-w-full ">
    <div className="flex flex-row justify-between linearbg p-4 rounded-t-lg">
      <h5 className="blackHeadings">Timeline</h5>
      <h3 className="inter-style">{scenarioDetails.timeline}</h3>
      </div>
      
    </div>
  </div>
</>
 )
}
};

export default BasicDetail;
