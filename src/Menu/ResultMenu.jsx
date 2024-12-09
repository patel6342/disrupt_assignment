import { useState ,useCallback} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Dropdown from "../components/Dropdown/Dropdown"; // Ensure the path is correct
import { debounce } from 'lodash';
const ResultMenu = ({ onSearch ,options }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState(null); 


  const debouncedSearch = useCallback(
    debounce((term) => {
      onSearch(term);
    }, 300),
    [onSearch]
  );

  const handleSearchChange = (e) => {

    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value); 
  };

  const handleDropdownChange = (selected) => {
    setSelectedOption(selected);

  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto mt-4 w-full md::w-full">
      <div className="flex flex-row justify-between items-center gap-4 w-full py-2 px-3">
       
          <div className="flex space-x-2  w-8/12 md:w-6/12 ">
            <div className="relative w-full md:w-auto">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search By Name..."
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-auto pl-10"
              />
              <div className="absolute inset-y-0 left-0 flex  pl-3 py-2  pointer-events-none">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1114.1 3.6a7.5 7.5 0 012.55 12.9z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className=" flex flex-row gap-4 w-4/12 md:w-6/12 justify-end items-center">
          {options ? <> <Dropdown
              label="Sort By"
              options={options}
              selected={selectedOption}
              onChange={handleDropdownChange}
            /></> :" "}  
           
            <div className="flex justify-center py-2 items-center w-8 h-8 border border-gray-200 rounded" onClick={goBack}>
              <svg
                width="24"
                height="22"
                fill="none"
                stroke="#4C6EF5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M15.375 5.25 8.625 12l6.75 6.75"></path>
              </svg>
            </div>
            </div>
        </div>
      </div>
   
  );
};

ResultMenu.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default ResultMenu;
