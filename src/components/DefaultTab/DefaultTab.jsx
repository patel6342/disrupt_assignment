import React, { useState } from 'react';

const DefaultTab = ({ tabs, dir = 'col',dirTop='row' ,className='',cl='' }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.name);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className={`flex flex-col md:flex-${dirTop} w-full ${className}`}>
      <div className={`flex overflow-x-auto hide-scrollbar flex-${dir} w-full ${cl}` }>
        {tabs.map((tab) => (
          <button
            key={tab?.name}
            className={`py-2 px-4 text-sm font-medium transition-colors duration-200 
              ${activeTab === tab.name ? 'border-b-2 border-[#3474F6] font-bold text-[#3474F6]' : 'text-[#1D1929CC]'}`}
            onClick={() => handleTabClick(tab?.name)}
          >
            {tab.name}
          </button>
        ))}
      </div>

      <div className="flex overflow-x-auto hide-scrollbar flex-col w-full ">
        {tabs.map((tab) => (
          <div
            key={tab?.name}
            className={`transition-opacity w-full duration-300 ${activeTab === tab.name ? 'block' : 'hidden'}`}
          >
            {tab?.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DefaultTab;
