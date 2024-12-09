import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../routes/AuthContext";
import AutoResizeTextarea from "../AutoResizeTextArea/AutoResizeTextArea";
const generateFibonacci = () => ["NA", 0, 1, 3, 5, 8,];
import { useLocation } from "react-router-dom";
import { data } from "autoprefixer";
import { faL } from "@fortawesome/free-solid-svg-icons";



const labels = {
  "NA": "not applicable",
  0: "not present",
  1: "marginally",
  3: "somewhat",
  5: "present",
  8: "most",
};

const JudgeDemand = ({
  tabChanged,
  sectionKey,
  demandTab,
  responseById,
  judgeData,
  setJudgeData,
  setInitialJudgeData,
  setIsDirty,
  isDirty,
  setChangedScore,
  setChangedComment,
  setFlagBackEvent,
  fBack,
  setTabFlag,
  onSubmit,
  submitSuccessFlag
}) => {
  const navigate = useNavigate();
  const goback = () => navigate(-1);
  const location = useLocation();
  const { isLoggedIn, role, checkAuthToken, username } = useAuth();

  useEffect(() => {
    checkAuthToken();
  }, [checkAuthToken]);

  useEffect(() => {
    setJudgeData({
      scores: []
    })

  }, [location])



  useEffect(() => {
    if (fBack) {
      update_score();
      onSubmit(true);
      goback()
    }
  }, [fBack])

  //set response for detecting it in responsebyid(judgedata)
  const [response, setResponse] = useState('')

  useEffect(() => {
    console.log("sectionkey", sectionKey);
    if (sectionKey == "complexity" ||
      sectionKey == "science" ||
      sectionKey == "engineering"
    ) {
      setResponse(responseById?.scores
        ?.find((requirement) => requirement.type === sectionKey)
        ?.demands?.find((demand) => demand.id === demandTab?.id))

      return (() => {
        setResponse('')
      })
    }
  }, [responseById, demandTab, sectionKey])

  const responseId = response?.response_id;
  const responseValue = response?.response;

  const [summary, setSummary] = useState(responseById?.summary_scores);
  const [concept_of_operation, setConcept_of_Operation] = useState(responseById?.concept_of_operation_scores);

  const [outerData, setOuterData] = useState([
    {
      key: "cop",
      rating: {
        Originality: '',
        Feasibility: '',
        Consistency: '',
        Efficiency: '',
        "Value For Money": '',
        Security: '',
        // demand_comment: ''
      },
    },
    {
      key: "summary",
      rating: {
        Originality: '',
        Feasibility: '',
        Consistency: '',
        Efficiency: '',
        "Value For Money": '',
        Security: '',
        // demand_comment: ''
      },
    },

  ]);

  const initBoard = () => {
    if (responseById && Object.keys(responseById).length > 0) {
      setSummary(responseById?.summary_scores);
      setConcept_of_Operation(responseById?.concept_of_operation_scores);
    }

  }

  useEffect(() => {
    initBoard()
  }, [responseById, sectionKey]);

  const initOuterData = () => {
    setOuterData([
      {
        key: "cop",
        rating: {
          Originality: responseById?.concept_of_operation_scores?.scores?.originality === -1 ? "NA" : responseById?.concept_of_operation_scores?.scores?.originality ,
          Feasibility: responseById?.concept_of_operation_scores?.scores?.feasibility === -1 ? "NA" : responseById?.concept_of_operation_scores?.scores?.feasibility ,
          Consistency: responseById?.concept_of_operation_scores?.scores?.consistency === -1 ? "NA" : responseById?.concept_of_operation_scores?.scores?.consistency ,
          Efficiency: responseById?.concept_of_operation_scores?.scores?.efficiency === -1 ? "NA" : responseById?.concept_of_operation_scores?.scores?.efficiency ,
          "Value For Money": responseById?.concept_of_operation_scores?.scores?.value_for_money === -1 ? "NA" : responseById?.concept_of_operation_scores?.scores?.value_for_money,
          Security: responseById?.concept_of_operation_scores?.scores?.security === -1 ? "NA" : responseById?.concept_of_operation_scores?.scores?.security ,
        },
        comment: {
          originality_comment: responseById?.concept_of_operation_scores?.scores.originality_comment,
          feasibility_comment: responseById?.concept_of_operation_scores?.scores.feasibility_comment,
          consistency_comment: responseById?.concept_of_operation_scores?.scores.consistency_comment,
          efficiency_comment: responseById?.concept_of_operation_scores?.scores.efficiency_comment,
          value_for_money_comment: responseById?.concept_of_operation_scores?.scores.value_for_money_comment,
          security_comment: responseById?.concept_of_operation_scores?.scores.security_comment,
          demand_comment: responseById?.concept_of_operation_scores?.demand_comment,
        }
      },
      {
        key: "summary",
        rating: {
          Originality: responseById?.summary_scores?.scores?.originality === -1 ? "NA" : responseById?.summary_scores?.scores?.originality ,
          Feasibility: responseById?.summary_scores?.scores?.feasibility === -1 ? "NA" : responseById?.summary_scores?.scores?.feasibility ,
          Consistency: responseById?.summary_scores?.scores?.consistency === -1 ? "NA" : responseById?.summary_scores?.scores?.consistency ,
          Efficiency: responseById?.summary_scores?.scores?.efficiency === -1 ? "NA" : responseById?.summary_scores?.scores?.efficiency ,
          "Value For Money": responseById?.summary_scores?.scores?.value_for_money === -1 ? "NA" : responseById?.summary_scores?.scores?.value_for_money ,
          Security: responseById?.summary_scores?.scores?.security === -1 ? "NA" : responseById?.summary_scores?.scores?.security ,
        },
        comment: {
          originality_comment: responseById?.summary_scores?.scores.originality_comment,
          feasibility_comment: responseById?.summary_scores?.scores.feasibility_comment,
          consistency_comment: responseById?.summary_scores?.scores.consistency_comment,
          efficiency_comment: responseById?.summary_scores?.scores.efficiency_comment,
          value_for_money_comment: responseById?.summary_scores?.scores.value_for_money_comment,
          security_comment: responseById?.summary_scores?.scores.security_comment,
          demand_comment: responseById?.summary_scores?.demand_comment
        }
      },
    ])
  }

  useEffect(() => {
    initOuterData();
  }, [
    responseById, sectionKey,
    summary?.response_id,
    concept_of_operation?.response_id,
  ])

  const [ratings, setRatings] = useState({
    Originality: '',
    Feasibility: '',
    Consistency: '',
    Efficiency: '',
    "Value For Money": '',
    Security: '',
    demand_comment: ''
  });

  const [hoverCategory, setHoverCategory] = useState("");
  const [hoverValue, setHoverValue] = useState(null);

  useEffect(() => {
    if (responseId) {

      setJudgeData((prev) => {
        const scoreIndex = prev.scores.findIndex(
          (score) => score.response_id === responseId
        );

        if (scoreIndex === -1) {
          return {
            ...prev,
            scores: [
              ...prev.scores,
              {
                response_id: responseId,
                originality: response?.scores.originality === "NA" ? -1 : response?.scores.originality || "",
                consistency: response?.scores.consistency === "NA" ? -1 : response?.scores.consistency || "",
                feasibility: response?.scores.feasibility === "NA" ? -1 : response?.scores.feasibility || "",
                efficiency: response?.scores.efficiency === "NA" ? -1 : response?.scores.efficiency || "",
                value_for_money: response?.scores.value_for_money === "NA" ? -1 : response?.scores.value_for_money || "",
                security: response?.scores.security === "NA" ? -1 : response?.scores.security || "",
                demand_comment: response?.demand_comment || "",
                originality_comment: response?.scores?.originality_comment || "",
                feasibility_comment: response?.scores?.feasibility_comment || "",
                consistency_comment: response?.scores?.consistency_comment || "",
                efficiency_comment: response?.scores?.efficiency_comment || "",
                value_for_money_comment: response?.scores?.value_for_money_comment || "",
                security_comment: response?.scores?.security_comment || "",
              },
            ],
          };
        }

        // console.log("BIKIR@j",prev)
        return prev

      });
    }
  }, [
    responseId
  ]);

  useEffect(() => {
    if ((responseId
    ) && demandTab && judgeData) {
      const initialRatings = judgeData.scores.find(
        (score) => score.response_id === responseId
      )
      console.log("ratingsinitial", initialRatings);
      if (initialRatings) {
        setRatings({
          Originality: initialRatings.originality === "NA" ? -1 : initialRatings.originality,
          Feasibility: initialRatings.feasibility === "NA" ? -1 : initialRatings.feasibility,
          Consistency: initialRatings.consistency === "NA" ? -1 : initialRatings.consistency,
          Efficiency: initialRatings.efficiency === "NA" ? -1 : initialRatings.efficiency,
          "Value For Money": initialRatings.value_for_money === "NA" ? -1 : initialRatings.value_for_money,
          Security: initialRatings.security === "NA" ? -1 : initialRatings.security,
          // Security: initialRatings.security === "NA" ? -1 : initialRatings.security || "",
          demand_comment: initialRatings.demand_comment
        });
      } else {
        setRatings({
          Originality: "",
          Feasibility: "",
          Consistency: "",
          Efficiency: "",
          "Value For Money": "",
          Security: "",
          demand_comment: ""
        });
      }
    }
  }, [responseId,
    judgeData, demandTab, response]);

  const handleRatingClick = (category, value) => {
    const formattedCategory = category.replace(/ /g, "_").toLowerCase();
    console.log("rating", category, value);
    setRatings((prev) => {
      const updatedRatings = { ...prev, [category]: value };
      if (responseId) {
        setJudgeData((prevJudgeData) => ({
          ...prevJudgeData,
          scores: prevJudgeData.scores.map((score) =>
            score.response_id === responseId
              ? { ...score, [formattedCategory]: value === "NA" ? -1 : value }
              : score
          ),
        }));
      }
      console.log("ratingupdate", updatedRatings);
      return updatedRatings;
    });

  };

  const handleFeedbackChange = (category, feedback) => {
    const formattedCategory = `${category === "Value For Money" ? "value_for_money" : category.toLowerCase()}_comment`;

    setChangedComment(formattedCategory);
    setRatings((prevRatings) => ({
      ...prevRatings,
      [`${category === "Value For Money" ? "value_for_money" : category.toLowerCase()}_comment`]: feedback,
    }));

    if (responseId) {
      setJudgeData((prevJudgeData) => ({
        ...prevJudgeData,
        scores: prevJudgeData.scores.map((score) =>
          score.response_id === responseId
            ? {
              ...score, [`${category === "Value For Money" ? "value_for_money" : category.toLowerCase()}_comment`]: feedback,
              demand_comment:
                category === "demand" ? feedback : score.demand_comment,

            }
            : score
        ),
      }));
    }

  };

  const handleFeedbackChangeOuterData = (key, category, feedback) => {

    setChangedComment(`${category === "Value For Money" ? "value_for_money" : category.toLowerCase()}_comment`);
    setOuterData((prev) =>
      prev.map((data) =>
        data.key === key
          ? {
            ...data,
            comment: { ...data?.comment, [`${category === "Value For Money" ? "value_for_money" : category.toLowerCase()}_comment`]: feedback },
          }
          : data
      )
    );
  };

  const handleRatingClickOuterData = (key, category, value) => {
    setOuterData((prev) =>
      prev.map((data) =>
        data.key === key
          ? {
            ...data,
            rating: { ...data?.rating, [category]: value }
          }
          : data
      )
    );
    
  };

  const update_score = () => {
    let answer_id
    if (sectionKey === "summary") {
      answer_id = summary?.response_id
    } else if (sectionKey === "concept_of_operation") {
      answer_id = concept_of_operation?.response_id
    }
    else {
      answer_id = null;
    }

    // console.log("update_score", answer_id);

    if (answer_id) {
      setJudgeData((prev) => {
        const scoreIndex = prev.scores.findIndex((score) =>
          sectionKey === "summary" ? score.response_id === summary?.response_id :
            sectionKey === "concept_of_operation" ? score.response_id === concept_of_operation?.response_id :
              null
        );

        let ratings =
          sectionKey === "summary" ? outerData.filter((data) => data?.key === "summary") :
            sectionKey === "concept_of_operation" ? outerData.filter((data) => data?.key === "cop") :
              null


        let comment = ratings[0]?.comment ? ratings[0]?.comment : {};
        ratings = ratings[0]?.rating; 

        // console.log("update_score", comment);


        if (scoreIndex === -1) {
          setInitialJudgeData([...prev.scores])

          return {
            ...prev,
            scores: [
              ...prev.scores,
              {
                response_id: answer_id,
                originality: ratings.Originality === "NA" ? -1 : ratings.Originality ===0 ? 0 : ratings.Originality ,
                feasibility: ratings.Feasibility === "NA" ? -1 : ratings.Feasibility ===0 ? 0 : ratings.Feasibility,
                consistency: ratings.Consistency === "NA" ? -1 : ratings.Consistency ===0 ? 0 : ratings.Consistency,
                efficiency: ratings.Efficiency === "NA" ? -1 : ratings.Efficiency ===0 ? 0 : ratings.Efficiency,
                value_for_money: ratings["Value For Money"] === "NA" ? -1 : ratings["Value For Money"] ===0 ? 0 : ratings["Value For Money"],
                security: ratings.Security === "NA" ? -1 : ratings.Security ===0 ? 0 : ratings.Security,
                originality_comment: comment?.originality_comment || "",
                feasibility_comment: comment?.feasibility_comment || "",
                consistency_comment: comment?.consistency_comment || "",
                efficiency_comment: comment?.efficiency_comment || "",
                value_for_money_comment: comment?.value_for_money_comment || "",
                security_comment: comment?.security_comment || "",
                demand_comment: comment?.demand_comment || ""
              },
            ],
          };
        } else {
          // Get the relevant ratings based on sectionKey
          const ratings =
            sectionKey === "summary" ? outerData.find((data) => data?.key === "summary")?.rating :
            sectionKey === "concept_of_operation" ? outerData.find((data) => data?.key === "cop")?.rating:
            null;

            console.log("update_score", comment);

              if (!ratings) {
            // If no ratings found, return previous state
            setInitialJudgeData([...prev.scores])
            return prev;
          }

          // Create an updated score object
          const updatedScore = {
            response_id: answer_id,
            originality: ratings.Originality === "NA" ? -1 : ratings.Originality ===0 ? 0 : ratings.Originality ,
            feasibility: ratings.Feasibility === "NA" ? -1 : ratings.Feasibility ===0 ? 0 : ratings.Feasibility,
            consistency: ratings.Consistency === "NA" ? -1 : ratings.Consistency ===0 ? 0 : ratings.Consistency,
            efficiency: ratings.Efficiency === "NA" ? -1 : ratings.Efficiency ===0 ? 0 : ratings.Efficiency,
            value_for_money: ratings["Value For Money"] === "NA" ? -1 : ratings["Value For Money"] ===0 ? 0 : ratings["Value For Money"],
            security: ratings.Security === "NA" ? -1 : ratings.Security ===0 ? 0 : ratings.Security,
            originality_comment: comment?.originality_comment || "",
            feasibility_comment: comment?.feasibility_comment || "",
            consistency_comment: comment?.consistency_comment || "",
            efficiency_comment: comment?.efficiency_comment || "",
            value_for_money_comment: comment.value_for_money_comment || "",
            security_comment: comment?.security_comment || "",
            demand_comment: comment?.demand_comment || ""

          };

          // If the score exists, update it; otherwise, do nothing
          const updatedScores =
            scoreIndex >= 0
              ? prev.scores.map((score, index) =>
                index === scoreIndex ? updatedScore : score
              )
              : prev.scores;

            setInitialJudgeData([...prev.scores])
            return {
            ...prev,
            scores: updatedScores,
          };
        }
        // setInitialJudgeData([...prev.scores])
            return prev;
      });
    }
  }

  useEffect(() => {
    update_score();
  }, [outerData])

  const constraintsArray = Array.isArray(demandTab?.constraints)
    ? demandTab.constraints
    : [];

    // useEffect(() => {
    //   if(tabChanged){
    //     if ((responseId
    //     ) && demandTab && judgeData) {
    //       const initialRatings = judgeData.scores.find(
    //         (score) => score.response_id === responseId
    //       )
    //       if (response) {
    //         setRatings({
    //           Originality: response.scores.originality === "NA" ? -1 : response.scores.originality,
    //           Feasibility: response.scores.feasibility === "NA" ? -1 : response.scores.feasibility,
    //           Consistency: response.scores.consistency === "NA" ? -1 : response.scores.consistency,
    //           Efficiency: response.scores.efficiency === "NA" ? -1 : response.scores.efficiency,
    //           "Value For Money": response.scores.value_for_money === "NA" ? -1 : response.scores.value_for_money,
    //           Security: response.scores.security === "NA" ? -1 : response.scores.security,
    //           demand_comment: response.scores.demands === ""? "" : response.scores.demands,
    //         });
    //       } else {
    //         setRatings({
    //           Originality: "",
    //           Feasibility: "",
    //           Consistency: "",
    //           Efficiency: "",
    //           "Value For Money": "",
    //           Security: "",
    //           demand_comment: ""
    //         });
    //       }
    //     }
    //   }
      
    // }, [responseId,
    //   judgeData, 
    //   demandTab, 
    //   response,
    //   tabChanged
    // ]);

  
  return (
    <div className=" my-2">
      {sectionKey === "summary" ? (
        <div className="flex flex-col bg-[#f9faff] p-4 rounded-md shadow-md">
          <div className="relative border-0 rounded-lg px-2 py-2 innerBox bg-[#F9F9F999]">
            <p className=""><span dangerouslySetInnerHTML={{ __html: summary?.response }} /></p>

          </div>{" "}
        </div>
      ) : sectionKey === "concept_of_operation" ? (
        <div className="flex flex-col bg-[#f9faff] p-4 rounded-md shadow-md">
          <div className="relative border-0 rounded-lg px-2 py-2 innerBox bg-[#F9F9F999]">
            <p className=""><span dangerouslySetInnerHTML={{ __html: concept_of_operation?.response }} /></p>
          </div>
        </div>
      )
        : (
          <div className="flex flex-col rounded-t-lg bg-white m-2 shadow-md">
            <button className="flex items-center rounded-lg justify-between w-full py-3 px-4 text-left text-gray-800 font-semibold">
              <span className="text-[#4C6EF5]  inter-deamndName-style capitalize" dangerouslySetInnerHTML={{
                __html: demandTab?.text ? demandTab.text : "No description available."
              }} />
            </button>
            <div className="flex flex-row gap-2 flex-wrap items-center px-4 pb-3">
              <span className="text-[#9127AC] inter-style">Constraints:</span>
              {constraintsArray.map((item, index) => (
                <span
                  className="text-[#9127AC] inter-style p-2 rounded-lg"
                  style={{ backgroundColor: "#9329AE0A" }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      {sectionKey === "summary" ? (
        <div className="px-4 flex flex-col gap-4 mb-3 text-gray-700 bg-white m-2 shadow-md">
          <div className="flex flex-col gap-4">
            {responseValue ? (
              <div className=" flex flex-col border-0 px-2 py-2 ">
                <p className="text-[#1D1929] custom-answer-style ">
                  <span dangerouslySetInnerHTML={{ __html: demandTab?.text }} /> :
                </p>
              </div>
            ) : (
              ""
            )}
            <>
              <div className="py-2">
                <div className=" border-0 rounded-lg px-1 py-1 innerBox shadow-md">
                  <div className="bg-[#fff9f4] rounded-lg p-2">
                    {outerData && outerData.length && outerData?.filter((data) => data?.key === "summary")[0] && Object.keys(
                      outerData?.filter((data) => data?.key === "summary")[0] &&
                      outerData.length && outerData?.filter((data) => data?.key === "summary")[0]?.rating

                    )?.filter((category) => !category.endsWith("_comment")).map((category, index) => (
                      <>
                        <div
                          key={index}
                          className="flex flex-col md:flex-row w-full gap-4 mb-2"
                        >
                          <div className="w-full md:w-2/12 flex items-center">
                            <p
                              style={{ color: "#E05216" }}
                              className="inter-deamndName-style"
                            >
                              {category}
                            </p>
                          </div>
                          <div className="flex flex-row gap-1 w-full md:w-3/12 items-center  sm:justify-start md:justify-center">
                            {generateFibonacci().map((fibValue, idx) => {
                              //  console.log("rating", outerData.filter(
                              //   (data) => data?.key === "summary"
                              // )[0]?.rating[category]);
                              //  console.log( "ratingfibvalue", fibValue, )
                              const isEmpty = outerData.filter(
                                (data) => data?.key === "summary"
                              )[0]?.rating[category] === "";
                              const color = isEmpty
                                ? "#FFECD9"
                                : outerData.filter(
                                  (data) => data?.key === "summary"
                                )[0]?.rating[category] >= fibValue
                                  ? "#FFC284CC"
                                  : "#FFECD9";
                              const colorText = isEmpty
                                ? "#fff"
                                : outerData.filter(
                                  (data) => data?.key === "summary"
                                )[0]?.rating[category] >= fibValue
                                  ? "#C04612"
                                  : "#fff";
                              const showHover =
                                hoverCategory === category &&
                                hoverValue === fibValue;

                              return (
                                <div
                                  key={idx}
                                  onClick={() => {
                                    setChangedScore(category);
                                    handleRatingClickOuterData(
                                      "summary",
                                      category,
                                      fibValue
                                    )
                                    setTabFlag()
                                  }

                                  }
                                  onMouseEnter={() => {
                                    setHoverCategory(category);
                                    setHoverValue(fibValue);
                                  }}
                                  onMouseLeave={() => {
                                    if (
                                      hoverCategory === category &&
                                      hoverValue === fibValue
                                    ) {
                                      setHoverValue(null);
                                      setHoverCategory("");
                                    }
                                  }}
                                  className="relative flex items-center justify-center cursor-pointer transition-colors duration-300"
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    backgroundColor: color,
                                    borderRadius: "4px",
                                    color: colorText,
                                    fontSize: "12px",
                                    fontWeight: "500",
                                  }}
                                >
                                  {fibValue}
                                  {showHover && (
                                    <div
                                      className="absolute left-1/2 transform -translate-x-1/2 bg-[#333] text-white p-1 rounded text-xs whitespace-nowrap"
                                      style={{
                                        bottom: "120%",
                                      }}
                                    >
                                      {labels[fibValue]}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex flex-row w-full md:w-6/12 items-center justify-center">
                            <div className="relative border-0 rounded-lg  w-full   bg-white">

                              <AutoResizeTextarea
                                className="w-full textarea-no-border hide-scrollbar bg-white"
                                rows={1}

                                value={
                                  outerData.filter(
                                    (data) => data.key === "summary"
                                  )[0]?.comment?.[
                                  `${category === "Value For Money" ? "value_for_money" : category.toLowerCase()}_comment`
                                  ] || ""
                                }
                                onChange={(value) =>
                                  handleFeedbackChangeOuterData(
                                    "summary",
                                    category,
                                    value
                                  )
                                }
                                onDown={() => {
                                  setTabFlag()
                                }
                                }
                                placeholder="Type your feedback here..."
                                textAreaHeight="5px"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:justify-center md:justify-end p-2">
                    {Object.entries(labels).map(([key, value]) => (
                      <div>
                        <small
                          key={key}
                          className="inter-small-style capitalize "
                        >
                          {key} - {value}
                        </small>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 py-4">
                  <p className="text-[#4C6EF5] inter-deamndName-style capitalize">
                    Summary Comment
                  </p>{" "}
                  <div className="relative border-0 rounded-lg w-full  bg-[#F9F9F999]">
                    <AutoResizeTextarea
                      className="w-full textarea-no-border hide-scrollbar bg-[#F9F9F999]"
                      rows={3}
                      placeholder="Enter demand comment"
                      onDown={() => {
                        setTabFlag()
                      }
                      }
                      value={outerData && outerData.length > 0 && outerData?.find(data => data.key === 'summary')?.comment?.demand_comment || ""}
                      onChange={(value) => handleFeedbackChangeOuterData("summary", "demand", value)}
                    />
                  </div>
                </div>
              </div>{" "}
            </>
            <div className="flex space-x-2 justify-end">
              <div className="flex justify-center items-center">
                <button
                  className="bg-[#fffff] text-[#E7EBFC] py-1 px-3 rounded border-2 border-[#E7EBFC] text-xs flex"

                  onClick={() => { setFlagBackEvent(true) }}
                >
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="#E7EBFC"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                  &nbsp;&nbsp;Back
                </button>
              </div>
            </div>

          </div>
        </div>
      ) : sectionKey === "concept_of_operation" ? (
        <div className="px-4 flex flex-col gap-4 mb-3 text-gray-700 bg-white m-2 shadow-md">
          <div className="flex flex-col gap-4">
            {responseValue ? (
              <div className=" flex flex-col border-0 px-2 py-2 ">
                <p className="text-[#1D1929] custom-answer-style ">
                  <span dangerouslySetInnerHTML={{
                    __html: demandTab?.text
                  }} />
                </p>
              </div>
            ) : (
              ""
            )}

            <>
              <div className="py-2">
                <div className=" border-0 rounded-lg px-1 py-1 innerBox shadow-md">
                  <div className="bg-[#fff9f4] rounded-lg p-2">
                    {outerData && outerData.length > 0 && outerData?.filter((data) => data?.key === "cop")[0] && Object.keys(
                      outerData?.filter((data) => data?.key === "cop")[0]?.rating
                    )?.filter((category) => !category.endsWith("_comment")).map((category, index) => (
                      <>
                        <div
                          key={index}
                          className="flex flex-col md:flex-row w-full gap-4 mb-2"
                        >
                          <div className="w-full md:w-2/12 flex items-center">
                            <p
                              style={{ color: "#E05216" }}
                              className="inter-deamndName-style"
                            >
                              {category}
                            </p>
                          </div>
                          <div className="flex flex-row gap-1 w-full md:w-3/12 items-center  sm:justify-start md:justify-center">
                            {generateFibonacci().map((fibValue, idx) => {
                              const isEmpty = outerData.filter(
                                (data) => data?.key === "cop"
                              )[0]?.rating[category] === "";
                              const color = isEmpty
                                ? "#FFECD9"
                                : outerData.filter(
                                  (data) => data?.key === "cop"
                                )[0]?.rating[category] >= fibValue
                                  ? "#FFC284CC"
                                  : "#FFECD9";
                              const colorText = isEmpty
                                ? "#fff"
                                : outerData.filter(
                                  (data) => data?.key === "cop"
                                )[0]?.rating[category] >= fibValue
                                  ? "#C04612"
                                  : "#fff";
                              const showHover =
                                hoverCategory === category &&
                                hoverValue === fibValue;

                              return (
                                <div
                                  key={idx}
                                  onClick={() => {
                                    console.log("cop", category, fibValue);
                                    setChangedScore(category)
                                    handleRatingClickOuterData(
                                      "cop",
                                      category,
                                      fibValue
                                    );
                                    setTabFlag()
                                  }
                                  }
                                  onMouseEnter={() => {
                                    setHoverCategory(category);
                                    setHoverValue(fibValue);
                                  }}
                                  onMouseLeave={() => {
                                    if (
                                      hoverCategory === category &&
                                      hoverValue === fibValue
                                    ) {
                                      setHoverValue(null);
                                      setHoverCategory("");
                                    }
                                  }}
                                  className="relative flex items-center justify-center cursor-pointer transition-colors duration-300"
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    backgroundColor: color,
                                    borderRadius: "4px",
                                    color: colorText,
                                    fontSize: "12px",
                                    fontWeight: "500",
                                  }}
                                >
                                  {fibValue}
                                  {showHover && (
                                    <div
                                      className="absolute left-1/2 transform -translate-x-1/2 bg-[#333] text-white p-1 rounded text-xs whitespace-nowrap"
                                      style={{
                                        bottom: "120%",
                                      }}
                                    >
                                      {labels[fibValue]}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex flex-row w-full md:w-6/12 items-center justify-center">
                            <div className="relative border-0 rounded-lg  w-full bg-white">
                              <AutoResizeTextarea
                                className="w-full textarea-no-border hide-scrollbar bg-white"
                                rows={1}
                                value={
                                  outerData.filter(
                                    (data) => data.key === "cop"
                                  )[0].comment?.[
                                  `${category === "Value For Money" ? "value_for_money" : category.toLowerCase()}_comment`
                                  ] || ""
                                }

                                onChange={(value) =>
                                  handleFeedbackChangeOuterData(
                                    "cop",
                                    category,
                                    value
                                  )
                                }
                                placeholder="Type your feedback here..."
                                textAreaHeight="5px"
                                onDown={() => {
                                  setTabFlag()
                                }
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:justify-center md:justify-end p-2">
                    {Object.entries(labels).map(([key, value]) => (
                      <div>
                        <small
                          key={key}
                          className="inter-small-style capitalize "
                        >
                          {key} - {value}
                        </small>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2 py-4">
                  <p className="text-[#4C6EF5] inter-deamndName-style capitalize">
                    Concept of Operation Comment
                  </p>{" "}
                  <div className="relative border-0 rounded-lg w-full  bg-[#F9F9F999]">
                    <AutoResizeTextarea
                      className="w-full textarea-no-border hide-scrollbar bg-[#F9F9F999]"
                      rows={3}
                      placeholder="Enter demand comment"
                      onDown={() => {
                        setTabFlag()
                      }
                      }
                      value={outerData && outerData.length > 0 && outerData?.find(data => data.key === 'cop')?.comment?.demand_comment || ""}
                      onChange={(value) => handleFeedbackChangeOuterData("cop", "demand", value)}
                    />
                  </div>
                </div>
              </div>{" "}
            </>

            <div className="flex space-x-2 justify-end">
              <div className="flex justify-center items-center">
                <button
                  className="bg-[#ffffff] text-[#E7EBFC] py-1 px-3 rounded border-2 border-[#E7EBFC] text-xs flex"

                  onClick={() => { setFlagBackEvent(true) }}
                >
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="#E7EBFC"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                  &nbsp;&nbsp;Back
                </button>
              </div>
            </div>
          </div>
        </div>
      ) :
        (<div className="px-4 flex flex-col gap-4 mb-3 text-gray-700 bg-white m-2 shadow-md">
          <div className="flex flex-col gap-4">
            {responseValue ? (
              <div className=" flex flex-col border-0 px-2 py-2 ">
                <p className="text-[#666b72] custom-answer-style">
                  {<span dangerouslySetInnerHTML={{
                    __html: responseValue
                  }} /> || "No response available for this demand."}
                </p>
              </div>
            ) : (
              ""
            )}

            <>
              <div className="">
                <div className=" border-0 rounded-lg px-1 py-1 innerBox shadow-md">
                  <div className="bg-[#fff9f4] rounded-lg p-2">
                    {Object.keys(ratings).filter((category) => !category.endsWith("_comment")).map((category, index) => (
                      <>
                        <div
                          key={index}
                          className="flex flex-col md:flex-row w-full gap-4 mb-2"
                        >
                          <div className="w-full md:w-2/12 flex items-center">
                            <p
                              style={{ color: "#E05216" }}
                              className="inter-deamndName-style"
                            >
                              {category}
                            </p>
                          </div>
                          <div className="flex flex-row gap-1 w-full md:w-3/12 items-center  sm:justify-start md:justify-center">
                            {generateFibonacci().map((fibValue, idx) => {

                              const isEmpty = ratings[category] === ""
                              // console.log("rating", ratings[category]===0, "fibvalue", fibValue===0)
                              const color = isEmpty
                                ? "#FFECD9"
                                : ratings[category] >= fibValue || ratings[category]===-1&&fibValue==="NA" 
                                // : (ratings[category] > fibValue || ratings[category] == -1)
                                  ? "#FFC284CC"
                                  : "#FFECD9";
                              const colorText = isEmpty
                                ? "#fff"
                                // : ratings[category] >= fibValue
                                : ratings[category] >= fibValue || ratings[category]===-1&&fibValue==="NA" 

                                  ? "#C04612"
                                  : "#fff";

                              const showHover =
                                hoverCategory === category &&
                                hoverValue === fibValue;

                              return (
                                <div
                                  key={idx}
                                  onClick={() => {
                      
                                    setChangedScore(category)
                                    handleRatingClick(category, fibValue)
                                    setTabFlag()
                                  }
                                  }
                                  onMouseEnter={() => {
                                    setHoverCategory(category);
                                    setHoverValue(fibValue);
                                  }}
                                  onMouseLeave={() => {
                                    if (
                                      hoverCategory === category &&
                                      hoverValue === fibValue
                                    ) {
                                      setHoverValue(null);
                                      setHoverCategory("");
                                    }
                                  }}
                                  className="relative flex items-center justify-center cursor-pointer transition-colors duration-300"
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    backgroundColor: color,
                                    borderRadius: "4px",
                                    color: colorText,
                                    fontSize: "12px",
                                    fontWeight: "500",
                                  }}
                                >
                                  {fibValue}
                                  {showHover && (
                                    <div
                                      className="absolute left-1/2 transform -translate-x-1/2 bg-[#333] text-white p-1 rounded text-xs whitespace-nowrap"
                                      style={{
                                        bottom: "120%",
                                      }}
                                    >
                                      {labels[fibValue]}
                                    </div>
                                  )}
                                </div>

                              );
                            })}
                          </div>
                          <div className="flex flex-row w-full md:w-6/12 items-center justify-center">
                            <div className="relative border-0 rounded-lg w-full  bg-white">
                              <AutoResizeTextarea
                                className="w-full textarea-no-border hide-scrollbar bg-white"
                                rows={1}

                                value={
                                  judgeData.scores.find(
                                    (score) => score.response_id === responseId
                                  )?.[`${category === "Value For Money" ? "value_for_money" : category.toLowerCase()}_comment`] || ""

                                }
                                onChange={(value) =>
                                  handleFeedbackChange(category, value)
                                }
                                onDown={() => {
                                  setTabFlag()
                                }
                                }
                                placeholder="Type your feedback here..."
                                textAreaHeight="5px"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:justify-center md:justify-end p-2">
                    {Object.entries(labels).map(([key, value]) => (
                      <div>
                        <small
                          key={key}
                          className="inter-small-style capitalize "
                        >
                          {key} - {value}
                        </small>
                      </div>
                    ))}
                  </div>

                </div>
                <div className="flex flex-col gap-2 py-4">
                  <p className="text-[#4C6EF5] inter-deamndName-style capitalize">
                    Demand Comment
                  </p>
                  <div className="relative border-0 rounded-lg  w-full  bg-[#F9F9F999] ">
                    <AutoResizeTextarea
                      className="w-full textarea-no-border hide-scrollbar bg-[#F9F9F999]"
                      rows={3}
                      placeholder="Enter Demand Comment..."

                      value={judgeData.scores.find(
                        (score) => score.response_id === responseId
                      )?.demand_comment || ""}
                      onChange={(value) => handleFeedbackChange("demand", value)}

                      onDown={() => {
                        setTabFlag()
                      }
                      }
                    />
                  </div>
                </div>

              </div>{" "}
            </>
            <div className="flex space-x-2 justify-end">
              <div className="flex justify-center items-center">
                <button
                  className="bg-[#fffff] text-[#E7EBFC] py-1 px-3 rounded border-2 border-[#E7EBFC] text-xs flex"

                  onClick={() => { setFlagBackEvent(true) }}
                >
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="#E7EBFC"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                  &nbsp;&nbsp;Back
                </button>
              </div>
            </div>
          </div>
        </div>
        )}
    </div>
  );
};

export default JudgeDemand;
