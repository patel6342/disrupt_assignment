import React, { useState, useEffect, useRef } from "react";

const DropActions = ({ options, heading }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const dropActionsRef = useRef(null);
  const handleClickOutside = (event) => {
    if (
      dropActionsRef.current &&
      !dropActionsRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={dropActionsRef} className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full  "
          id="options-menu"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={toggleDropdown}
        >
          {heading}
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 z-[9999] mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1">
            {options?.map((item, index) => (
              <a
                key={index}
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
                onClick={() => {
                  item?.onClick();
                  setIsOpen(false);
                }}
              >
                <>{item.name}</>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropActions;
