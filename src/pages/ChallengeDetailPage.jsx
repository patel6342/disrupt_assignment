import React, { useState, useEffect, lazy, Suspense, useCallback, useRef } from "react";
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import leftArrowIcon from "../assets/icons/leftArrowIcon.svg";
import Footer from "../components/Footer/Footer";

import "./challengeDetailPage.css";

import { getScenarioById, deleteScenario } from "../redux/scenario";
import { submitResponseById } from "../redux/response";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  addScenario,
  editScenario,
  clearScenarioState,
  clearScenarioById,
} from "../redux/scenario";
import { useAuth } from "../routes/AuthContext";
import ComponentLoader from "../components/ComponentLoader/ComponentLoader";
import Button from "../components/Button/Button";
import AutoResizeTextarea from "../components/AutoResizeTextArea/AutoResizeTextArea";
import useNavigationPrompt from "../Modal/NavigationPrompt/NavigationPrompt.js";
import { IdleTimerProvider } from 'react-idle-timer';
import UseNavigatorOnLine from '../components/NetworkStatus/Netwok.jsx'
const ChallengeDetailMenu = lazy(() => import("../Menu/ChallengeDetailMenu"));
const BasicDetail = lazy(() => import("../components/BasicDetail/BasicDetail"));
const Requirements = lazy(() =>
  import("../components/Requirements/Requirements")
);

const DeletePopup = lazy(() => import("../Modal/DeleteModal/DeleteModal"));
const ConfirmationPopup = lazy(() =>
  import("../Modal/ConfirmationModal/ConfirmationModal")
);

