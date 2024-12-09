import React, { useState, useEffect } from "react";
import DefaultTab from "../../components/DefaultTab/DefaultTab"; // Adjust the path if needed
import DefaultAccordion from "../../components/DefaultAccordion/DefaultAccordion";
import { CommentItem } from "./CommentItem";

import judge from "../../assets/modal/judge.png";
import paper from "../../assets/modal/paper.png";
import part2 from "../../assets/modal/part2.png";
import part3 from "../../assets/modal/part3.png";
import demand from "../../assets/modal/demand.png";
import score from "../../assets/modal/score.png";
import req from "../../assets/modal/req.png";
import headerSvg from "../../assets/svg/header.svg"

const CommentModal = ({ isOpen, onClose, comments, partname }) => {
  const [reqs, setReqs] = useState([]);
  const [activeReq, setActiveReq] = useState("");
  const [curStep, setCurStep] = useState(0);
  const [activeDemand, setActiveDemand] = useState();
  const [activeJudge, setActiveJudge] = useState();

  const [activeReqtab, setActiveReqTab] = useState("");
  const [activeDemandtab, setActiveDemandTab] = useState("");
  const [activeJudgetab, setActiveJudgeTab] = useState("");

  useEffect(() => {
    setReqs(Object.keys(comments));

    setActiveReq(comments[Object.keys(comments)[0]]);
    setActiveReqTab(Object.keys(comments)[0]);
    setActiveDemandTab("");
    setActiveJudgeTab("");
    setCurStep(1);
  }, [comments])

  const handleClickItem = (id, sideFlag) => {
    if (curStep == 0 || sideFlag) {
      setActiveReq(comments[id]);
      console.log("jjr", sideFlag);
      console.log("jjr",id);
      setCurStep(1);
        setActiveReqTab(id);
        setActiveDemandTab("");
        setActiveJudgeTab("");
      
      
    } else if (curStep == 1) {
      setActiveDemand(activeReq);
      setActiveReq(activeReq[id].comments);
      setCurStep(2);
      setActiveDemandTab(id);
      setActiveJudgeTab("");
    } else {
      setActiveJudge(activeReq);
      setActiveReq(activeReq[id]);
      setCurStep(3);
      setActiveJudgeTab(activeReq[id]["judge"]);
    }
  }

  const handleBackClick = () => {
    if (curStep == 2) {
      setActiveReq(activeDemand);
      setCurStep(curStep - 1);
      setActiveDemandTab("");
    } else if (curStep == 3) {
      setActiveReq(activeJudge);
      setCurStep(curStep - 1);
      setActiveJudgeTab("");
    }
  }

  const handleBack2Click=()=>{
    setActiveReq(activeDemand);
    setCurStep(curStep-2);
    setActiveDemandTab("");
    setActiveJudgeTab("");
  }

  useEffect(()=>{
    console.log("jjr", comments)
  })

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 p-4 ">
      <div className="w-full h-full absolute left-0 top-0" onClick={() => { onClose() }}></div>
      <div className="h-[90%] w-[80%] bg-white rounded-[20px] flex relative flex-col">
          <div className="flex flex-row justify-between items-center rounded-t-[20px] px-10 py-2 bg-white shadow-lg md:h-auto lg:h-16 relative text-white font-semibold"
            style={{
              backgroundColor: "#4C6EF5", // Base color
              backgroundImage: `url(${headerSvg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundBlendMode: 'overlay',
              fontFamily: "Work Sans" // Blend mode for overlay effect
            }}>Comments
              <div style={{fontFamily: "Work Sans"}} className="text-white font-medium cursor-pointer" onClick={() => { onClose() }}>X</div>
            </div>        
        <div className="h-[90%] rounded-[20px] flex flex-row">
          <div className="flex flex-col items-center bg-[#f9f9f9] border-[#eeeeee] w-[25%] border-r-[3px] rounded-bl-[20px] pt-[50px]  p-[10px]">
            {
              reqs.map((item, index) => {
                return <CommentItem key={`${item}_itemq`} curStep={curStep} active={activeReqtab == item} index={index} content={item} identifier={item} onclick={(id) => { handleClickItem(id, true) }} />
              })
            }
          </div>
          <div className="flex flex-col bg-[#f9f9f9] border-[#eeeeee] w-[75%] rounded-br-[20px]  p-[50px]" >
              <div style={{fontFamily: "Work Sans"}} className="w-full h-[45px] flex justify-center items-center bg-white shadow-lg rounded-lg hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 mr-[10px] h-[8%] p-[10px] flex  mt-[10px] border border-transparent cursor-pointer">
                {activeReqtab?<div className="flex items-center"><svg className="invert invert-0 pr-[5px] fill-gray-100" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 40 40" width="20px" height="20px"><path fill="#dff0fe" d="M3.5 38.5L3.5 13.286 19.998 3.58 36.5 13.286 36.5 38.5z"/><path fill="#4788c7" d="M19.998,4.16L36,13.572V38H4V13.572L19.998,4.16 M19.998,3L3,13v26h34V13L19.998,3L19.998,3z"/><path fill="#b6dcfe" d="M19.998 4.645L1.5 15.955 1.5 12.896 19.998 1.586 38.5 12.896 38.5 15.955z"/><path fill="#4788c7" d="M19.998,2.172L38,13.176v1.887L20.519,4.378l-0.522-0.319l-0.522,0.319L2,15.063v-1.887 L19.998,2.172 M19.998,1L1,12.615v4.231L19.998,5.231L39,16.846v-4.231L19.998,1L19.998,1z"/><g><path fill="#b6dcfe" d="M14.5 21.5H25.5V38.5H14.5z"/><path fill="#4788c7" d="M25,22v16H15V22H25 M26,21H14v18h12V21L26,21z"/></g><path fill="#4788c7" d="M23 30A1 1 0 1 0 23 32A1 1 0 1 0 23 30Z"/></svg>
                <div style={{fontFamily: "Work Sans"}} className={`${activeDemandtab?"text-[#4C6EF5] hover:underline focus:font-medium":"text-slate-500"} `} onClick={()=>{curStep==2&&handleBackClick()||curStep==3&&handleBack2Click()}} dangerouslySetInnerHTML={{__html: activeReqtab?activeReqtab:activeReqtab}}/>
                </div>:<></>}
                <div style={{fontFamily: "Work Sans"}} className="text-slate-500 font-semibold" dangerouslySetInnerHTML={{ __html: activeDemandtab?" ":""}}/>
                {(curStep==2||curStep==3)&&<div className="rotate-180">
                  <svg
                  width="24"
                  height="18"
                  fill="none"
                  stroke="#4C6EF5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M15.375 5.25 8.625 12l6.75 6.75"></path>
                  </svg></div>
                }
                {activeDemandtab?<div className="flex items-center"><img className="pr-[5px]" src={part3} alt="judge" width={25}/>
                <div style={{fontFamily: "Work Sans"}} className={`${activeJudgetab?"text-[#4C6EF5] hover:underline focus:font-medium":"text-slate-500"} `} onClick={()=>{curStep==3&&handleBackClick()}} dangerouslySetInnerHTML={{__html: activeDemandtab?activeDemandtab:activeDemandtab}}></div>
                </div>:<></>}
                <div className="text-slate-500 font-medium" dangerouslySetInnerHTML={{__html: activeJudgetab?"":""}}></div>
                {curStep==3&&<div className="rotate-180">
                  <svg
                  width="24"
                  height="18"
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
                  </div>}
                {activeJudgetab?<div className="flex items-center"><img className="pr-[5px]" src={judge} alt="judge" width={25}></img>
                <div style={{fontFamily: "Work Sans"}} className={`${activeJudgetab?"text-slate-500":""}`} dangerouslySetInnerHTML={{__html: activeJudgetab?activeJudgetab:activeJudgetab}}></div>             
                  </div>:<></>}
              </div>
            
            
           
            <div className="flex flex-col items-center" style={{ overflowY: "auto", marginTop: "10px", marginBottom: "10px", maxHeight: "90%" }}>
              {
                activeReq && curStep != 3 ?
                  Object.keys(activeReq).map((item, index) => {
                    return <CommentItem key={`${item}_itemj`} curStep={curStep} delay={`delay-${index * 100}`} content={curStep < 2 ? "" : activeReq[item].judge} identifier={item} demand={curStep == 1} judge={curStep == 2} onclick={(id) => { handleClickItem(id) }}>
                      {curStep == 1 &&
                <>
                    <div className="flex justify-center items-center" style={{fontFamily: "Work Sans"}}>
                      <img src={demand} alt="demand" width={20} className="mr-[10px]"/>{item}</div>
                    <div className={`${activeReq[item].demand_avg_score?"bg-neutral-200 p-[5px] rounded-lg":""} flex justify-center items-center`} style={{fontFamily: "Work Sans"}}>
                    <div className="flex justify-center items-center" style={{fontFamily: "Work Sans"}}>
                      {activeReq[item].demand_avg_score ?<img src={score} alt="score" width={20} className="mr-[10px]"/>:<></>}
                      {activeReq[item].demand_avg_score ? activeReq[item].demand_avg_score.toFixed(1) : ""}
                    </div>
                    </div>
                </>
                }
                    </CommentItem>
                  }) : curStep == 3 &&
                  <>
                   <div className="w-full mb-[5px]">
                    {
                      curStep == 3 &&
                      <>
                        <div className="animate-[appear_0.5s] w-full mt-[10px] bg-white shadow-lg rounded-lg hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 border border-transparent cursor-pointer">
                          <div style={{fontFamily: "Work Sans"}} className="rounded-lg flex items-center">
                            <div style={{fontFamily: "Work Sans",}} className="flex w-[30%] items-center rounded-lg p-[1px] text-[#4C6EF5]">
                              <div className="flex items-center bg-sky-100 rounded-lg p-[9px]"><img src={part2} alt="part2" width={30}></img>{partname}</div>
                            </div>
                            <div className="flex items-center">
                              <div className="p-[10px] rounded-lg bg-sky-100"><img className="rounded-lg bg-sky-100" src={paper} alt="paper" width={30}/></div>
                              <div style={{fontFamily: "Work Sans"}} className="pl-[5px] text-slate-500" dangerouslySetInnerHTML={{ __html: activeReq ? activeReq.response : "" }}></div>
                            </div>
                          </div>
                        </div>
                      </>}
                  </div>
                  <div style={{fontFamily: "Work Sans"}} className="w-full">
                  <div className="animate-[appear_0.5s] mt-[10px] bg-white shadow-lg rounded-lg w-full hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 border border-transparent cursor-pointer">
                    <div className="rounded-lg flex items-center " style={{fontFamily: "Work Sans"}}>
                      <div className="flex items-center rounded-lg p-[10px] w-[30%] " style={{ backgroundColor: "#f7f8fc", fontFamily: "Work Sans" }}>Consistency comment</div>
                      <div className="pl-[5px]" style={{fontFamily: "Work Sans"}} dangerouslySetInnerHTML={{ __html: activeReq ? activeReq.consistency_comment : "" }}></div>
                    </div>
                  </div>
                  <div className="animate-[appear_0.5s] mt-[15px] bg-white shadow-lg rounded-lg w-full hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 border border-transparent cursor-pointer">
                    <div className="rounded-lg flex items-center" style={{fontFamily: "Work Sans"}}>
                      <div className="flex items-center rounded-lg p-[10px] w-[30%] " style={{ backgroundColor: "#f7f8fc", fontFamily: "Work Sans" }}>Efficiency comment</div>
                      <div className="pl-[5px]" style={{fontFamily: "Work Sans"}} dangerouslySetInnerHTML={{ __html: activeReq ? activeReq.efficiency_comment : "" }}></div>
                    </div>
                  </div>
                  <div className="animate-[appear_0.5s] mt-[15px] bg-white shadow-lg rounded-lg w-full hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 border border-transparent cursor-pointer">
                    <div className=" rounded-lg flex items-center" style={{fontFamily: "Work Sans"}}>
                      <div className="flex items-center rounded-lg p-[10px] w-[30%]" style={{ backgroundColor: "#f7f8fc", fontFamily: "Work Sans" }}>Feasibility comment</div>
                      <div className="pl-[5px]" style={{fontFamily: "Work Sans"}} dangerouslySetInnerHTML={{ __html: activeReq ? activeReq.feasibility_comment : "" }}></div>
                    </div>
                  </div>
                  <div className="animate-[appear_0.5s] mt-[15px] bg-white shadow-lg rounded-lg w-full hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 border border-transparent cursor-pointer">
                    <div className=" rounded-lg flex items-center" style={{fontFamily: "Work Sans"}}>
                      <div className="flex items-center rounded-lg p-[10px] w-[30%]" style={{ backgroundColor: "#f7f8fc", fontFamily: "Work Sans" }}>Originality comment</div>
                      <div className="pl-[5px]" style={{fontFamily: "Work Sans"}} dangerouslySetInnerHTML={{ __html: activeReq ? activeReq.originality_comment : "" }}></div>
                    </div>
                  </div>
                  <div className="animate-[appear_0.5s] mt-[15px] bg-white shadow-lg rounded-lg w-full hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 border border-transparent cursor-pointer">
                    <div className=" rounded-lg flex items-center" style={{fontFamily: "Work Sans"}}>
                      <div className="flex items-center rounded-lg p-[10px] w-[30%]" style={{ backgroundColor: "#f7f8fc", fontFamily: "Work Sans" }}>Security comment</div>
                      <div className="pl-[5px]" style={{fontFamily: "Work Sans"}} dangerouslySetInnerHTML={{ __html: activeReq ? activeReq.security_comment : "" }}></div>
                    </div>
                  </div>
                  <div className="animate-[appear_0.5s] mt-[15px] mb-[15px] bg-white shadow-lg rounded-lg w-full hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 border border-transparent cursor-pointer">
                    <div className="rounded-lg flex items-center" style={{fontFamily: "Work Sans"}}>
                      <div className="flex items-center rounded-lg p-[10px] w-[30%]" style={{ backgroundColor: "#f7f8fc", fontFamily: "Work Sans" }}>Value for money comment</div>
                      <div className="pl-[5px]" style={{fontFamily: "Work Sans"}} dangerouslySetInnerHTML={{ __html: activeReq ? activeReq.value_for_money_comment : "" }}></div>
                    </div>
                  </div>
                  </div>
                  </>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
