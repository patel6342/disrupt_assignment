import {
  useEffect,
  useState,
  Suspense,
  lazy,
  useCallback,
  useMemo,
} from "react";

import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import ProgressBar from "../ProgressBar/ProgressBar";
const Usability = lazy(() => import("../Usability/Usability"));
const Accordion = lazy(() => import("../Accordion/Accordion"));
const NamesTab = lazy(() => import("../NamesTab/NamesTab"));
import ComponentLoader from "../ComponentLoader/ComponentLoader";
import AutoResizeTextarea from "../AutoResizeTextArea/AutoResizeTextArea";
import { editScenario, getScenarioById } from "../../redux/scenario";
import { useDispatch } from "react-redux";
const Requirements = ({
  scenerioId,
  scenarioDetails,
  setScenarioDetails,
  requirementUpdate,
  Role,
  setDemandTab,
  setActiveNameTab,
  isOpen,
  tabId,
  sectionKeyDemand,
  setSectionkey,
  responses,
  setResponses,
  showDiffLayout,
  judgeData,
  demandTab,
  responseById,
  progress,
  setProgress,
  totalDemands,
  setTotalDemands,
  completedDemands,
  setCompletedDemands,
  setScenarioUpdate,
  scenarioUpdate,
  participantAnswer,
  setParticipantAnswer,
  setFlagTab,
  setTabFlagIndex
}) => {

  const [role, setRole] = useState(Role);
  const tabs = useMemo(() => {
    const allTabs = [
      { id: 1, title: "Summary", key: "summary" },
      { id: 2, title: "Concept of Operation", key: "concept_of_operation" },
      { id: 3, title: "Usability / Complexity", key: "complexity" },
      { id: 4, title: "Science", key: "science" },
      { id: 5, title: "Engineering", key: "engineering" },
      { id: 6, title: "Economic", key: "economic" },
      { id: 7, title: "Talent", key: "talent" },
    ];

    if (role === "game_master") {
      return allTabs.filter((tab) => tab.id !== 1 && tab.id !== 2);
    }
    return allTabs;
  }, [role]);


  function getDefaultTab() {
    if (role === "judge" && role!=="participant" && role!=="game_master") {
      // 1. Check if summary_scores response_id is null
      if (!responseById?.summary_scores?.response_id && responseById?.concept_of_operation_scores?.response_id) {
        return 2; // Set to "Concept of Operation" tab (id: 2)
      }

      // 2. Check if both summary_scores and concept_of_operation_scores response_id exist
      if (responseById?.concept_of_operation_scores?.response_id && responseById?.summary_scores?.response_id) {
        return 3; // Set to "Usability / Complexity" tab (id: 3)
      }

      // 3. Check responseById.scores and filter based on demands and type
      const filteredScore = responseById?.scores?.find((score) => {
        // Ensure the demands array exists and has a length greater than 0
        if (score.demands && score.demands.length > 0) {
          // Compare score.type with allTabs keys
          const scoreType = score.type.toLowerCase();
          return tabs.some(tab => tab.key.toLowerCase() === scoreType);
        }
        return false;
      });


      if (filteredScore) {
        const matchedTab = tabs.find(tab =>
          filteredScore.type.toLowerCase() === tab.key.toLowerCase()
        );

        if (matchedTab) {
          return matchedTab.id; // Set to the matched tab's id
        }
      }

    }

    // Default for game_master or any other role
    return role === "game_master" ? 3 : 1; // Set to "Usability / Complexity" or "Summary"
  }


  console.log("settotal", totalDemands, progress, setResponses)
  const [activeTab, setActiveTab] = useState(() => Role === "game_master" ? 3 : 1);
  // const [activeTab, setActiveTab] = useState(()=>getDefaultTab());
  const [requirement, setRequirement] = useState([]);
  const [showDone, setShowDone] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [mandatoryField, setMandatoryField] = useState({
    summary: false,
    cop: false,
  });

  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (role)
  //     setActiveTab(()=>getDefaultTab)
  // }, [role])



  useEffect(() => {
    if (scenerioId)
      dispatch((getScenarioById(scenerioId)));
  }, [scenarioDetails])

  //   useEffect(() => {
  //   // Check if the current active tab is disabled, if so, switch to the next available tab
  //   if(role==="judge"){
  //     if (tabs.length > 0) {
  //       const currentTab = tabs.find((tab) => tab.id === activeTab);
  //       const sectionKey = currentTab?.key || "complexity";

  //       let currentRequirement = scenarioDetails?.requirements?.find(
  //         (req) => req.type === sectionKey
  //       );

  //       const isTabDisabled =
  //         role !== "game_master" &&
  //         (!currentRequirement || currentRequirement?.demands?.length === 0);

  //       if (isTabDisabled) {
  //         handleNextClick(); // Automatically move to the next tab if current tab is disabled
  //       }
  //     }
  //   }
  // }, [activeTab, scenarioDetails, tabs,role]);


  const handleNextClick = useCallback(() => {
    setActiveTab((prev) => {
      const currentIndex = tabs.findIndex((tab) => tab.id === prev);
      const nextIndex = (currentIndex + 1) % tabs.length;
      const nextTab = tabs[nextIndex];

      const sectionKey = nextTab.key;
      let currentRequirement = scenarioDetails?.requirements?.find(
        (req) => req.type === sectionKey
      );

      if (nextTab?.id === 7) {
        setShowDone(true);
      } else {
        setShowDone(false);
      }

      console.log("tab", nextTab.id);

      return nextTab.id;
    });
  }, [scenarioDetails?.requirements, tabs]);

  const handleBackClick = useCallback(() => {
    setActiveTab((prev) => {
      const currentIndex = tabs.findIndex((tab) => tab.id === prev);
      const nextIndex = (currentIndex - 1) % tabs.length;
      const nextTab = tabs[nextIndex];

      if (nextTab?.id === 5) {
        setShowDone(true);
      } else {
        setShowDone(false);
      }

      return nextTab.id;
    });
  }, [tabs]);

  const handleTabChange = (
    (id) => {
      setActiveTab(id);
      tabId(id);
      setDemandTab(id);
      console.log("tab", demandTab);
      console.log("tab", id);
      console.log("tab", activeTab);
    }

  );

  const handleFieldChange = (
    (sectionKey, field, value) => {
      console.log("fi")
      setScenarioDetails((prevDetails) => ({
        ...prevDetails,
        requirements: prevDetails.requirements.map((req) =>
          req.type === sectionKey ? { ...req, [field]: value } : req
        ),
      }));
    }

  );

  const handleAddDemand = (
    (sectionKey) => {
      console.log("adding demands here");
      const newDemand = {
        id: parseInt(uuidv4().replace(/-/g, ""), 16),
        text: "",
        constraints: [],
      };

      setScenarioDetails((prevDetails) => ({
        ...prevDetails,
        requirements: prevDetails.requirements.map((req) =>
          req.type === sectionKey
            ? { ...req, demands: [newDemand, ...req.demands] }
            : req
        ),
      }));
    }
  )



  const handleDeleteDemand = (
    (sectionKey, demandId) => {

      const updatedScenarioDetails = {
        ...scenarioDetails,
        requirements: scenarioDetails.requirements.map((req) => {
          console.log(req.type === sectionKey, "in delete check the req.type");
          if (req.type === sectionKey) {
            // Find and update the matched demand in the current requirement
            return {
              ...req,
              demands: req.demands.map((demand) => {
                if (demand.id === demandId && demand.text !== "") {
                  // Update the matched demand with just id and action: "delete"
                  return { id: demandId, action: "delete" };
                }
                return { ...demand, action: "update" }; // Return other demands as they are
              }),
            };
          }
          else if (req.demands.length > 0) {
            return {
              ...req,
              demands: req.demands.map((demand) => ({ ...demand, action: "update" }))
            }
          } // Return other requirements as they are
          return req;
        }).filter((req) => req.demands.length > 0)
      };

      console.log(updatedScenarioDetails, "Updated Scenario Details after deletion");

      console.log(scenarioDetails.requirements, "requirement in deletion");
      if (updatedScenarioDetails.requirements) {
        const emptyDemand = updatedScenarioDetails.requirements.some(req => {
          if (req.demands.length > 0)
            return req.demands.some(demand => demand.text === "" || demand?.constraints?.length < 0);

        }
        );

        console.log("nonEmptydemand", emptyDemand);
        if (!emptyDemand)
          dispatch(editScenario(updatedScenarioDetails)).unwrap().then((response) => {
            console.log(response, "response after deletion");
            setScenarioUpdate((prev) => !prev);
          }).catch((error) => {
            console.log(error, "error while deletion");
          })
      }

      setScenarioDetails((prevDetails) => ({
        ...prevDetails,
        requirements: prevDetails?.requirements?.map((req) =>
          req.type === sectionKey
            ? {
              ...req,
              demands: req?.demands?.filter((demand) => demand.id !== demandId),
            }
            : req
        ),
      }));

      // toast.info("Demand removed.");
    }
  );

  const handleFieldDemandChange = (
    (sectionKey, id, name) => {
      setScenarioDetails((prevDetails) => ({
        ...prevDetails,
        requirements: prevDetails.requirements.map((req) => {
          if (req.type === sectionKey) {
            const updatedDemands = req.demands.map((demand) =>
              demand.id === id ? { ...demand, text: name } : demand
            );
            return { ...req, demands: updatedDemands };
          }
          return req;
        }),
      }));
    }

  );

  const handleConstraintsChange = (
    (sectionKey, updatedTagsByDemandId) => {

      setScenarioDetails((prevDetails) => ({
        ...prevDetails,
        requirements: prevDetails.requirements.map((req) => {
          if (req.type === sectionKey) {
            const updatedDemands = req.demands.map((demand) =>
              updatedTagsByDemandId.hasOwnProperty(demand.id)
                ? { ...demand, constraints: updatedTagsByDemandId[demand.id] }
                : demand
            );
            return { ...req, demands: updatedDemands };
          }
          return req;
        }),
      }));
    }

  );

  const handleResponses = useCallback(
    (sectionKey, response) => {
      setResponses({
        sectionKey,
        response,
      });
    },
    [setResponses]
  );

  const renderTabContent = (() => {
    const sectionKey = tabs.find((tab) => tab.id === activeTab)?.key;

    let currentRequirement = scenarioDetails?.requirements?.find(
      (req) => req.type === sectionKey
    );


    if (!currentRequirement) return null;

    return (
      <Suspense fallback={<ComponentLoader />}>
   
        <Usability
          requirement={scenarioDetails?.requirements?.find(
            (req) => req.type === sectionKey
          )}
          headerText={currentRequirement?.type}
          description={currentRequirement?.description}
          demands={
            scenarioDetails?.requirements?.find(
              (req) => req.type === sectionKey
            )?.demands
          }
          status={currentRequirement?.is_enabled}
          onFieldChange={(field, value) =>
            handleFieldChange(sectionKey, field, value)
          }
          handleFieldDemandChange={(id, name) =>
            handleFieldDemandChange(sectionKey, id, name)
          }
          onDemandConstraintsChange={(updatedTagsByDemandId) =>
            handleConstraintsChange(sectionKey, updatedTagsByDemandId)
          }
          onAddDemand={() => handleAddDemand(sectionKey)}
          onDeleteDemand={(demandId) =>
            handleDeleteDemand(sectionKey, demandId)
          }
          handleBackClick={handleBackClick}
          handleNextClick={handleNextClick}
          activeTab={activeTab}
          tabs={tabs.length}
          showDone={showDone}
          setScenarioDetails={setScenarioDetails}
          sectionKey={sectionKey}
        />
      </Suspense>
    );
  });

  const renderAccContent = (() => {

    const sectionKey = tabs.find((tab) => tab.id === activeTab)?.key;

    const sectionNames = tabs.find((tab) => tab.id === activeTab)?.title;


    let currentRequirement = scenarioDetails?.requirements?.find(
      (req) => req.type === sectionKey
    );



    const isSummary = sectionKey === "summary";


    const isConcept = sectionKey === "concept_of_operation";


    if (!currentRequirement && !isSummary && !isConcept) return null;

    return (
      <>
        <Suspense fallback={<ComponentLoader />}>
          {isSummary ? (
            <div className="flex flex-col bg-[#f9faff] p-4 rounded-md shadow-md">
              <div className="relative border-0 rounded-lg px-2 py-2  bg-[#F9F9F999]">
                <AutoResizeTextarea
                  className="w-full textarea-no-border hide-scrollbar p-4 bg-[#F9F9F999]"
                  rows={10}
                  value={scenarioDetails?.summary?.answer || ""}
                  // value={participantAnswer?.summary_response?.answer || ""}
                  onChange={(value) => {
                    setScenarioDetails((prev) => ({
                      ...prev,
                      summary: { ...prev.summary, answer: value },
                    }));
                  }}
                  placeholder="Answer :"
                />
              </div>
            </div>
          ) : isConcept ? (
            <div className="flex flex-col bg-[#f9faff] p-4 rounded-md shadow-md">
              <div className="relative border-0 rounded-lg px-2 py-2  bg-[#F9F9F999]">
                <AutoResizeTextarea
                  className="w-full textarea-no-border hide-scrollbar p-4 bg-[#F9F9F999]"
                  rows={10}
                  value={scenarioDetails?.concept_of_operation?.answer || ""}
                  // value={participantAnswer?.concept_of_operation_response?.answer || ""}
                  onChange={(value) => {
                    setScenarioDetails((prev) => ({
                      ...prev,
                      concept_of_operation: {
                        ...prev.concept_of_operation, // Spread the existing object
                        answer: value, // Update the answer property
                      },
                    }));
                  }}
                  placeholder="Answer :"
                />
              </div>
            </div>
          ) : (
            <Accordion
              headerText={currentRequirement?.description}
              description={currentRequirement?.description}
              demands={currentRequirement?.demands}
              sectionKey={sectionKey}
              sectionNames={sectionNames}
              responses={responses}
              setResponses={setResponses}
              participantAnswer={participantAnswer}
              setParticipantAnswer={setParticipantAnswer}
            />
          )}
        </Suspense>
      </>
    );
  });

  const renderNameContent = () => {

    const sectionKey =
      tabs.find((tab) => tab.id === activeTab)?.key || "summary";

    const sectionNames = tabs.find((tab) => tab.id === activeTab)?.title;

    let currentRequirement = scenarioDetails?.requirements?.find(
      (req) => req.type === sectionKey
    );

    setSectionkey(sectionKey);

    const isTabDisabled =
      !currentRequirement ||
      (currentRequirement.demands && currentRequirement.demands.length === 0);

    const isSummary = sectionKey === "summary";
    const isConcept = sectionKey === "concept_of_operation";


    return (
      <Suspense fallback={<ComponentLoader />}>
        {isSummary ? (
          <div className="flex flex-col bg-[#f9faff] p-4 rounded-md shadow-md">
            <div className="relative border-0 rounded-lg px-2 py-2 bg-[#F9F9F999]">
              <h5 className="text-lg font-semibold text-[#4C6EF5]">Summary</h5>

            </div>
          </div>
        ) : isConcept ? (
          <div className="flex flex-col bg-[#f9faff] p-4 rounded-md shadow-md">
            <div className="relative border-0 rounded-lg px-2 py-2 bg-[#F9F9F999]">
              <h5 className="text-lg font-semibold text-[#4C6EF5]">
                Concept Of Operation
              </h5>

            </div>
          </div>
        ) : (
          <NamesTab
            headerText={currentRequirement?.headerText}
            description={currentRequirement?.description}
            demands={currentRequirement?.demands}
            isOpen={isOpen}
            onTabChange={handleTabChange}
            sectionNames={sectionNames}
            setActiveNameTab={setActiveNameTab}
            setDemandTab={setDemandTab}
            isDisabled={isTabDisabled}
            judgeData={judgeData}
            demandTab={demandTab}
            completedDemandTab={completedDemandTab}
            responseById={responseById}
            sectionKey={sectionKey}
            responses={responses}
            setTabFlagIndex={setTabFlagIndex}
          />
        )}
      </Suspense>
    );
  };

  const [numDemands, setNumDemands] = useState({});
  const [trueCount, setTrueCount] = useState({
    complexity: '',
    science: '',
    engineering: "",
    economic: "",
    talent: "",
    summary: "",
    concept_of_operation: ""
  });
  const [completedDemandTab, setCompletedDemandTab] = useState([


  ])

  const checkAnswerComplete = (sectionKey) => {

    let currentRequirement = scenarioDetails?.requirements?.find(
      (req) => req.type === sectionKey
    );

    if (!currentRequirement && sectionKey !== "summary" && sectionKey !== "concept_of_operation") return false;

    if (sectionKey === "summary") {
      return scenarioDetails?.summary?.answer && scenarioDetails.summary?.answer.trim() !== "";
    }

    if (sectionKey === "concept_of_operation") {
      return scenarioDetails?.concept_of_operation?.answer && scenarioDetails.concept_of_operation?.answer.trim() !== "";
    }
    const demands = currentRequirement.demands;

    const allAnswered = demands.every((demand) => {
      const response = responses.find((res) => res.demand_id === demand.id);
      return response && response.content && response.content.trim() !== "";
    });

    return allAnswered;
  };

  const checkTabComplete = (key) => {
    const demandsArray = responseById?.scores?.find((d) => d.type === key);
    let answer_id_array = [];
    if (key === "summary") {

      answer_id_array.push(
        checkIfAnswerIsComplete(responseById?.summary_scores?.response_id, key)
      );
    } else if (key === "concept_of_operation") {
      answer_id_array.push(
        checkIfAnswerIsComplete(
          responseById?.concept_of_operation_scores?.response_id, key
        )
      );
    } else {
      if (demandsArray?.length == 0) {
        return false;
      }
      demandsArray?.demands?.map((d) =>
        answer_id_array.push(checkIfAnswerIsComplete(d?.answer_id, key))
      );
    }

    return answer_id_array.every((value) => value === true);
  };

  const checkIfAnswerIsComplete = (answer_id, key) => {

    const newObj = judgeData.judgeData?.scores?.find(d => {console.log(d.response_id,"fdsf",answer_id); return d.response_id === answer_id});

    if (!newObj) {
      return false
    }
    let fieldsToCheck
    if (key === "concept_of_operation" || key === "summary") {
      fieldsToCheck = [
        newObj?.originality,
        newObj?.feasibility,
        newObj?.consistency,
        newObj?.efficiency,
        newObj?.value_for_money,
        newObj?.security,
        newObj?.originality_comment,
        newObj?.feasibility_comment,
        newObj?.consistency_comment,
        newObj?.efficiency_comment,
        newObj?.value_for_money_comment,
        newObj?.security_comment,
        newObj?.demand_comment,
        // key === "summary" ? newObj?.summary_comment : newObj?.concept_of_operation_comment,
      ];
    } else {
      fieldsToCheck = [
        newObj?.originality,
        newObj?.feasibility,
        newObj?.consistency,
        newObj?.efficiency,
        newObj?.value_for_money,
        newObj?.security,
        newObj?.originality_comment,
        newObj?.feasibility_comment,
        newObj?.consistency_comment,
        newObj?.efficiency_comment,
        newObj?.value_for_money_comment,
        newObj?.security_comment,
        newObj?.demand_comment,
      ];
    }


    // Check if all fields are filled
    return fieldsToCheck?.every(field => field !== '' && field !== undefined && field !== null);
  }


  const setProgressForKey = () => {
    let totalDemand = 2;

    let completedDemand = 0;


    const isSummaryComplete = checkIfAnswerIsComplete(responseById?.summary_scores?.response_id, "summary");
    completedDemand += isSummaryComplete ? 1 : 0;


    const isConceptOfOperationComplete = checkIfAnswerIsComplete(responseById?.concept_of_operation_scores?.response_id, "concept_of_operation");
    completedDemand += isConceptOfOperationComplete ? 1 : 0;


    tabs.forEach((tab) => {
      if (tab.key !== "summary" && tab.key !== "concept_of_operation") {
        const demandsArray = responseById?.scores?.find((d) => d.type === tab.key);

        if (demandsArray?.demands?.length) {
          totalDemand += demandsArray.demands.length;
          const completedDemandsSet = demandsArray.demands.filter(d =>
             checkIfAnswerIsComplete(d?.response_id, tab.key)
          ).length;

          completedDemand += completedDemandsSet;
        }
      }
    });

    setTotalDemands(totalDemand)

    setCompletedDemands(completedDemand);


    const progress = totalDemand > 0 ? (completedDemand / totalDemand) * 100 : 0;
    setProgress(progress);
  };


  useEffect(() => {
    if (role === 'judge') {
      setProgressForKey();
    }
  }, [tabs, activeTab, role, responseById, setProgressForKey]);

  const setProgressForAnswerKey = () => {
    let totalDemand = 0;
    let completedDemand = 0;


    const isSummaryComplete = scenarioDetails?.summary?.answer && scenarioDetails.summary?.answer.trim() !== "";
    totalDemand += 1;
    completedDemand += isSummaryComplete ? 1 : 0;


    const isConceptComplete = scenarioDetails?.concept_of_operation?.answer && scenarioDetails.concept_of_operation?.answer.trim() !== "";
    totalDemand += 1;
    completedDemand += isConceptComplete ? 1 : 0;


    scenarioDetails?.requirements?.forEach((requirement) => {
      const demands = requirement?.demands || [];
      totalDemand += demands.length;

      const answeredDemands = demands.filter((demand) => {
        const response = responses?.find((res) => res.demand_id === demand.id);
        return response && response.content && response.content.trim() !== "";
      }).length;

      completedDemand += answeredDemands;
    });

    setTotalDemands(totalDemand);
    setCompletedDemands(completedDemand);

    return totalDemands > 0 ? (completedDemand / totalDemand) * 100 : 0;
  };


  useEffect(() => {
    if (role === 'participant') {
      const progressValue = setProgressForAnswerKey();
      setProgress(progressValue);
    }
  }, [tabs, role, responses, scenarioDetails, setProgressForAnswerKey]);

  useEffect(() => {
    const data = responseById?.scores;
    const typeCount = data?.reduce((acc, item) => {
      acc[item?.type] = item?.demands?.length;
      return acc;
    }, {});

    const res = { ...typeCount, summary: 1, concept_of_operation: 1 };

    setNumDemands(res);
  }, [responseById]);



  return (
    <div className="w-full h-full overflow-hidden mx-auto ">
      <div className="flex border-b mx-2 border-[#f9faff] px-4 overflow-x-scroll ">
        {tabs.map((tab) => {
          const sectionKey = tab.key || "complexity";
          let currentRequirement = scenarioDetails?.requirements?.find(
            (req) => req.type === sectionKey
          );

          const isTabDisabled =
            role !== "game_master" && !["summary", "concept_of_operation"].includes(tab.key)&&
            // (
            //   (role === "judge" && (
            //     (tab.key === "summary" && responseById?.summary_scores?.response_id === null) ||
            //     (tab.key === "concept_of_operation" && responseById?.concept_of_operation_scores?.response_id === null)
            //   )) || !["summary", "concept_of_operation"].includes(tab.key)
            // ) &&
            (!currentRequirement ||
              (currentRequirement.demands &&
                currentRequirement.demands.length === 0));

          return (
            <button
              key={tab.id}
              onClick={() => {
                !isTabDisabled && setActiveTab(tab?.id)
                console.log("tabflag", tab?.id);
                !isTabDisabled && setFlagTab();
                console.log("")
              }}
              className={`${activeTab === tab?.id
                ? "border-[#4C6EF5] text-[#4C6EF5] work-sans-active-style "
                : "border-transparent text-gray-500 hover:text-gray-700 work-sans-not-active-tab-style"
                } whitespace-nowrap py-2 border-b-2 mr-5 ${isTabDisabled
                  ? "opacity-50 cursor-not-allowed text-gray-500"
                  : ""
                } ${role === "judge" && checkTabComplete(tab.key) && !isTabDisabled
                  ? "text-green-900"
                  : ""
                }
              ${role === "participant" &&
                  checkAnswerComplete(tab.key) &&
                  !isTabDisabled
                  ? "text-green-900"
                  : ""
                }
              `}
              disabled={isTabDisabled}
            >
              {tab.title}{" "}
              {role === "game_master"
                ? ""
                : currentRequirement?.demands
                  ? `(${currentRequirement.demands.length})`
                  : ""}
            </button>
          );
        })}
      </div>
      <div className="h-auto">
        <div className="bg-white h-full ">
          {role === "game_master" && role !== "judge" && renderTabContent()}

          {role !== "game_master" && role !== "judge" && !showDiffLayout && (
            <>{renderAccContent()}</>)}
          {role !== "game_master" && role !== "judge" && showDiffLayout && (
            <>
              {renderNameContent()}

            </>
          )}
          {role === "judge" && (
            <>
              {renderNameContent()}

            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Requirements;
