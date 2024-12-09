import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Dropdown from "../components/Dropdown/Dropdown";
import Button from "../components/Button/Button";

const AdminMenu = ({ onSearch, options, roleOptions, onAddUser }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState(null);
  const [roleOption, setRoleOption] = useState(null);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleSortChange = (selected) => {
    setSortOption(selected);
  };

  const handleRoleChange = (selected) => {
    setRoleOption(selected);
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto mt-4 w-full md:w-10/12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full py-2 px-3">
        <div className="flex  flex-col md:flex-row gap-4 w-full justify-between items-center">
          <div className="relative ">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search By Name / Email..."
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full pl-10"
              aria-label="Search"
            />
            <div className="absolute inset-y-0 left-0 flex pl-3 py-2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1114.1 3.6a7.5 7.5 0 012.55 12.9z"></path>
              </svg>
            </div>
          </div>

          <Dropdown
            label="Sort By"
            options={options}
            selected={sortOption}
            onChange={handleSortChange}
          />

          <Dropdown
            label="Role"
            options={roleOptions}
            selected={roleOption}
            onChange={handleRoleChange}
          />

          <div
            className="flex justify-center py-2 items-center w-8 h-8 border border-gray-200 rounded cursor-pointer"
            aria-label="Filter"
          >
            <FontAwesomeIcon
              icon={faFilter}
              size="lg"
              color="#1D1929"
            />
          </div>

          <Button buttonName={"+ Add User"} onClick={onAddUser} />
        </div>
      </div>
    </div>
  );
};

AdminMenu.propTypes = {
  onSearch: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  roleOptions: PropTypes.array.isRequired,
  onAddUser: PropTypes.func.isRequired,
};

export default AdminMenu;
