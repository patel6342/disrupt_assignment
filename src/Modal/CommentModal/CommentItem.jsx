import React from 'react'
import judge3 from "../../assets/modal/judge3.png";

export const CommentItem = (props) => {
    const {req, demand, judge, comment, onclick, identifier, content, children, active, delay} = props;
    return (
        <div 
        onClick={() => {onclick(identifier)}}
        style={{fontFamily: "Work Sans"}}
        className={`${demand?"animate-[appear_0.5s] flex justify-between pr-[30px] pl-[70px] ":"text-center"}
        ${judge?"animate-[appear_0.5s] flex justify-center":""} ${delay}
           relative capitalize mt-[10px] mb-[10px] p-[10px] bg-white shadow-lg rounded-lg w-full hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 border border-transparent cursor-pointer
        `}
        >
            
            {/* {demand?<div className='absolute flex justify-center items-center top-0 left-0 bg-gray-100 p-[5px]'></div>:<></>} */}
            {active == true?<div className='absolute flex justify-center items-center top-0 left-0 text-[#4C6EF5] font-medium text-xs bg-sky-100 rounded-tl-lg rounded-br-lg p-[5px]'>open</div>:<></>}
            {demand?<div className='absolute flex justify-center items-center top-0 left-0 text-[#4C6EF5] font-medium text-xs bg-sky-100 rounded-tl-lg rounded-br-lg p-[5px]'>Demand</div>:<></>}
            {judge?<div className='absolute flex justify-center items-center top-0 left-0 text-[#4C6EF5] font-medium text-xs bg-sky-100 rounded-tl-lg rounded-br-lg p-[5px]'>Judge</div>:<></>}
            {judge?<img className="mr-[10px]" src={judge3} width={20} alt="judge3"/>:<></>}
            
            {(demand)?children: judge?content:content}
        </div>
        )
}
