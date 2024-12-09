import { useEffect, useState ,useCallback,Suspense,lazy} from "react";
import Toggle from "react-toggle";

import "react-toggle/style.css";

import bluePenIcon from "../../assets/icons/bluePenIcon.svg";

const MultiSelect = lazy(() => import("../MultiSelect/MultiSelect.jsx"));
import ComponentLoader from "../ComponentLoader/ComponentLoader.jsx";

const Usability = ({
  handleFieldDemandChange,
  headerText,
  description,
  onFieldChange,
  onAddDemand,
  onDeleteDemand,
  onDemandConstraintsChange,
  handleBackClick,
  handleNextClick,
  activeTab,
  tabs,
  demands,
  status,
  showDone,
  setScenarioDetails,
  sectionKey
}) => {
  const [isToggled, setIsToggled] = useState(false);
  const [details, setDetails] = useState({ description: "" });
  const [demand, setDemand] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (demands) {
      setDemand(demands || []);
      console.log("demand",demand)
    }
  }, [demands]);

  useEffect(() => {
    if (description) {
      setDetails((prev) => ({ ...prev, description }));
    }
  }, [description]);

  // useEffect(() => {
  //   setIsToggled(status);
  // }, [status]);
 
  useEffect(() => {
    setIsToggled(status || demand.length > 0);
  }, [status, demand.length]);

  const handleToggle = useCallback(() => {
    const newStatus = !isToggled;
    setIsToggled(newStatus);
    if (onFieldChange) {
      onFieldChange("is_enabled", newStatus);
    }
  }, [isToggled, onFieldChange]);


  const handleDeleteDemand = ((updatedDemands) => {
    setDemand(updatedDemands);
    if (onDeleteDemand) onDeleteDemand(updatedDemands);
  });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    if (onFieldChange) {
      onFieldChange("description", details.description);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleDemandChange = ((id, name) => {
    console.log("chj",id,name)
    if (id && name) {
      handleFieldDemandChange(id, name);
    }
  })

  const handleDemandFieldChange = ((updatedTagsByDemandId) => {
    if (onDemandConstraintsChange) {
      onDemandConstraintsChange(updatedTagsByDemandId);
    }
  })


  const handleChange = (event) => {
    const newValue = event.target.value;
    setDetails((prev) => ({
      ...prev,
      description: newValue,
    }));
    if (onFieldChange) {
      onFieldChange("description", newValue);
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSaveClick();
    }
  };

 const handleBlur = (event) => {
  
  handleSaveClick();
    
  };
 

  return (
    <div className="h-full bg-[#f9faff]">
      <div className="flex flex-col lg:flex-row justify-between w-full bg-[#f9faff]">
        <div className="w-full lg:w-7/12 px-4 py-4">
          <h5 className="work-sans-headerText-style text-[#000000] capitalize">{headerText}</h5>
          <p className="mb-2 text-md font-medium text-[#666b72]">
            <span className="flex flex-row py-2 justify-between">
              {isEditing ? (
                <>
                  <textarea
                    className="w-full text-md"
                    rows={1}
                    value={details.description}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                  ></textarea>
                  <div className="flex space-x-2 mt-2">
                  
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-400 inter-small-style capitalize">{details.description}</p>
                  <small className="text-gray-400 ml-2">
                    {/* <FontAwesomeIcon
                      icon={faPen}
                      size="sm"
                      color='#4C6EF5'
                      onClick={handleEditClick}
                      className="cursor-pointer"
                    /> */}
                    {/* <img src={bluePenIcon} alt="edit" className="w-5 h-5 cursor-pointer text-[4C6EF5]"  onClick={handleEditClick} loading='lazy'/> */}
                     
                  </small>
                </>
              )}
            </span>
          </p>
        </div>

        <div className="flex space-x-2 p-4 w-full lg:w-5/12 gap-2 m-1 justify-between lg:justify-end items-center ">
          <div className="flex items-center w-full lg:w-6/12">
            <p className="text-md font-medium text-[#4C6EF5]">
              {isToggled ? "Enabled" : "Disabled"}
            </p>
            <Toggle
              checked={isToggled}
              onChange={handleToggle}
              icons={false}
              className="custom-toggle mx-2"
            />
          </div>
          {isToggled && (
            <div className="flex w-6/12">
              <button
                 className="flex items-center  px-2 py-2 text-blue-500 border font-bold inter-style border-blue-500 rounded-md hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-auto"
              onClick={onAddDemand}
              >
                
                <span className="ml-2"> <span className="text-lg"> + </span>Add Demand</span>
              </button>
            </div>
          )}
        </div>
      </div>
      {/* bg-[#f9faff] */}
      <div className="flex flex-col  my-2 mx-1 ">
      <Suspense fallback={<ComponentLoader />}>
            
        <MultiSelect
          status={status}
          className=""
          demands={demand}
          onDeleteDemand={handleDeleteDemand}
          onDemandChange={handleDemandFieldChange}
          isToggled={isToggled}
          handleDemandChange={handleDemandChange} 
          setScenarioDetails={setScenarioDetails}
          sectionKey={sectionKey}
        />
        </Suspense>
      </div>

      <div className="flex space-x-2 justify-end bg-[#f9faff] p-4">
        <button
          className={`bg-[#ffffff]  py-1 px-3 rounded border-2 border-[#E7EBFC] text-xs flex items-center ${
            activeTab === 3
              ? "cursor-not-allowed opacity-50 text-[#E7EBFC]"
              : " text-[#4C6EF5] "
          }`}
          disabled={activeTab === 3}
          onClick={handleBackClick}
          aria-label="Go Back"
        >
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="#E7EBFC"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M15.375 5.25 8.625 12l6.75 6.75"></path>
          </svg>
          <span className="ml-2">Back</span>
        </button>

        <button
          className={`bg-[#ffffff]  py-1 px-3 rounded border-2 border-[#E7EBFC] text-xs flex items-center ${
            activeTab === tabs ? " text-[#4C6EF5] " : " text-[#4C6EF5] "
          }`}
          disabled={(activeTab-2) === tabs}
          onClick={handleNextClick}
          aria-label="Go Forward"
        >
          <span className="ml-2">{showDone ? "Submit" : " Next"}</span>
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="#E7EBFC"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M8.625 5.25 15.375 12 8.625 18.75"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Usability;
