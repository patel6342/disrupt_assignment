import React, {
  useState,
  useEffect,
  lazy,
  Suspense,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useParams } from "react-router-dom";
import "./challengeDetailPage.css";
import { useLocation } from "react-router-dom";
import { getResponseById } from "../redux/response.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getScenarioById } from "../redux/scenario.jsx";
import { getParticipantById, getScoresByParticipantId } from "../redux/participant.jsx";
import { getChallengeById, clearChallengeState } from "../redux/challenge.jsx";
import { submitScore, clearJudgeState } from "../redux/judge.jsx";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../routes/AuthContext";
import { useNavigate } from "react-router-dom";
import { IdleTimerProvider } from 'react-idle-timer';

import { useDebounce } from "@uidotdev/usehooks";
import isEqual from 'lodash/isEqual';
import isEqualWith from 'lodash/isEqualWith';
import useNavigationPrompt from "../Modal/NavigationPrompt/NavigationPrompt.js";
const ChallengeDetailMenu = lazy(() => import("../Menu/ChallengeDetailMenu"));
const Requirements = lazy(() =>
  import("../components/Requirements/Requirements")
);
const JudgeDemand = lazy(() =>
  import("../components/JudgeDemand/judgeDemand.jsx")
);
const Footer = lazy(() => import("../components/Footer/Footer"));

import ComponentLoader from "../components/ComponentLoader/ComponentLoader.jsx";
import SimplePopup from "../Modal/simpleModal/simpleModal.jsx";
import { data } from "autoprefixer";

const JudgingPage = () => {
  const { challengeId, scenarioId, participantId } = useParams();

  const {
    submitJudgeData,
    isJudgeDataError,
    isJudgeDataSuccess,
    judgeErrorMessage,
    judgeSuccessMessage,
    formSubmittedSuccessfully,
    isJudgeDataFetching,

  } = useSelector((state) => state.judgeSlice);
  const { isLoggedIn, role, checkAuthToken, username, userId } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    checkAuthToken();
  }, [checkAuthToken]);

  const { scenarioById, isScenarioSliceByIdFetching } = useSelector(
    (state) => state.scenarioSlice
  );
  
  const { participantById} = useSelector(
    (state) => state.participantSlice
  );

  // const { participantById, isParticipantSliceFetching} = useSelector(
  //   (state) => state.participantSlice
  // );

  const { challengeById } = useSelector((state) => state.challengeSlice);
  const { responseById, isResponseFetching } = useSelector(
    (state) => state.responseSlice
  );
  const [isDirty, setIsDirty] = useState(false);
  const [f_back, setF_Back] = useState(false);
  
  useNavigationPrompt('You have unsaved changes. Are you sure you want to leave?', isDirty);

  const [activeTab, setActiveTab] = useState(1);
  const [challengeDetails, setChallengeDetails] = useState({});
  const [scenarioDetails, setScenarioDetails] = useState({});
  const [participantDetails, setParticipantDetails] = useState();
  const [progress, setProgress] = useState(0);
  const [totalDemands, setTotalDemands] = useState(2);
  const [completedDemands, setCompletedDemands] = useState(0)
  const [isOpen, setIsOpen] = useState(true);
  const [demandTab, setDemandTab] = useState();
  const idleTimerRef = useRef(null);
  const location = useLocation();
  const [callGetApi, setCallGetApi] = useState(false);
  const [judgeSaveMsg, setJudgeSaveMsg] = useState(false);
  const [initialJudgeData, setInitialJudgeData] = useState([]);
  // const [initialJudgeData, setInitialJudgeData] = useState({
  //   scores: [],
  // });
  const [judgeData, setJudgeData] = useState({
    scores: [],
  });
  const [submissionModal, setSubmissionModal] = useState(false);
  

  const[changedState, setChangedState] = useState({
    score:[],
    comment:[]
  })
  const [sectionKey, setSectionkey] = useState("complexity");




  /**
   * Here is the tabchange event handler.
   * we do not send the submit score when the tab changed
   * to implement this functionality I insert the flag state for the monitoring the change of the tab
   * and when the change event starts the flag state will be initiate with false.
   * and if the tab chaged then the state will be true.
   * and just before the sending the submit score we have to check the flag state
   * 
   */

  const [tabChanged, setTabChanged] =  useState(true);

  /*
  Here is the useDebounce hook
  and this is for the end triger of the changing
  */

  const debounceFlag = useDebounce(changedState, 4000);
  // useEffect(() => {
  //   if(changedState !== null) {  //     setTabFlagConfirm(tabflag);
  //   }
  //   console.log("tabflag2", tabflagconfirm);
  // })

  /**
   * 
   * Event Triger when the user stop the typing or clicking
   * 
   */
  useEffect(() => {
    // console.log("changedstate", changedState);
    // if(tabChanged)
    //   {
    //     // console.log("BIKIR@","INIT") 
    //     setChangedState({
    //       score:[],
    //       comment:[]
    //     })
    //   }
    // else if (changedState.score.length > 0 || changedState.comment.length > 0) {
    //   handleSubmitScores(true);
    // }

    if (changedState.score.length > 0 || changedState.comment.length > 0) {
      handleSubmitScores(true); }
    
    setChangedState({
      score:[],
      comment:[]
    })
    setTabChanged(false)

  }, [debounceFlag], [participantId], [scenarioId], [location])

  useEffect(()=>{
    setInitialJudgeData([])
  }, [location])
  useEffect(() => {
    setJudgeData({
      scores: []
    })

  }, [location])



  const handleJudgeFinalSubmission = async () => {
    const payload = {
      judge_id: userId,
      participant_id: Number(participantId),
      scenario_id: Number(scenarioId)
    }
    try {
      const response = await fetch("/api/judge/judging_completion", {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      })
      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Submission successful!");
      } else {
        throw new Error(data.message || "Submission failed");
      }
      setTimeout(() => {
        navigate(-1);
      }, 3000)
    } catch (error) {
      console.log(error);
      toast.error(error.data.message)
    }
  }

  let headers
  headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': true
    // Authorization: `Bearer ${token}`,
  };



  const handleDemandTab = useCallback((id) => {
    setDemandTab(id);
  }, []);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);


  useEffect(() => {
    if (scenarioById) {
      setScenarioDetails(scenarioById);
    }
  }, [scenarioById]);
