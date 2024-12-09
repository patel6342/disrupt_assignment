import React from "react";
import Button from "../ui/Button";
import { cn } from "../../lib/utils";

const MarkingWithRemark = ({
  title,
  mark = 0,
  on_score,
  remark,
  on_remark,
  disabled = false,
}) => {
  return (
    <div className="flex items-center gap-4">
      <span>{title}</span>
      <div>
        <input
          disabled={disabled}
          type="range"
          max={5}
          value={mark}
          min={0}
          onChange={(e) => on_score(Number(e.target.value))}
        />
        <span className="pl-5">{mark}</span>
      </div>
      {/* <Button
        disabled={disabled}
        className={cn("text-sm", mark ? "bg-green-600 text-white" : "")}
        onClick={on_score}
      >
        {title || "-"}
      </Button> */}
      {/* <div className="flex-grow">
        <input
          disabled={disabled}
          type="text"
          placeholder="Remark..."
          className="px-4 outline-none border-[2px] rounded-lg text-gray-800 w-full"
          value={remark || ""}
          onChange={(e) => on_remark(e.target.value)}
        />
      </div> */}
    </div>
  );
};

const ScoreInfo = () => {
  return (
    <div className="max-w-[80%] mx-auto border-[1px] px-7 py-2 rounded-lg">
      <pre className="text-sm font-normal text-gray-400">
        <div>0 - No Evidence</div>
        <div>1 - Marginally original</div>
        <div>2 - Somewhat</div>

        <div>3 - Moderate orignal</div>

        <div>4 - Highly original and feasible</div>

        <div>5 - Most original/feasible</div>
      </pre>
    </div>
  );
};

const Scoring = ({
  score,
  requirement_id,
  id,
  on_score,
  is_score_view_mode,
}) => {
  const handleScore = ({ r1, r2, r3 }) => {
    if (r1 != undefined) {
      on_score({
        requirement_id,
        id,
        score: { r1: { mark: r1 } },
      });
    } else if (r2 != undefined) {
      on_score({
        requirement_id,
        id,
        score: { r2: { mark: r2 } },
      });
    } else if (r3 != undefined) {
      on_score({
        requirement_id,
        id,
        score: { r3: { mark: r3 } },
      });
    }
  };
  const handleRemark = ({ r1, r2, r3 }) => {
    if (r1 != null) {
      on_score({
        requirement_id,
        id,
        score: {
          r1: {
            remark: r1,
          },
        },
      });
    } else if (r2 != null) {
      on_score({
        requirement_id,
        id,
        score: {
          r2: {
            remark: r2,
          },
        },
      });
    } else if (r3 != null) {
      on_score({
        requirement_id,
        id,
        score: {
          r3: {
            remark: r3,
          },
        },
      });
    }
  };

  const total = 15;

  return (
    <div className="px-2 py-2 mt-4 bg-white rounded-lg shadow-lg border-[1px]">
      <div className="text-lg font-medium text-violet-600">
        <div className="flex items-center gap-2">
          <span>Scoring{"  "}</span>
          <span className="px-4 py-0 text-xl bg-purple-100 rounded-xl">
            {(score?.r1?.mark || 0) +
              (score?.r2?.mark || 0) +
              (score?.r3?.mark || 0)}
            /{total}
            {/* {score?.r1?.mark || 0}/5 */}
          </span>
        </div>

        <div className="flex flex-col gap-2 mt-3">
          <MarkingWithRemark
            disabled={is_score_view_mode}
            title="Originality"
            mark={score?.r1?.mark}
            on_score={(mark) => handleScore({ r1: mark })}
            remark={score?.r1?.remark}
            on_remark={(txt) => handleRemark({ r1: txt })}
          />

          <MarkingWithRemark
            disabled={is_score_view_mode}
            title="Feasibility"
            mark={score?.r2?.mark}
            on_score={(mark) => handleScore({ r2: mark })}
            remark={score?.r2?.remark}
            on_remark={(txt) => handleRemark({ r2: txt })}
          />

          <MarkingWithRemark
            disabled={is_score_view_mode}
            title="Consistency"
            mark={score?.r3?.mark}
            on_score={(mark) => handleScore({ r3: mark })}
            remark={score?.r3?.remark}
            on_remark={(txt) => handleRemark({ r3: txt })}
          />
          {/* <MarkingWithRemark
            disabled={is_score_view_mode}
            title="R2 (Mark 2)"
            mark={score?.r2?.mark}
            on_score={() => handleScore({ r2: 2 })}
            remark={score?.r2?.remark}
            on_remark={(txt) => handleRemark({ r2: txt })}
          />
          <MarkingWithRemark
            disabled={is_score_view_mode}
            title="R3 (Mark 1)"
            mark={score?.r3?.mark}
            on_score={() => handleScore({ r3: 1 })}
            remark={score?.r3?.remark}
            on_remark={(txt) => handleRemark({ r3: txt })}
          /> */}

          <ScoreInfo />
        </div>
      </div>
    </div>
  );
};

export default Scoring;
