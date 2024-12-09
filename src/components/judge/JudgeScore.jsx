import React from "react";
import { MoveRight } from "lucide-react";
import { cn, getPercent } from "../../lib/utils";
import Button from "../ui/Button";
import Requirements from "../instructor/Requirements";
import { useState } from "react";
import IconButton from "../ui/IconButton";
import { ChevronDown } from "lucide-react";

const MarkingWithRemark = ({
  title,
  mark = 0,
  on_score,
  remark,
  on_remark,
}) => {
  return (
    <div className="flex items-center gap-4">
      <Button
        className={cn("text-sm", mark ? "bg-green-600 text-white" : "")}
        onClick={on_score}
      >
        {title || "-"}
      </Button>
      <div className="flex-grow">
        <input
          type="text"
          placeholder="Remark..."
          className="px-4 outline-none border-[2px] rounded-lg text-gray-800 w-full"
          value={remark}
          onChange={(e) => on_remark(e.target.value)}
        />
      </div>
    </div>
  );
};

const Score = ({
  level_id,
  id,
  background,
  deliverable,
  timeline,
  response,
  requirements,
  score,
  total,
  on_score,
}) => {
  // const handleScore = ({ r1, r2, r3 }) => {
  //   if (r1) {
  //     on_score({ r1: { mark: score?.r1?.mark ? 0 : r1 } });
  //   } else if (r2) {
  //     on_score({ r2: { mark: score?.r2?.mark ? 0 : r2 } });
  //   } else if (r3) {
  //     on_score({ r3: { mark: score?.r3?.mark ? 0 : r3 } });
  //   }
  // };
  // const handleRemark = ({ r1, r2, r3 }) => {
  //   if (r1 != null) {
  //     on_score({
  //       r1: {
  //         remark: r1,
  //       },
  //     });
  //   } else if (r2 != null) {
  //     on_score({
  //       r2: {
  //         remark: r2,
  //       },
  //     });
  //   } else if (r3 != null) {
  //     on_score({
  //       r3: {
  //         remark: r3,
  //       },
  //     });
  //   }
  // };

  const [showRequirement, setShowRequirement] = useState(false);

  return (
    <div className="bg-white border-[1px] border-gray-100 drop-shadow-md px-5 py-2 w-full rounded-lg hover:drop-shadow-xl transition-all duration-300 select-none">
      {/* <h2 className="text-lg font-medium text-slate-600">{question}</h2> */}

      <div className="flex items-center gap-4 text-red-800">
        Requirements
        <IconButton
          className={"w-6 h-6"}
          onClick={() => setShowRequirement((v) => !v)}
        >
          <ChevronDown
            size={15}
            className={cn(
              "transition-all duration-200",
              showRequirement ? "rotate-180" : "rotate-0"
            )}
          />
        </IconButton>
      </div>

      <div
        className={cn(
          "grid transition-all duration-300 grid-rows-[0fr]",
          showRequirement ? "grid-rows-[1fr]" : ""
        )}
      >
        <div className="overflow-hidden">
          <div className="px-4 py-2 mt-4 overflow-auto text-red-800 rounded-lg bg-red-50 max-h-96">
            <Requirements
              level_id={level_id}
              question_id={id}
              requirements={requirements}
              background={background}
              deliverable={deliverable}
              timeline={timeline}
              is_score_mode={true}
              on_score={on_score}
            />
          </div>
        </div>
      </div>
      {/* 
      <div className="px-2 py-2 mt-4 border-t-2">
        <div className="text-lg font-medium text-violet-600">
          <span>
            Scoring{"  "}
            <span className="px-4 py-1 text-xl bg-purple-100 rounded-xl">
              {(score?.r1?.mark || 0) +
                (score?.r2?.mark || 0) +
                (score?.r3?.mark || 0)}
              /{total}
            </span>
          </span>

          <div className="flex flex-col gap-2 mt-3">
            <MarkingWithRemark
              title="R1 (Mark 2)"
              mark={score?.r1?.mark}
              on_score={() => handleScore({ r1: 2 })}
              remark={score?.r1?.remark}
              on_remark={(txt) => handleRemark({ r1: txt })}
            />
            <MarkingWithRemark
              title="R2 (Mark 2)"
              mark={score?.r2?.mark}
              on_score={() => handleScore({ r2: 2 })}
              remark={score?.r2?.remark}
              on_remark={(txt) => handleRemark({ r2: txt })}
            />
            <MarkingWithRemark
              title="R3 (Mark 1)"
              mark={score?.r3?.mark}
              on_score={() => handleScore({ r3: 1 })}
              remark={score?.r3?.remark}
              on_remark={(txt) => handleRemark({ r3: txt })}
            />
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Score;