//set names
  useEffect(()=>{
    if(responseById){
      setChallengeDetails(responseById.challenge_name);
    }
  }, [responseById])

  // useEffect(() => {
  //   if(responseById){
  //     setScenarioDetails(responseById.scenario_name)
  //   }
  // }, [responseById])

  useEffect(() => {
    if(responseById){
      console.log("responsebyid", responseById)
      setParticipantDetails(responseById.participant_name)
    }
  }, [responseById])
  

  const height = 50;
  // + challengeDetails.scenario.length * 90;

  useEffect(() => {

    if (participantId && scenarioId) {
      dispatch(getResponseById({ participantId, scenarioId }));
    }
  }, [participantId, scenarioId, callGetApi]);

  const extractScoresData = (responseById) => {
    const extractedData = [];

    // Extracting from scores array
    responseById?.scores?.forEach((score) => {
      score.demands.forEach((demand) => {
        extractedData.push({
          response_id: demand.response_id,
          demand_comment: demand.demand_comment,
          ...demand.scores,
        });
      });
    });

    // Extracting summary_scores
    if (responseById?.summary_scores?.response_id) {
      extractedData.push({
        response_id: responseById.summary_scores.response_id,
        demand_comment: responseById.summary_comment,
        ...responseById.summary_scores.scores,
      });

      
    }

    // Extracting concept_of_operation_scores
    if (responseById?.concept_of_operation_scores?.response_id) {
      extractedData.push({
        response_id: responseById.concept_of_operation_scores.response_id,
        demand_comment: responseById.concept_of_operation_comment,
        ...responseById.concept_of_operation_scores.scores,
      });
    }
    // console.log("extractdemand", extractedData);

    return extractedData;
  };

  useEffect(() => {
    // if (responseById) {
    //   initJudgeDemand()
    // }
    const extractedData = extractScoresData(responseById);
    // console.log("extract", extractedData)
    if(extractedData){
      setInitialJudgeData([...extractedData]);
      setJudgeData({ scores: extractedData });  
    }
    
  }, [responseById])


  useEffect(()=>{
    console.log("judgedatainitial", initialJudgeData);
    console.log("judgedata", judgeData);
  })

  useEffect(() => {
    if (scenarioId) {
      dispatch(getScenarioById(scenarioId));
    } 
  }, [scenarioId]);

  const requiredScoreFields = [
    "originality",
    "feasibility",
    "consistency",
    "efficiency",
    "value_for_money",
    "security"
  ];

  /**
   * this is for the initialise the judge Demand pad
   */

  const initJudgeDemand = () => {

    const extractedData = extractScoresData(responseById);
    console.log("extract", extractedData)
    setInitialJudgeData(extractedData);
    setJudgeData({ scores: extractedData });
    
  }



  const customCompare = (value, other) => {
    if (
      (value === null || value === undefined || value === "") &&
      (other === null || other === undefined || other === "")
    ) {
      return true; // Treat null, undefined, and "" as equal
    }

  };


  const findChangedResponses = (initialJudgeData, judgeData) => {

    if (initialJudgeData.length === 0 || judgeData.length === 0) {
      return [];
    }
    
    const filteredScores = judgeData.filter((response) => {
      // console.log("res", response);
      // Find the corresponding object in initialJudgeData by response_id
      const correspondingResponse = initialJudgeData.find(
        (item) => item.response_id === response.response_id
      );
      return !isEqualWith(correspondingResponse, response, customCompare);
    });

    console.log("filter", filteredScores);

    if(filteredScores.length <= 0)
      return[]
    // Create a deep copy of filteredScores to avoid modifying the original judgeData.scores
    const deepCopyFilteredScores = JSON.parse(JSON.stringify(filteredScores));
    let resultobj = { "response_id": filteredScores[0].response_id };

    // console.log("BIKIR@", filteredScores)
    changedState.score.forEach((item, index) => {
      if (item.length > 0) {
        resultobj = { ...resultobj, [item.toLowerCase()]: deepCopyFilteredScores[0][item.toLowerCase()], }
      }
    });
 
    changedState.comment.forEach((item, index) => {
      if (item.length > 0) {
        resultobj = { ...resultobj, [item]: deepCopyFilteredScores[0][item], }
      }
    });
    // console.log("BIKIR@", resultobj);

    const resultarr = [];
    resultarr.push(resultobj);
    // console.log("BIKIR@",resultarr)
    return resultarr
  };


  const handleSubmitScores = ((autoSave = false) => {

    setIsDirty(false);
    const answerIds = [
      responseById.summary_scores?.response_id && responseById.summary_scores?.response_id,
      responseById.concept_of_operation_scores?.response_id && responseById.concept_of_operation_scores?.response_id,
      ...responseById.scores.flatMap(req =>
        req.demands.map(demand => demand.response_id)
      )
    ];

    const requiredCommentFields = [
      "originality_comment",
      "feasibility_comment",
      "consistency_comment",
      "efficiency_comment",
      "value_for_money_comment",
      "security_comment",
      "demand_comment"
    ];


    const transformedJudgeData = {
      ...judgeData,
      scores: judgeData.scores.filter((_, index) => index !== 0 || answerIds.includes(judgeData.scores[0].response_id))
        .map((score) => {
          const transformedScore = { ...score };

          // Transform the keys that include "value for money_comment"
          Object.keys(transformedScore).forEach((key) => {
            if (key.includes("value for money_comment")) {
              const newKey = key.replace("value for money_comment", "value_for_money_comment");
              transformedScore[newKey] = transformedScore[key];
              delete transformedScore[key];
            }
          });

          // console.log("extractjudged", transformedScore);

          return transformedScore;
        })
    };

    console.log("datakinitial", initialJudgeData);
    console.log("dataktransformed", transformedJudgeData);

    const changedResponses = findChangedResponses(initialJudgeData, transformedJudgeData.scores);


    console.log("jjrjudge", changedResponses)
    changedResponses.forEach((response) => {
      Object.keys(response).forEach((key) => {
        if (response[key] === undefined || response[key] === null || response[key] === "") {
          delete response[key];  // Delete the key if value is null, undefined, or empty string
        }
      });
    });
    if (autoSave) {
      if (changedResponses.length > 0) {
        dispatch(submitScore({ data:{scores: changedResponses}, tab:sectionKey })).then(() => {
          setJudgeSaveMsg(true);
          setTimeout(() => {setJudgeSaveMsg(false)},3000)
          // setCallGetApi((prev) => !prev);
        }).catch((error) => {
          console.log(error.data);
        })
      }
    }
    else {
      if (changedResponses.length > 0) {
        dispatch(submitScore({ scores: changedResponses })).then(() => {
          handleJudgeFinalSubmission();
        }).catch((error) => {
          console.log(error.data);
        })
      } else {
        handleJudgeFinalSubmission();
      }
    }
  });

  useEffect(() => {
    if (isJudgeDataSuccess) {

    } else if (isJudgeDataError) {
      toast.error(judgeErrorMessage);
    }

    return () => dispatch(clearJudgeState());
  }, [
    isJudgeDataError,
    isJudgeDataSuccess,
    judgeErrorMessage,
    judgeSuccessMessage,
  ]);


  const memoizedChallengeDetails = useMemo(
    () => challengeDetails,
    [challengeDetails]
  );
  const memoizedScenarioDetails = useMemo(
    () => scenarioDetails,
    [scenarioDetails]
  );
  // const memoizedParticipantDetails = useMemo(
  //   () => participantDetails, 
  //   [participantDetails]
  // )



  useEffect(() => {
    dispatch(clearJudgeState());
    return (() => {
      dispatch(clearJudgeState())
    })
  }, [])


  const onIdle = () => {

    if (role === "judge") {
      // handleSubmitScores(true);
      // setTimeout(()=>{
      //   setJudgeSaveMsg(false);
      // },3000)
    }
  };

  const handleCloseSubmissionModal = () => {
    setSubmissionModal(false);
  }

  const handleFinalJudgeSubmit = () => {
    const hasEmptyScores = judgeData.scores.some(obj =>
      Object.values(obj).some(value => value === null || value === undefined || value === "")
    );
    if (hasEmptyScores)
      setSubmissionModal(true);
    else {
      handleSubmitScores(false);
    }
  }


  return (
    <>
      <IdleTimerProvider
        ref={idleTimerRef}
        timeout={5000}
        onIdle={onIdle}
      >
        <ToastContainer />
        {submissionModal && <SimplePopup onConfirm={handleSubmitScores} onClose={handleCloseSubmissionModal} confirmTitle={"Judge completion"} confirmDesc="All empty scores and comments will be automatically filled with default values." />}
        {isResponseFetching && isScenarioSliceByIdFetching && <ComponentLoader />}
        <div
          className="mb-5 flex justify-center w-full"
          style={{ backgroundColor: "#f9f9f9" }}
        >
          <div className="flex flex-col lg:flex-row mx-6 justify-center  gap-2 w-full">
            <div
              className="flex flex-row w-0.5/12 md:flex-col gap-2 mt-4 linearbg rounded-tl-[18px] rounded-bl-[0px] shadow items-center"
              style={{ backgroundColor: "#f9f9f9", height: "50px" }}
            >
              <h5 className="text-md font-semibold p-3 text-[#909294]">S.No</h5>
            </div>

            <div className=" w-full mx-auto flex flex-col  ">
              <Suspense fallback={<ComponentLoader />}>
                <ChallengeDetailMenu
                  challengeDetails={challengeDetails}
                  scenarioDetails={scenarioDetails}
                  participantDetails={participantDetails}
                  Role={role}
                  isDirty={isDirty}
                  setProgress={setProgress}
                  progress={progress}
                  totalDemands={totalDemands}
                  setTotalDemands={setTotalDemands}
                  completedDemands={completedDemands}
                  setCompletedDemands={setCompletedDemands}
                  onSubmit={handleSubmitScores}
                  judgeSaveMsg={judgeSaveMsg}
                  setFlagBackEvent={setF_Back}
                />
              </Suspense>
              <div className=" w-full py-2" style={{ marginLeft: "1px" }}>
                <div className="grid grid-cols-12 gap-2 h-auto  overflow-hidden ">
                  <div className="col-span-12 md:col-span-5 h-auto">
                    <div
                      className="border border-gray-200 h-full rounded-lg bg-[#F9FAFF] h-full"
                      style={{
                        background:
                          "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)",
                        boxShadow: "0px 2px 12px 0px rgba(2, 82, 244, 0.09)",
                      }}
                    >
                      <h2 className="blackHeadings p-4">Requirements</h2>
                      <Suspense fallback={<ComponentLoader />}>
                        <Requirements
                          scenarioDetails={scenarioDetails}
                          setDemandTab={setDemandTab}
                          setActiveNameTab={setActiveTab}
                          activeTab={activeTab}
                          setSectionkey={setSectionkey}
                          Role={role}
                          isOpen={isOpen}
                          tabId={handleDemandTab}
                          judgeData={{ judgeData, sectionKey }}
                          demandTab={demandTab}
                          responseById={responseById}
                          progress={progress}
                          setProgress={setProgress}
                          totalDemands={totalDemands}
                          setTotalDemands={setTotalDemands}
                          completedDemands={completedDemands}
                          setCompletedDemands={setCompletedDemands}
                          setFlagTab={() => {
                            setTabChanged(true);
                          }}
                          setTabFlagIndex={() => {
                            setTabChanged(true)
                          }}
                        />
                      </Suspense>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-7 h-auto">
                    <div className="bg-[#f9faff] shadow-md h-full">
                      <div
                        className={`transition-max-height duration-300 ease-in-out overflow-hidden   "                 }`}
                      >
                        <Suspense fallback={<ComponentLoader />}>
                          <JudgeDemand
                            // tabchange
                            tabChanged={tabChanged}
                            demandTab={demandTab}
                            sectionKey={sectionKey}
                            responseById={responseById}
                            judgeData={judgeData}
                            setJudgeData={setJudgeData}
                            setInitialJudgeData={setInitialJudgeData}
                            setIsDirty={setIsDirty}
                            isDirty={isDirty}
                            fBack = {f_back}
                            setFlagBackEvent={setF_Back}
                            tabChangedState = {tabChanged}
                            setTabFlag = {
                              () => {
                                if(changedState.score.length == 0)
                                  {
                                    setTabChanged(false);
                                  }
                              }
                            }
                            setChangedScore={(category) => {
                              
                              if (category.toLowerCase() == "value for money")
                                setChangedState({...changedState, score: [...changedState.score,"value_for_money"]});
                              else setChangedState({...changedState, score: [...changedState.score,category]});
                            }}
                            setChangedComment={(commentItem) => {
                              // console.log("BIKIR@", changedState.comment.length)
                              setChangedState({...changedState, comment: [...changedState.comment,commentItem]});
                            }}
                            onSubmit={handleSubmitScores}
                          />
                        </Suspense>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Suspense fallback={<ComponentLoader />}>

                <Footer onSubmit={handleFinalJudgeSubmit} onLoading={isJudgeDataFetching} isDirty={isDirty} />
              </Suspense>
            </div>
          </div>
        </div>
      </IdleTimerProvider>
    </>
  );
};

export default JudgingPage;


