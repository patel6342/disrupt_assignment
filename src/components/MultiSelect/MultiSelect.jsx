import React, { useState, useEffect, useCallback } from "react";
import "react-tagsinput/react-tagsinput.css";
import AddConstraintModal from "../../Modal/AddConstraintModal/AddConstraintModal";
import blueDelIcon from "../../assets/icons/blueDelIcon.svg";
import AutoResizeTextarea from "../AutoResizeTextArea/AutoResizeTextArea";

const MultiSelect = ({
  isToggled,
  demands,
  onDemandChange,
  onDeleteDemand,
  handleDemandChange,
  status,
}) => {
  const [tagsByDemandId, setTagsByDemandId] = useState({});
  const [demand, setDemand] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDemandId, setSelectedDemandId] = useState(null);
  const [editDemandId, setEditDemandId] = useState(null);
  const [editedDemandTextById, setEditedDemandTextById] = useState({});

  useEffect(() => {
    if (Array.isArray(demands)) {
      setDemand(demands);
    }
  }, [demands]);

  // useEffect(() => {
  //   if (Array.isArray(demands)) {
  //     console.log(demands,"demands in useeffect")
  //     const updatedTagsByDemandId = demands.reduce((acc, curr) => {
  //       const constraints = curr?.constraints;
  //       acc[curr.id] = Array.isArray(constraints) ? constraints : [];
  //       return acc;
  //     }, {});
  //     setTagsByDemandId(updatedTagsByDemandId);
  //   }
  // }, [demands]);

  useEffect(() => {
    if (Array.isArray(demand)) {
      const updatedTagsByDemandId = demand.reduce((acc, curr) => {
        const constraints = curr?.constraints;
        acc[curr.id] = Array.isArray(constraints) ? constraints : [];
        return acc;
      }, {});
      setTagsByDemandId(updatedTagsByDemandId);
    }
  }, [demand]);


  const handleChange = useCallback(
    (demandId, tags) => {
      const updatedTags = { ...tagsByDemandId, [demandId]: tags };
      setTagsByDemandId(updatedTags);
      onDemandChange?.(updatedTags);
    },
    [tagsByDemandId, onDemandChange]
  );

  const handleDemandNameChange = (
    (demandId, name) => {
      console.log("demid,nam", demandId, name)
      // const updatedDemand = demand.map((d) =>
      //   d.id?.toString() === demandId.toString() ? { ...d, text: name } : d
      // );
      setDemand((prevDemands) =>
        prevDemands.map((d) =>
          d.id.toString() === demandId?.toString()
            ? { ...d, text: name }
            : d
        )
      );
      handleDemandChange?.(demandId, name);
    }

  )

  const handleDelete = (
    (demandId) => {
      if (window.confirm("Are you sure you want to delete this demand?")) {
        onDeleteDemand?.(demandId);
      }
    }

  );

  const handleOpenModal = useCallback((demandId) => {
    setSelectedDemandId(demandId);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedDemandId(null);
  }, []);

  const handleSaveConstraints = (
    (newTags) => {
      console.log(newTags);
      if (selectedDemandId !== null) {
        handleChange(selectedDemandId, newTags);
        handleCloseModal();
      }
    })


  const handleRemoveConstraint = (
    (demandId, constraintIndex) => {
      console.log(constraintIndex);
      console.log(demandId);
      console.log(demand?.find(d4 => d4?.id === demandId));
      const updatedTags = demand?.find(d4 => d4?.id === demandId)?.constraints?.filter(
        (_, index) => index !== constraintIndex
      );
      // const updatedTags = tagsByDemandId[demandId].filter(
      //   (_, index) => index !== constraintIndex
      // );
      setDemand((prevDemands) =>
        prevDemands.map((d) => (
          d.id.toString() === demandId?.toString()
            ? { ...d, constraints: updatedTags }
            : d
        )
        )
      );
      handleChange(demandId, updatedTags);

      // setTagsByDemandId((prevTags) => ({
      //   ...prevTags,
      //   [demandId]: updatedTags,
      // }));
      // onDemandChange?.({ ...tagsByDemandId, [demandId]: updatedTags });
    }
  );

  // const handleRemoveConstraint = (demandId, constraintIndex) => {
  //   console.log(constraintIndex, "constraint Index");
  //   console.log(demandId, "demand id");
  //   console.log(demand?.find(d4 => d4?.id === demandId)?.constraints, "compare demands");
  //   const updatedTags = demand?.find(d4 => d4?.id === demandId)?.constraints?.filter(
  //     (_, index) => index !== constraintIndex
  //   );
  //   console.log(updatedTags, "updated tags");
  //   // const updatedTags = tagsByDemandId[demandId].filter(
  //   //   (_, index) => index !== constraintIndex
  //   // );
  //   setDemand((prevDemands) =>
  //     prevDemands.map((d) =>
  //       d.id.toString() === demandId?.toString()
  //         ? { ...d, constraints: updatedTags }
  //         : d
  //     )
  //   );

  //   // setTagsByDemandId((prevTags) => ({
  //   //   ...prevTags,
  //   //   [demandId]: updatedTags,
  //   // }));
  //   // onDemandChange?.({ ...tagsByDemandId, [demandId]: updatedTags });
  // }
  // useEffect(() => {
  //   if (editedDemandTextById && Object.keys(editedDemandTextById).length > 0) {
  //     const editDemandId = Object.keys(editedDemandTextById)[0];
  //     const newDemandText = editedDemandTextById[editDemandId]; 

  //     console.log("editDemandId, newDemandText", editDemandId, newDemandText);

  //     // setDemand((prevDemands) =>
  //     //   prevDemands.map((d) =>
  //     //     d.id.toString() === editDemandId.toString()
  //     //       ? { ...d, text: newDemandText }
  //     //       : d
  //     //   )
  //     // );

  //     handleDemandNameChange(editDemandId, newDemandText);
  //   }
  // }, [editedDemandTextById]); 



  useEffect(() => {
    console.log("dem", demand)
  }, [demand])

  return (
    <div className="p-4 bg-[#f9faff] border hide-scrollbar overflow-y-scroll border-transparent border-t-0 border-b-0 border-l-0 border-r-0 border-image linear-gradient(125.01deg, rgba(76, 110, 245, 0.1) -41.31%, #FFFFFF 54.69%)">
      {Array.isArray(demand) &&
        demand.map((d) => (
          <div
            key={d.id}
            className="block max-w-full bg-white rounded-lg p-4 mb-2 shadow-sm"
          >
            <div className="grid grid-cols-12">
              <div className="col-span-11 pe-1">
                <div className="border border-gray-200 rounded-lg w-full h-auto p-2 flex justify-between items-center">
                  {console.log(demand.find(d3 => d3?.id?.toString() === d.id?.toString()))}
                  {/* <AutoResizeTextarea
                    rows={1}
                    value={demand.find(d3 => d3?.id?.toString() === d.id?.toString())?.text || ""}
                   onChange={(value) => handleDemandNameChange(d.id, value)}
                    // onChange={(value) =>
                    //   setDemand((prevDemands) =>
                    //     prevDemands.map((d2) =>
                    //       d2.id.toString() === d.id?.toString()
                    //         ? { ...d, text: value }
                    //         : d
                    //     )
                    //   )
                    // }
                    // setEditedDemandTextById((prevState) => ({
                    //   ...prevState,
                    //   [d.id]: value,
                    // }));

                    className="w-full text-md px-2 outline-none inter-deamndName-style text-[#4C6EF5]"
                    placeholder="Enter Demand"
                  /> */}
                  <textarea rows={1}
                    value={demand.find(d3 => d3?.id?.toString() === d.id?.toString())?.text || ""}
                    onChange={(e) => handleDemandNameChange(d.id, e.target.value)}
                    className="w-full text-md px-2 outline-none inter-deamndName-style text-[#4C6EF5]"
                    placeholder="Enter Demand"
                  >

                  </textarea>
                </div>
              </div>
              {isToggled && (
                <div className="col-span-1 ps-1">
                  <button
                    type="button"
                    className="flex justify-center items-center w-full h-11 border border-gray-200 rounded-lg"
                    onClick={() => handleDelete(d.id)}
                  >
                    <img
                      src={blueDelIcon}
                      alt="del"
                      className="w-5 h-5 cursor-pointer"
                      loading="lazy"
                    />
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <div className="flex flex-row items-center gap-2 flex-wrap hide-scrollbar">
                <button
                  disabled={!isToggled}
                  type="button"
                  onClick={() => handleOpenModal(d.id)}
                  className="text-[#9329AE] inter-deamndName-style py-2 px-4 rounded bg-[#FBF7FC]"
                >
                  + Add Constraints
                </button>
                {tagsByDemandId[d.id]?.map((constraint, index) => (
                  <span
                    key={index}
                    className="p-2 rounded-md inter-style "
                    style={{
                      textAlign: "center",
                      color: "#9127AC",
                      backgroundColor: "#9329AE0A",
                      marginRight: "4px",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      className="cursor-pointer text-xl p-2"
                      onClick={() => handleRemoveConstraint(d.id, index)}
                    >
                      &times;
                    </span>
                    {constraint}
                  </span>
                ))}
              </div>
              <AddConstraintModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveConstraints}
                constraints={tagsByDemandId[selectedDemandId] || []}
              />
            </div>
          </div>
        ))}
    </div>
  );
};

export default MultiSelect;
