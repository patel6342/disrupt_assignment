import React from "react";
import ScoreItem from "./ScoreItem";
import useQuestionStore from "../../store/questions/questionStore";
import useResponseStore from "../../store/responses/responseStore";

const ScoreList = ({ level_id }) => {
  const levels = useQuestionStore()?.data_set;
  const questions = levels?.[level_id]?.questions;
  const res = useResponseStore().responses;

  return (
    <div className="flex flex-col gap-2 py-5">
      {questions?.map((qn, i) => (
        <ScoreItem
          key={`score-item-${i}`}
          {...qn}
          level_id={level_id}
          response={res?.[level_id]?.[qn?.id]?.response}
          score={res?.[level_id]?.[qn?.id]?.score}
          total={5}
        />
      ))}
    </div>
  );
};

export default ScoreList;
