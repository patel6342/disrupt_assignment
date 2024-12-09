import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const DefaultAccordion = ({ tabs }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleAccordionClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className='overflow-y-scroll hide-scrollbar h-auto px-4' >
      {tabs.map((tab, index) => (
        <div key={tab.name} className="mb-2">
          <button
            onClick={() => handleAccordionClick(index)}
            className={`w-full capitalize text-left py-2 px-4 text-sm font-medium flex border-t border-gray-200 rounded-t-lg items-center justify-between shadow-md ${activeIndex === index ? 'innerbox linearbg text-black  ' : 'bg-white text-[#1D1929CC] '} `}
          >
            <span>{tab.name}</span>
            <FontAwesomeIcon
              icon={activeIndex === index ? faChevronUp : faChevronDown}
              className={`transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : 'rotate-0'}`}
            />
          </button>
          <div
            className={`transition capialize duration-300 ease-in-out overflow-x-scroll bg-white shadow-md rounded-b-lg hide-scrollbar ${activeIndex === index ? 'h-auto' : 'max-h-0'}`}
          >
            <div className="p-4">
              {tab.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DefaultAccordion;
