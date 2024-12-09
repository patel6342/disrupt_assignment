import React, { useState, useEffect, useCallback } from "react";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";

const AddConstraintModal = ({ isOpen, onClose, onSave, constraints }) => {
  const [tags, setTags] = useState([]);
  const [newTags, setNewTags] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTags([...new Set(constraints)]);
      setNewTags([]);
      setError("");
    }
  }, [isOpen, constraints]);

  const handleSave = () => {
    const allTags = [...new Set([...tags, ...newTags])];
    onSave(allTags);
    onClose();
  };
  const handleTagsChange = (currentTags) => {
    const lowerCurrentTags = currentTags.map(tag => tag.toLowerCase());
    const lowerConstraints = constraints.map(tag => tag.toLowerCase());
    const lowerTags = tags.map(tag => tag.toLowerCase());
    const lowerNewTags = newTags.map(tag => tag.toLowerCase());
  
    // Check for discrepancies
    const hasDuplicates = lowerCurrentTags.some((tag, index) => 
      lowerCurrentTags.indexOf(tag) !== index
    );
  
    const invalidTags = lowerCurrentTags.filter(tag =>
      lowerConstraints.includes(tag) ||
      lowerTags.includes(tag) ||
      lowerNewTags.includes(tag)
    );
    
  
    if (hasDuplicates) {
      setError("Tags should be unique.");
    } else if (invalidTags.length > 0) {
      setError("Tags should not be already added.");
    } else {
      setError("");
      const uniqueNewTags = currentTags.filter((tag, index) => {
        const lowerTag = tag.toLowerCase();
        return lowerCurrentTags.indexOf(lowerTag) === index;
      });
  
      // Update newTags state with uniqueNewTags
      const accumulatedTags = [...new Set([...newTags, ...uniqueNewTags])];
      setNewTags(accumulatedTags);
    }
  };
  

  const handleRemoveConstraint = useCallback((index) => {
    setNewTags(prevTags => prevTags.filter((_, i) => i !== index));
  }, []);

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div className="bg-white rounded-lg w-1/3">
        <div className="flex justify-between items-center px-4 p-2 bg-[#FBF7FC]">
          <h2 className="text-lg font-semibold text-[#9329AE]">Add Constraint</h2>
          <span
            className="mr-2 py-2 px-4 text-2xl font-bold cursor-pointer"
            onClick={onClose}
          >
            &times;
          </span>
        </div>

<div className=' mx-4 mt-4 mb-2 flex  items-center'  style={{ border: '1px solid #d1d5db', borderRadius: '0.375rem', padding: '0.5rem' }} >
        <TagsInput
          value={[]}
          className="w-full"
          onChange={handleTagsChange}
          placeholder="Enter constraints..."
          inputProps={{ className: "text-sm  px-4  " }}
          // inputProps={className: "text-sm px-4 capitalize"}
  tagProps={{ style: { backgroundColor: '#e5e7eb', color: '#374151', borderRadius: '0.375rem', padding: '0.25rem 0.5rem', margin: '0.125rem' } }}

        />
        </div>
        <small className="mx-4 info text=[#A5A3A9]">Press Enter to add a constraint</small>

        {error && <p className="text-red-500  info mx-4">{error}</p>}
        <div className="flex mx-4 flex-wrap">
          {newTags.map((tag, index) => (
            <span
              key={index}
              className=" px-2 rounded-md inter-style capitalize bg-[#9329AE0A] text-[#9127AC] mr-2 mb-2"
            >
              
              {tag}
              <span 
                className="cursor-pointer text-xl pr-2"
                onClick={() => handleRemoveConstraint(index)}
              >
                &times;
              </span>
            </span>
          ))}
        </div>

        <div className="flex justify-end mt-4 px-4 pb-4">
          <button
            type="button"
            className="text-[#9329AE] py-2 px-4 rounded bg-[#FBF7FC]"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default AddConstraintModal;
