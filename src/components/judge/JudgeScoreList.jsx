import React from "react";
import JudgeScore from "./JudgeScore";
import useQuestionStore from "../../store/questions/questionStore";
import useResponseStore from "../../store/responses/responseStore";
import { getRandomNumber } from "../../lib/utils";

const JudgeScoreList = ({ level_id }) => {
  const resStore = useResponseStore();
  const levels = useQuestionStore()?.data_set;
  const questions = levels?.[level_id]?.questions;

  const handleScore = ({
    level_id,
    question_id,
    requirement_id,
    id,
    score,
  }) => {
    resStore?.update_response_score({
      level_id,
      question_id,
      score: score,
      requirement_id,
      id,
    });
  };

  return (
    <div className="flex flex-col gap-4 py-5 overflow-auto max-h-[85vh] w-full">
      {questions?.map((qn, i) => (
        <JudgeScore
          key={`score-item-${i}`}
          level_id={level_id}
          {...qn}
          response={resStore?.responses?.[level_id]?.[qn?.id]}
          score={resStore?.responses?.[level_id]?.[qn?.id]?.score}
          total={5}
          on_score={({ score, requirement_id, id }) =>
            handleScore({
              level_id,
              question_id: qn?.id,
              requirement_id,
              id,
              score,
            })
          }
        />
      ))}
    </div>
  );
};

export default JudgeScoreList;