const ChallengeDetailPage = () => {
  const [isDirty, setIsDirty] = useState(false);
  const { challengeId, scenarioId } = useParams();
  const [activeTab, setActiveTab] = useState(null);
  const [challengeDetails, setChallengeDetails] = useState({});
  const [participantAnswer, setParticipantAnswer] = useState([]);
  const [initialAnswers, setInitialAnswers] = useState({ responses: [] });
  const [scenarioDetails, setScenarioDetails] = useState({
    id: scenarioId,
    name: "",
    challenge_name: "",
    background: "",
    // backgroundDescription: "",
    deliverable: "",
    // deliverableDescription: "",
    timeline: " ",
    // timelineDesc: "",
    requirements: [
      {
        // id: "1",
        type: "complexity",
        // is_enabled: false,
        description: "Usability/Complexity Description",
        demands: [],
      },
      {
        // id: "2",
        type: "science",
        // is_enabled: false,
        description: "Science Description",
        demands: [],
      },
      {
        // id: "3",
        type: "engineering",
        // is_enabled: false,
        description: "Engineering Description",
        demands: [],
      },
      {
        // id: "4",
        type: "economic",
        // is_enabled: false,
        description: "Economic Description",
        demands: [],
      },
      {
        type: "talent",
        // id: "5",
        // is_enabled: false,
        description: "Talent Description",
        demands: [],
      },
    ],
    summary: "",
    concept_of_operation: ""
  });
  const location = useLocation();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [scenarioToDelete, setScenarioToDelete] = useState(null);
  const [showDiffLayout, setShowDiffLayout] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [demandTab, setDemandTab] = useState();
  const [sectionKey, setSectionkey] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalDemands, setTotalDemands] = useState(2);
  const [completedDemands, setCompletedDemands] = useState(0)
  const [autoSaveMessage, setAutoSaveMessage] = useState(false);
  const [demandUpdate, setDemandUpdate] = useState([]);
  const [callGetApi, setCallGetApi] = useState(false);
  const [participantSaveMsg, setParticipantSaveMsg] = useState(false);
  const [scenarioDetailsPayload, setScenarioDetailsPayload] = useState();
  const idleTimerRef = useRef(null);
  const previousScenarioDetailsRef = useRef(scenarioDetails);
  const previousAnswersRef = useRef(participantAnswer);
  const previousDemandsRef = useRef(demandUpdate);
  // useNavigationPrompt('You have unsaved changes. Are you sure you want to leave?', isDirty,);

  useEffect(() => {
    previousScenarioDetailsRef.current = scenarioDetails;
  }, [scenarioDetails]);

  useEffect(() => {
    previousAnswersRef.current = participantAnswer;
  }, [participantAnswer])

  useEffect(() => {
    previousDemandsRef.current = demandUpdate;
  }, [demandUpdate]);

  const { isLoggedIn, role, checkAuthToken, userId } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    scenarioById,
    isScenarioSliceSuccess,
    isScenarioSliceFetching,
    isScenarioSliceByIdFetching,
    isScenarioSliceByIdSuccess,
    scenarioSliceErrorMessage,
    scenarioSliceSuccessMessage,
    isScenarioSliceError,
  } = useSelector((state) => state.scenarioSlice);
  const { challengeById } = useSelector((state) => state.challengeSlice);
  const { demands } = useSelector((state) => state.demandSlice);
  const [responses, setResponses] = useState([]);
  const [isAnswerFilled, setIsAnswerFilled] = useState(false);
  const [initialScenarioDetails, setInitialScenarioDetails] = useState();
  //for updating demands using their ids
  const [scenarioUpdate, setScenarioUpdate] = useState(false);



  // Participants get api starts
  let headers
  headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': true
  
  };

  const handleFinalAnswerSubmission = async () => {

    const payload = {
      scenario_id: Number(scenarioId),
 
    }

    try {
      const response = await fetch(`/api/participant/final_submission`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      })
      if (response.ok) {
        const data = await response.json(); // Convert the response to JSON
        toast.success(data.message);
        setTimeout(() => {
          navigate(-1);
        }, 2000) // Use the message from the response
      }
    } catch (error) {
      toast.error(error.data.message || "Something went wrong"); // Show error toast
      console.log(error);
    }
    setShowConfirmationModal(false);
  }

  useEffect(() => {

    const handleParticipant = async () => {
      try {
        const response = await fetch(`/api/scenarios/${scenarioId}/participants/${userId}/responses`, {
          method: "GET",
          headers,
        });
        let data = await response.json();
        if (response.status === 200) {
          console.log(data, "get each participant");
          setParticipantAnswer(data);
          setScenarioDetails((prev) => ({
            ...prev,
            summary: data.summary_response,
            concept_of_operation: data.concept_of_operation_response
          }))
          const responseData = data.requirements
            .filter((req) => req.demands.length > 0)
            .flatMap((req) => {
              return req.demands.map((demand) => ({
                scenario_id: Number(scenarioId),
                content: demand.answer,
                id: demand.answer_id,
                demand_id: demand.id,
              }));
            });
          setResponses(responseData)

          const resultArray = [];

          // Loop through the demands in the requirements and extract the relevant properties
          data.requirements.forEach((requirement) => {
            requirement.demands.forEach((demand) => {
              const demandObj = {
                demand_id: demand.id,
                content: demand.answer,
                scenario_id: Number(scenarioId),
              };

              // If the answer_id is not null, include it in the object
              if (demand.answer_id !== null) {
                demandObj.id = demand.answer_id;
              }

              resultArray.push(demandObj);
            });
          });

          // Handle summary_response (no demand_id, but we include response_type)
          if (data.summary_response.answer !== null) {
            const summaryResponseObj = {
              content: data.summary_response.answer,
              scenario_id: Number(scenarioId),
              response_type: "summary" // Include response_type for this case
            };

            if (data.summary_response.answer_id !== null) {
              summaryResponseObj.id = data.summary_response.answer_id;
            }

            resultArray.push(summaryResponseObj);
          }

          // Handle concept_of_operation_response (no demand_id, but we include response_type)
          if (data.concept_of_operation_response.answer !== null) {
            const conceptOfOperationObj = {
              content: data.concept_of_operation_response.answer,
              scenario_id: Number(scenarioId),
              response_type: "concept_of_operation" // Include response_type for this case
            };

            if (data.concept_of_operation_response.answer_id !== null) {
              conceptOfOperationObj.id = data.concept_of_operation_response.answer_id;
            }

            resultArray.push(conceptOfOperationObj);
          }
          setInitialAnswers({ responses: resultArray });
        }
      } catch (error) {
        console.log(error)
      }


    }

    if (role === "participant")
      handleParticipant();
  }, [role])
  // Participants get api ends

  useEffect(() => {
    checkAuthToken();
  }, [checkAuthToken]);


  useEffect(() => {
    console.log(scenarioId, "call use effect upon deletion");
    if (scenarioId) {
      // alert(1)
      dispatch(getScenarioById(scenarioId));
    }
  }, [scenarioId, scenarioUpdate, ]);


  useEffect(() => {
    if (scenarioDetails && role === 'game_master') {
      // checkIfDirty(scenarioDetails);
      setIsDirty(true);
      console.log("scenarioDetails", scenarioDetails);
    }
  }, [role, scenarioDetails])




  useEffect(() => {
    const checkIfDirty = (details) => {
      const haveSomething = details.length > 0 && details.some(detail => detail.content !== "");
      if (haveSomething) {
        setIsDirty(true);
      } else {
        setIsDirty(false);
      }
    };

    if (responses && role === 'participant') {
      checkIfDirty(responses);
      console.log("responses", responses, isDirty, scenarioDetails);
    }
  }, [role, responses]);

  useEffect(() => {
    console.log("isDirty", isDirty)
  }, [isDirty])

  useEffect(() => {
    if (scenarioById && scenarioById.requirements) {
      // Flatten and map the demand IDs from scenarioById
      const allDemandIds = scenarioById.requirements.flatMap((req) => {
        if (req.demands && req.demands.length > 0) {
          return req.demands.map((demand) => {
            console.log(demand.id, "demand ids");
            return demand.id;
          });
        }
        return []; // Ensure we return an empty array if no demands
      });

      console.log(allDemandIds, "all demand IDs");

      // Set the state with the demand IDs if they exist
      setDemandUpdate(allDemandIds);
    }
  }, [scenarioById]);

  useEffect(() => {
    if (scenarioById) {

      setDemandUpdate(() => {
        const allDemandIds = scenarioById?.requirements?.flatMap((req) => req.demands.map((demand) => { console.log(demand.id, "demand ids"); return demand.id })) || []; // Flatten and map the demand IDs

        return allDemandIds;
      });

      setScenarioDetails((prevDetails) => {

        const existingRequirementsMap = new Map(
          prevDetails.requirements.map((req) => [req.type, req])
        );

        const updatedRequirements =
          scenarioById.requirements?.reduce((acc, req) => {
            if (existingRequirementsMap.has(req.type)) {
              acc.push({
                ...existingRequirementsMap.get(req.type),
                ...req,
              });
            } else {
              acc.push(req);
            }
            return acc;
          }, []) || [];

        const finalRequirements = prevDetails.requirements
          .filter(
            (req) => !updatedRequirements.some((uReq) => uReq.type === req.type)
          )
          .concat(updatedRequirements);

        const updatedFinalRequirements = finalRequirements.map((requirement) => {
          if (requirement.demands.length > 0) {
            return {
              ...requirement,
              demands: requirement.demands.map((demand) => {

                return { ...demand, action: "update" };
              }),
            };
          }
          return requirement;
        });

        console.log(updatedFinalRequirements, "final requirements with action");
        return {
          ...prevDetails,
          ...scenarioById,
          requirements: finalRequirements,

        };
      });
      const { challenge_id, ...updatedScenario } = scenarioById;
      setInitialScenarioDetails(updatedScenario);
    } else {
      setScenarioDetails([])
    }
  }, [scenarioById]);


  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
    const newScenario = challengeDetails.scenario[tabIndex - 1];
    setScenarioDetails(newScenario);
  };


  const handleUpdate = (updatedDetails) => {
    setScenarioDetails((prevDetails) => ({
      ...prevDetails,
      ...updatedDetails,
    }));
  };

  const handleRequirmentUpdate = (updatedRequirement) => {
    console.log("updated Requirement while submission", updatedRequirement);
    setScenarioDetails((prev) => ({
      ...prev,
      requirements: prev.requirements.map((req) =>
        req.id === updatedRequirement.id ? { ...updatedRequirement } : { req }
      ),
    }));
  };

  // function to filter the scenario payload
  const extractChanges = (payload, apiResponse) => {
    if (!payload || !apiResponse) return {};
    let changes = {};
    console.log("payload sent", payload, "api response sent", apiResponse);
    // Compare root-level properties (ignoring objects like requirements) using lodash's isEqual
    Object.keys(payload).forEach((key) => {
      if (typeof payload[key] !== 'object' && !isEqual(payload[key], apiResponse[key])) {
        changes[key] = payload[key];
      }
    });

    // Compare requirements using lodash's isEqual
    if (payload.requirements && apiResponse.requirements) {
      const requirementChanges = payload.requirements.map((reqPayload) => {
        const apiReq = apiResponse.requirements.find((req) => req.id === reqPayload.id);
        if (!apiReq) return reqPayload; // Include if the requirement doesn't exist in the API response

        let reqChanges = {};
        let reqChanged = false;

        // Compare non-demand fields in the requirement (ignore 'demands' only)
        Object.keys(reqPayload).forEach((key) => {
          if (key !== 'demands' && !isEqual(reqPayload[key], apiReq[key])) {
            reqChanges[key] = reqPayload[key];
            reqChanged = true;
          }
        });

        // Compare demands inside the requirement, ignoring 'action' key
        const demandChanges = reqPayload.demands.map((demandPayload) => {
          const apiDemand = apiReq.demands.find((d) => d.id === demandPayload.id);
          let demandChange = {};
          let demandChanged = false;

          // If demand exists in API response, mark as 'update', otherwise 'create'
          const action = apiDemand ? 'update' : 'create';

          // Compare fields in demand (ignore 'action')
          Object.keys(demandPayload).forEach((key) => {
            if (key !== 'action' && !isEqual(demandPayload[key], apiDemand?.[key])) {
              demandChange[key] = demandPayload[key];
              demandChanged = true;
            }
          });

          // Return demand with action if it has changed
          return demandChanged ? { id: demandPayload.id, ...demandChange, action } : null;
        }).filter(d => d !== null); // Remove null entries if no change

        if (demandChanges.length > 0) {
          reqChanges.demands = demandChanges;
          reqChanged = true;
        }

        // Return the entire requirement object only if there are changes
        return reqChanged ? { id: reqPayload.id, ...reqChanges } : null;
      }).filter(r => r !== null); // Remove null entries if no change

      if (requirementChanges.length > 0) {
        changes.requirements = requirementChanges;
      }
    }

    if (changes.requirements) {
      // Filter out requirements with empty demands
      changes.requirements = changes.requirements.filter((req) => req.demands && req.demands.length > 0);

      // If the requirements array is empty after filtering, remove the key
      if (changes.requirements.length === 0) {
        delete changes.requirements;
      }
    }

    console.log("changes object from ext", changes);
    // If no changes were detected, return an empty object
    const filteredScenario = isEmpty(changes) ? {} : changes;
    setScenarioDetailsPayload(filteredScenario);
    return filteredScenario;
  };

  // function to filter the scenario payload


  const handleSubmitAllDetails = (autoSave = false) => {
    const previousScenarioDetails = previousScenarioDetailsRef.current;
    const previousDemands = previousDemandsRef.current;

    let hasErrors = false;
    console.log(demandUpdate, "updated demand array");
    console.log("submitteddeetils", scenarioDetails)
    console.log("autosave functionality", autoSave);
    if (!autoSave) {
      if (!previousScenarioDetails.background) {
        toast.error('Background is required.');
        hasErrors = true;
        return false;
      }

      if (!previousScenarioDetails.deliverable) {
        toast.error('Deliverable is required.');
        hasErrors = true;
        return false;
      }

      if (!previousScenarioDetails.timeline) {
        toast.error('Timeline is required.');
        hasErrors = true;
        return false;
      }
    }
    const filteredRequirements = previousScenarioDetails?.requirements
      ?.filter((requirement) => requirement.demands?.length > 0)
      // ?.filter((requirement) => requirement)
      .map(({ is_enabled, ...requirement }) => {
        const validDemands = requirement?.demands && requirement.demands?.length > 0 ? requirement.demands.filter((demand) => {

          if (!autoSave && demand.text && (!demand.constraints || demand.constraints.length === 0)) {
            toast.error('Constraints are required for each demand that has text');
            hasErrors = true;
            return false;
          }
          if (!autoSave && demand.id && (!demand.constraints || demand.constraints.length === 0 || !demand.text)) {
            toast.error('Each demand should have Demand Name and Constraints');
            hasErrors = true;
            return false;
          }

          if (!autoSave && demand.constraints && (!demand.text)) {
            toast.error('Each demand should have Demand Name ');
            hasErrors = true;
            return false;
          }
          return demand.constraints && demand.constraints.length > 0;

        }) : [];
        const { description, ...requirementWithoutDesc } = requirement
        return {
          ...requirementWithoutDesc,
          demands: validDemands?.length > 0 ? validDemands.map((demand) => {
            // Convert demand.id to a number
            const idAsNumber = Number(demand.id);

            // Check if it's a UUID (if converting to a number results in NaN) or a normal number
            const isUUID = idAsNumber > Number.MAX_SAFE_INTEGER;

            // Log the condition and the id
            console.log(idAsNumber, "check id", isUUID);
            console.log(isUUID ? "UUID detected, setting action to create" : "Number detected, setting action to update");
            const { id, ...demandWithoutId } = demand;
            return {
              ...(isUUID ? demandWithoutId : demand),
              action: isUUID ? "create" : "update"  // Set action based on whether it’s a UUID or number
            };
          }) : []
        };
      })
      .filter((requirement) => requirement.demands.length > 0);

    const allConstraintsMet = filteredRequirements?.every((requirement) =>
      requirement?.demands?.length > 0
        ? requirement?.demands?.every(
          (demand) => demand?.constraints && demand?.constraints?.length > 0
        )
        : true
    );

    if (!allConstraintsMet && !autoSave) {
      toast.error("Please ensure all demands have valid constraints.");
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }



    const { challenge_name, concept_of_operation, summary, challenge_id, ...scenarioWithoutChallengeName } = previousScenarioDetails;
    console.log(scenarioDetails, "summary in challengeDetails");
    console.log(filteredRequirements, "scenario w/o challenge name");

    const scenarioPayload = extractChanges({
      ...scenarioWithoutChallengeName,
      requirements: filteredRequirements,
    }, initialScenarioDetails)
    console.log(scenarioPayload,"scenario payload");
    if (autoSave) {
      if (Object.keys(scenarioPayload).length > 1) {
        dispatch(
          editScenario({
            ...scenarioPayload,
            autoSave,
          })
        )
        .unwrap()
        .then((response) => {
          console.log(response, "api submission call");
          // setScenarioDetails(response);
          setAutoSaveMessage(true);
            setCallGetApi((prev) => !prev);
            setIsDirty(false);
           
            // !autoSave && setTimeout(() => {
            //   navigate(-1);
            // }, 1000);
          })
          .catch((error) => {
            console.error("Failed to edit scenario:", error);
          });
      }
      else return;
    } else {

      dispatch(
        editScenario({
          ...scenarioPayload,
          autoSave,
        })
      )
        .unwrap()
        .then((response) => {
          console.log(response, "api submission call");
          setIsDirty(false);
          setCallGetApi((prev) => !prev);
        })
        .catch((error) => {
          console.error("Failed to edit scenario:", error);
        });
    }
  };



  useEffect(() => {
    return () => {
      if (role === "game_master")
        handleSubmitAllDetails(true);
    }
  }, [])

  const handleAddScenarioClick = () => {
    const newScenarioName = `New Scenario `;

    const newScenario = {
      name: newScenarioName,

      challenge_id: challengeId,
      background: "",
      backgroundDescription: "",
      deliverable: "",

      timeline: "",

      requirements: [],
    };
    dispatch(addScenario(newScenario))
      .unwrap()
      .then(() => {
        setTimeout(() => {
          navigate(-1);
        }, 1000);
      });
  };

  const handleDelScenerio = () => {
    setScenarioToDelete(scenarioId);
    setShowDeletePopup(true);
  };

  const confirmDeleteScenario = (scenarioId) => {
    dispatch(deleteScenario(scenarioId))
      .unwrap()
      .then(() => {

        setTimeout(() => {
          navigate(-1);
        }, 1000);
      })
      .catch((error) => {

        console.error("Failed to del scenario response:", error);
      });
    setShowDeletePopup(false);
  };



  const handleConfirmSubmitAnswers = (autoSave = false) => {

    if (autoSave && ((scenarioDetails.summary?.answer?.trim() === "" || scenarioDetails.summary?.answer?.trim() === undefined || scenarioDetails.summary?.answer?.trim() === null) || (scenarioDetails.concept_of_operation?.answer?.trim() === "" || scenarioDetails.concept_of_operation?.answer?.trim() === undefined || scenarioDetails.concept_of_operation?.answer?.trim() === null))) {
      return;
    } else if (((scenarioDetails.summary?.answer?.trim() === "" || scenarioDetails.summary?.answer?.trim() === undefined || scenarioDetails.summary?.answer?.trim() === null) || (scenarioDetails.concept_of_operation?.answer?.trim() === "" || scenarioDetails.concept_of_operation?.answer?.trim() === undefined || scenarioDetails.concept_of_operation?.answer?.trim() === null))) {
      toast.error("Please fill in summary and concept of operation fields before submitting.");
      return;
    }

    const dataToSubmit = {
      responses: [
        ...responses
          .filter((response) => response.content && response.content.trim()) // Filter out objects with empty or null content
          .map((response) => {
            // Destructure response to exclude 'response_type' and 'id' if they are null
            const { response_type, id, scenario_id, ...rest } = response;
            return {
              ...rest,
              ...(response_type ? { response_type } : {}), // Include response_type only if it's not null
              ...(id ? { id } : {}), // Include id only if it's not null
              scenario_id: Number(scenario_id), // Convert scenario_id to number
            };
          }),
        ...[
          {
            id: scenarioDetails.summary?.answer_id,
            scenario_id: scenarioId,
            content: scenarioDetails.summary?.answer?.trim(),
            response_type: "summary"
          },
          {
            id: scenarioDetails.concept_of_operation?.answer_id,
            scenario_id: scenarioId,
            content: scenarioDetails.concept_of_operation?.answer?.trim(),
            response_type: "concept_of_operation"
          }
        ]
          .filter((response) => response.content && response.content.trim()) // Filter out new objects with null or empty content
          .map((response) => {
            // Destructure response to exclude 'response_type' and 'id' if they are null
            const { response_type, id, scenario_id, ...rest } = response;
            return {
              ...rest,
              ...(response_type ? { response_type } : {}), // Include response_type only if it's not null
              ...(id ? { id } : {}), // Include id only if it's not null
              scenario_id: Number(scenario_id), // Convert scenario_id to number
            };
          })
      ]
    };

    const changedResponses = dataToSubmit.responses.filter((response) => {
      // Determine the comparison key
      // const comparisonKey = response.demand_id ? 'demand_id' : 'response_type';

      // Try to find the corresponding object in the initial state by `demand_id` or `response_type`
      const initialResponse = initialAnswers.responses.find((initResp) => {
        if (response.demand_id) {
          // Compare using demand_id
          return initResp.demand_id === response.demand_id;
        } else if (response.response_type) {
          // Compare using response_type
          return initResp.response_type === response.response_type;
        }
        return false; // No match if neither key is present
      });

      // If no matching object is found, include it (new object)
      if (!initialResponse) {
        return true;
      }
      console.log(response, "response obj", initialResponse, "initial res in ans", isEqual(response, initialResponse))

      // If the object exists in both and is different, include it (changed object)
      return !isEqual(response, initialResponse);
    });

    // The result will contain only the new or changed objects, or an empty array if no changes/new objects
    const result = changedResponses.length > 0 ? changedResponses : [];

    console.log(result,"changed participant"); // This will log the new/changed objects or an empty array if none are found



    // Result will contain only the responses that have changes
    const particpantPayload = {
      responses: result
    };

    console.log(dataToSubmit, "data to submit", particpantPayload, "changed response of participant");

    if (particpantPayload.responses.length > 0) {
      dispatch(submitResponseById(particpantPayload))
      .unwrap()
      .then(() => {
        setParticipantSaveMsg(true);
          setInitialAnswers(dataToSubmit);
          if(!autoSave)
            handleFinalAnswerSubmission();
        })
        .catch((error) => {
          
          console.error("Failed to submit response:", error);
        });
    }else if(!autoSave){
      handleFinalAnswerSubmission();
    }

  };

  const AsynchandleConfirmSubmitAnswers =   (flag) => {
    return new Promise((resolve, reject) =>{
      handleConfirmSubmitAnswers(flag);
    })
  }
  const AsynchandleSubmitAllDetails = (flag) => {
    return new Promise((resolve, reject) => {
      handleSubmitAllDetails(flag);
      resolve();
    });
  }
  

  useEffect(() => {
    console.log(initialAnswers, "this is initial answers");
  }, [initialAnswers])

  const handleAnswerAutoUpdate = () => {
    const autoSaveData = {
      ...participantAnswer,
      summary_response: { ...participantAnswer.summary_response, answer: scenarioDetails.summary.trim(), action: "update" },
      concept_of_operation_response: { ...participantAnswer.concept_of_operation_response, answer: scenarioDetails.concept_of_operation.trim(), action: "update" }
    }
    dispatch(
      editScenario({ ...autoSaveData, id: scenarioId })
    )
      .unwrap()
      .then(() => {
        setIsDirty(false);
      })
      .catch((error) => {
        console.error("Failed to edit answers:", error);
      });
  }

  const handleSubmitAnswers = () => {
    setShowConfirmationModal(true);
  };

  const handleDemandTab = ((id) => {
    setDemandTab(id);
  });

  const handleChange = (
    // (answer, demand_id, sectionKey) => {
    (answer, demand_id) => {
      setResponses((prevResponses) => {
        const existingResponseIndex = prevResponses?.findIndex(
          (response) => response.demand_id === demand_id
        );

        if (existingResponseIndex > -1) {
          console.log(prevResponses, "re");
          const updatedResponses = [...prevResponses];
          updatedResponses[existingResponseIndex] = {
            ...updatedResponses[existingResponseIndex],
            content: answer,
            scenario_id: scenarioId,
            // response_type: sectionKey,
          };

          return updatedResponses;
        } else {
          console.log(prevResponses, "resoponses in handle else");
          return [
            ...prevResponses,
            {
              scenario_id: scenarioId,
              content: answer,
              demand_id: demand_id,
              // response_type: sectionKey,
            },
          ];
        }
      });
    }

  );



  useEffect(() => {
    if (isScenarioSliceSuccess) {
      toast.success(scenarioSliceSuccessMessage);
    } else if (isScenarioSliceError) {
      toast.error(scenarioSliceErrorMessage);
    }

    return () => {
      dispatch(clearScenarioState());
      dispatch(clearScenarioById());
    };
  }, [
    isScenarioSliceError,
    isScenarioSliceSuccess,
    scenarioSliceErrorMessage,
    scenarioSliceSuccessMessage,
    autoSaveMessage,
  ]);

  const basicDetailButton = () => {
    setShowDiffLayout((prevState) => !prevState);
  };

  const constraintsArray = Array.isArray(demandTab?.constraints)
    ? demandTab.constraints
    : [];

  const [response, setResponse] = useState('');

  useEffect(() => {
    if (demandTab) {

      const foundResponse = responses?.find((resp) => resp.demand_id === demandTab.id);


      setResponse(foundResponse ? foundResponse.content : "");
    }
  }, [demandTab, responses]);

  const onIdle = () => {
    console.log("calling idle function");
    if (role === "game_master") {
      handleSubmitAllDetails(true);
      setTimeout(() => {
        setAutoSaveMessage(false);
      }, 3000);
    } else if (role === "participant") {
      handleConfirmSubmitAnswers(true);
      setTimeout(() => {
        setParticipantSaveMsg(false);
      }, 3000);
    }
  };
  return (
    <>
      <IdleTimerProvider
        ref={idleTimerRef}
        timeout={3000}
        onIdle={onIdle}
      >
        {/* {isScenarioSliceByIdFetching && <ComponentLoader />} */}
        <ToastContainer />
        <div
          className="mb-5 flex justify-center w-full"
          style={{ backgroundColor: "#f9f9f9" }}
        >
          {showDeletePopup && (
            <Suspense fallback={<ComponentLoader />}>
              <DeletePopup
                title="Scenario"
                item={{ "S No.": scenarioToDelete }}
                onClose={() => setShowDeletePopup(false)}
                onDelete={confirmDeleteScenario}
                delTitle="Are you sure you want to delete this scenario?"
              />
            </Suspense>
          )}
          {showConfirmationModal && (
            <Suspense fallback={<ComponentLoader />}>
              <ConfirmationPopup
                confirmTitle="Confirm Submission"
                confirmDesc="Are you sure you want to submit your answer? Once the Answers are submitted, can't be edited, missing answers will be filled with defaults"
                item={{ "S No.": "1" }}
                onClose={() => setShowConfirmationModal(false)}
                // onConfirm={handl}
                onSubmit={handleConfirmSubmitAnswers}
                participantFinalSubmit={true}
              />
            </Suspense>
          )}
          <div className="flex flex-col lg:flex-row mx-6 justify-center  gap-2 w-full">
            <div
              className="flex flex-row w-0.5/12 md:flex-col gap-2 mt-4 linearbg rounded-tl-[18px] rounded-bl-[0px] shadow items-center"
              style={{ backgroundColor: "#f9f9f9", height: "50px" }}
            >
              <h5 className="text-md font-semibold p-3 text-[#909294]">S.No</h5>
              {role === "game_master" && (
                <button
                  className="flex items-center bg-white w-full justify-center text-[#4C6EF5] py-1 px-2 rounded border-2 border-[#909294]-200 text-xs "
                  onClick={handleAddScenarioClick}
                >
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="#4C6EF5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 5.25v13.5"></path>
                    <path d="M18.75 12H5.25"></path>
                  </svg>
                </button>
              )}
            </div>

            <div className=" w-full mx-auto flex flex-col   ">
              <Suspense fallback={<ComponentLoader />}>
                <ChallengeDetailMenu
                  // challengeDetails={challengeDetails}
                  setProgress={setProgress}
                  progress={progress}
                  totalDemands={totalDemands}
                  setTotalDemands={setTotalDemands}
                  completedDemands={completedDemands}
                  setCompletedDemands={setCompletedDemands}
                  scenarioDetails={scenarioDetails}
                  Role={role}
                  isDirty={isDirty}
                  handleDelScenerio={handleDelScenerio}
                  onSubmit={role === "game_master"
                    ? async (flag) => {
                      await AsynchandleSubmitAllDetails(flag);
                      console.log("BIKIR@","NOW")
                      navigate(-1);

                    }
                    : async (flag) => {
                      await AsynchandleConfirmSubmitAnswers(flag);
                    } }
                  showSavedMessage={autoSaveMessage}
                  participantSaveMsg={participantSaveMsg}
                />
              </Suspense>
              <div className="w-full py-2  h-auto" style={{ marginLeft: "1px" }}>
                {role === "participant" ? (
                  !showDiffLayout ? (
                    <div className="grid grid-cols-12 gap-2 h-auto overflow-hidden">
                      <div className="col-span-12 md:col-span-5 h-auto">
                        <div
                          className="border border-gray-200 rounded-lg p-4 h-full"
                          style={{
                            background:
                              "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)",
                            boxShadow: "0px 2px 12px 0px rgba(2, 82, 244, 0.09)",
                          }}
                        >
                          <div className="flex flex-row justify-between">
                            <h2 className="blackHeadings pb-3">Basic Details</h2>

                            {role === "participant" ? (
                              <button
                                className="text-gray-500 text-sm border border-gray-300 px-2 py-2 shadow-lg rounded-md hover:text-gray-700 hover:border-gray-400"
                                onClick={basicDetailButton}
                              >
                                <img
                                  src={leftArrowIcon}
                                  alt="Back"
                                  loading="lazy"
                                  className="w-3 h-4"
                                />
                              </button>
                            ) : (
                              " "
                            )}
                          </div>
                          <Suspense fallback={<ComponentLoader />}>
                            <BasicDetail
                              scenarioDetails={scenarioDetails}
                              setScenarioDetails={setScenarioDetails}
                              onUpdate={handleUpdate}
                              Role={role}
                            />
                          </Suspense>
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-7 h-auto ">
                        <div
                          className="border border-gray-200 rounded-lg h-full"
                          style={{
                            background:
                              "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)",
                            boxShadow: "0px 2px 12px 0px rgba(2, 82, 244, 0.09)",
                          }}
                        >
                          <h2 className="blackHeadings p-4">Requirements</h2>
                          <Suspense fallback={<ComponentLoader />}>
                            <Requirements
                              key={scenarioId}
                              id={scenarioId}
                              scenarioDetails={scenarioDetails}
                              setScenarioDetails={setScenarioDetails}
                              requirementUpdate={handleRequirmentUpdate}
                              Role={role}
                              responses={responses}
                              setResponses={setResponses}
                              progress={progress}
                              setProgress={setProgress}
                              totalDemands={totalDemands}
                              setTotalDemands={setTotalDemands}
                              completedDemands={completedDemands}
                              setCompletedDemands={setCompletedDemands}
                              setScenarioUpdate={setScenarioUpdate}
                              scenarioUpdate={scenarioUpdate}
                              demandUpdateIds={demandUpdate}
                              participantAnswer={participantAnswer}
                              setParticipantAnswer={setParticipantAnswer}
                            />
                          </Suspense>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )
                ) : (
                  <>
                    {" "}
                    <div className="grid grid-cols-12 gap-2 overflow-hidden">
                      <div className="col-span-12 md:col-span-5 h-auto">
                        <div
                          className="border border-gray-200 rounded-lg p-4 h-full"
                          style={{
                            background:
                              "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)",
                            boxShadow: "0px 2px 12px 0px rgba(2, 82, 244, 0.09)",
                          }}
                        >
                          <div className="flex flex-row justify-between">
                            <h2 className="blackHeadings pb-3">Basic Details</h2>

                            {role === "participant" ? (
                              <button
                                className="text-gray-500 text-sm border border-gray-300 px-2 py-2 shadow-lg rounded-md hover:text-gray-700 hover:border-gray-400"
                                onClick={basicDetailButton}
                              >
                                <img
                                  src={leftArrowIcon}
                                  alt="Back"
                                  loading="lazy"
                                  className="w-3 h-4"
                                />
                              </button>
                            ) : (
                              " "
                            )}
                          </div>
                          <Suspense fallback={<ComponentLoader />}>
                            <BasicDetail
                              scenarioDetails={scenarioDetails}
                              setScenarioDetails={setScenarioDetails}
                              onUpdate={handleUpdate}
                              Role={role}
                            />
                          </Suspense>
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-7 h-auto">
                        <div
                          className="border border-gray-200 rounded-lg h-full"
                          style={{
                            background:
                              "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)",
                            boxShadow: "0px 2px 12px 0px rgba(2, 82, 244, 0.09)",
                          }}
                        >
                          <h2 className="blackHeadings p-4">Requirements</h2>
                          <Suspense fallback={<ComponentLoader />}>
                            <Requirements
                              key={scenarioId}
                              id={scenarioId}
                              scenarioDetails={scenarioDetails}
                              setScenarioDetails={setScenarioDetails}
                              requirementUpdate={handleRequirmentUpdate}
                              Role={role}
                              responses={responses}
                              setResponses={setResponses}
                              progress={progress}
                              setProgress={setProgress}
                              totalDemands={totalDemands}
                              setTotalDemands={setTotalDemands}
                              completedDemands={completedDemands}
                              setCompletedDemands={setCompletedDemands}
                              setScenarioUpdate={setScenarioUpdate}
                              demandUpdateIds={demandUpdate}
                              participantAnswer={participantAnswer}
                              setParticipantAnswer={setParticipantAnswer}
                            />
                          </Suspense>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {role === "participant" && showDiffLayout ? (
                  <div className="grid grid-cols-12 gap-2 h-auto  overflow-hidden">
                    <div className="col-span-12 md:col-span-6 h-auto">
                      <div
                        className="border border-gray-200 rounded-lg h-auto"
                        style={{
                          background:
                            "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)",
                          boxShadow: "0px 2px 12px 0px rgba(2, 82, 244, 0.09)",
                        }}
                      >
                        <div className="flex flex-row justify-between p-4">
                          <h2 className="blackHeadings pb-3">Requirements</h2>

                          {role === "participant" ? (
                            <Button
                              buttonName={"Basic Details"}
                              onClick={basicDetailButton}
                            />
                          ) : (
                            " "
                          )}
                        </div>
                        <Suspense fallback={<ComponentLoader />}>
                          <Requirements
                            key={scenarioId}
                            id={scenarioId}
                            scenarioDetails={scenarioDetails}
                            setScenarioDetails={setScenarioDetails}
                            requirementUpdate={handleRequirmentUpdate}
                            Role={role}
                            responses={responses}
                            setResponses={setResponses}
                            showDiffLayout={showDiffLayout}
                            isOpen={isOpen}
                            tabId={handleDemandTab}
                            setDemandTab={setDemandTab}
                            setActiveNameTab={setActiveTab}
                            setSectionkey={setSectionkey}
                            progress={progress}
                            setProgress={setProgress}
                            totalDemands={totalDemands}
                            setTotalDemands={setTotalDemands}
                            completedDemands={completedDemands}
                            setCompletedDemands={setCompletedDemands}
                            setScenarioUpdate={setScenarioUpdate}
                            demandUpdateIds={demandUpdate}
                            participantAnswer={participantAnswer}
                            setParticipantAnswer={setParticipantAnswer}
                          />
                        </Suspense>
                      </div>
                    </div>

                    <div className="col-span-12 md:col-span-6 h-auto">
                      {sectionKey === 'summary' ?
                        <div className="flex flex-col bg-[#f9faff] p-4 rounded-md shadow-md h-full">
                          <div className="relative border-0 rounded-lg px-2 py-2 innerBox bg-[#F9F9F999]">

                            <AutoResizeTextarea
                              className="w-full textarea-no-border hide-scrollbar p-4 bg-[#F9F9F999]"
                              rows={10}
                              value={scenarioDetails?.summary || ""}
                              onChange={(value) => {
                                setScenarioDetails((prev) => ({
                                  ...prev,
                                  summary: value,
                                }));
                              }}
                              placeholder="Summary :"
                            /> </div> </div>
                        : sectionKey === 'concept_of_operation' ?
                          <div className="flex flex-col bg-[#f9faff] p-4 rounded-md shadow-md h-full">
                            <div className="relative border-0 rounded-lg px-2 py-2 innerBox bg-[#F9F9F999]">

                              <AutoResizeTextarea
                                className="w-full textarea-no-border hide-scrollbar p-4 bg-[#F9F9F999]"
                                rows={10}
                                value={
                                  scenarioDetails?.concept_of_operation || ""
                                }
                                onChange={(value) => {
                                  setScenarioDetails((prev) => ({
                                    ...prev,
                                    concept_of_operation: value,
                                  }));
                                }}
                                placeholder="Concept Of Operation :"
                              /></div></div>
                          : <div className="flex flex-col rounded-t-lg bg-white m-2 shadow-md h-full">
                            <button className="flex items-center rounded-lg justify-between w-full py-3 px-4 text-left text-gray-800 font-semibold">
                              <span className="text-[#4C6EF5]  inter-deamndName-style capitalize">
                                {demandTab?.text
                                  ? demandTab?.text
                                  : "No description available."}
                              </span>
                            </button>
                            <div className="flex flex-row gap-2 items-center px-4 pb-3">
                              <span className="text-[#9127AC] inter-style">
                                Constraints:
                              </span>
                              {constraintsArray.map((item, index) => (
                                <span
                                  className="text-[#9127AC] inter-style p-2 rounded-lg"
                                  style={{ backgroundColor: "#9329AE0A" }}
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                            <div className="relative border-0 rounded-lg p-4 m-4 innerBox bg-[#F9F9F999]">

                              <AutoResizeTextarea
                                className="w-full textarea-no-border hide-scrollbar bg-[#F9F9F999]"
                                rows={10}
                                value={response}
                                controls={true}
                                onChange={(value) =>
                                  handleChange(
                                    value,
                                    demandTab?.id,
                                  )
                                }
                                placeholder="Answer :"
                              />
                            </div>
                          </div>}
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>

              <Footer
                onSubmit={
                  role === "game_master"
                    ? handleSubmitAllDetails
                    : handleSubmitAnswers
                }
                Role={role}
                isDirty={isDirty}
              />
            </div>
          </div>
        </div>
      </IdleTimerProvider >
      <UseNavigatorOnLine onSubmit={handleSubmitAllDetails} />
    </>
  );
};

export default ChallengeDetailPage;
