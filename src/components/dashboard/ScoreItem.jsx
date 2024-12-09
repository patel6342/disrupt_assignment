// import React from "react";
// import { MoveRight } from "lucide-react";
// import { cn, getPercent } from "../../lib/utils";

// // const ScoreItem = ({ question, id, response, score, total }) => {
// const ScoreItem = ({ level_title, question_count = 0, score, total }) => {
//   const perc = getPercent(total, score);
//   return (
//     <div className="bg-white border-[1px] border-gray-100 drop-shadow-md px-5 py-2 w-full rounded-lg hover:drop-shadow-xl transition-all duration-300 select-none">
//       <h2 className="text-lg text-slate-600">{level_title}</h2>

//       {/* --------------- */}
//       <div className="flex items-center justify-between">
//         <div className="text-sm text-slate-400">
//           Total Questions: {question_count}
//         </div>
//         <div className="flex items-center gap-2 text-lg font-medium text-violet-600">
//           <span>Score</span>
//           <div
//             className={cn(
//               "text-white px-4 rounded-full",
//               perc < 20
//                 ? "bg-red-500"
//                 : perc < 50
//                 ? "bg-yellow-600"
//                 : perc < 75
//                 ? "bg-blue-600"
//                 : "bg-green-600"
//             )}
//           >
//             {score}/{total}
//           </div>
//         </div>
//       </div>

//       {/* ------------------ */}
//     </div>
//   );
// };

// export default ScoreItem;

import React from "react";
import { MoveRight } from "lucide-react";
import { cn, getPercent } from "../../lib/utils";
import Requirements from "../instructor/Requirements";
import { useState } from "react";
import IconButton from "../ui/IconButton";
import { ChevronDown } from "lucide-react";

const MarkingWithRemark = ({ title = "", mark = 0, remark = "" }) => {
  return (
    <div className="flex items-start gap-4">
      <div
        className={cn(
          "text-sm px-2 py-1 rounded-lg min-w-max text-white",
          mark ? "bg-green-600 " : "bg-red-600"
        )}
      >
        {title || "-"}
      </div>
      {remark && (
        <div className="flex-grow">
          <div className="w-full px-4 rounded-lg outline-none bg-slate-50 border-[1px]">
            <span className="mr-2 font-medium">Remark:</span>

            {remark}
          </div>
        </div>
      )}
    </div>
  );
};

const ScoreItem = ({
  level_id,
  background,
  deliverable,
  timeline,
  id,
  requirements,
  response,
  score,
  total,
}) => {
  const perc = getPercent(
    total,
    (score?.r1?.mark || 0) + (score?.r2?.mark || 0) + (score?.r3?.mark || 0)
  );

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
              requirements={requirements}
              is_score_view_mode={true}
              background={background}
              deliverable={deliverable}
              timeline={timeline}
              level_id={level_id}
              question_id={id}
            />
          </div>
        </div>
      </div>

      {/* <div className="flex gap-4 mt-4">
        <div className="mt-2">
          <MoveRight size={16} />
        </div>
        <div className="text-gray-600 text-md">{response}</div>
      </div>
      <div className="gap-2 px-2 py-1 mt-4 border-t-2">
        <div className="flex gap-4 text-lg font-medium item-center text-slate-600">
          <span>Score </span>
          <div
            className={cn(
              "text-white px-4 rounded-full",
              perc < 20
                ? "bg-red-500"
                : perc < 50
                ? "bg-yellow-600"
                : perc < 75
                ? "bg-blue-600"
                : "bg-green-600"
            )}
          >
            {(score?.r1?.mark || 0) +
              (score?.r2?.mark || 0) +
              (score?.r3?.mark || 0)}
            /{total}
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-4">
          {(score?.r1?.mark || score?.r1?.remark) && (
            <MarkingWithRemark
              title="R1 (Mark 2)"
              remark={score?.r1?.remark}
              mark={score?.r1?.mark}
            />
          )}
          {(score?.r2?.mark || score?.r2?.remark) && (
            <MarkingWithRemark
              title="R2 (Mark 2)"
              remark={score?.r2?.remark}
              mark={score?.r2?.mark}
            />
          )}
          {(score?.r3?.mark || score?.r3?.remark) && (
            <MarkingWithRemark
              title="R3 (Mark 1)"
              remark={score?.r3?.remark}
              mark={score?.r3?.mark}
            />
          )}
        </div>
      </div> */}
    </div>
  );
};

export default ScoreItem;
