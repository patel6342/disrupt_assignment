import React from "react";
import { cn } from "../../lib/utils";
import { useState } from "react";
import IconButton from "../ui/IconButton";
import { Expand } from "lucide-react";
import { ChevronDown } from "lucide-react";
import ScoreList from "./ScoreList";
import useQuestionStore from "../../store/questions/questionStore";

const LevelScoreContent = ({ level_id }) => {
  const [expanded, setExpanded] = useState(false);
  const levels = useQuestionStore()?.data_set;
  return (
    <div
      className={cn(
        "border-[1px] border-slate-200 my-2 rounded-lg transition-all duration-300",
        expanded ? "shadow-xl" : ""
      )}
    >
      <div className="flex items-center justify-between px-4 py-2">
        <h2 className="text-lg font-medium text-gray-700">
          {levels?.[level_id]?.title}
        </h2>
        <IconButton onClick={() => setExpanded((v) => !v)}>
          <ChevronDown
            className={cn(
              "transition-all duration-200",
              expanded ? "rotate-180" : ""
            )}
          />
        </IconButton>
      </div>
      <div
        className={cn(
          "grid transition-all duration-300 grid-rows-[0fr]",
          expanded ? "grid-rows-[1fr]" : ""
        )}
      >
        <div className="px-4 overflow-hidden">
          <ScoreList level_id={level_id} />
        </div>
      </div>
    </div>
  );
};

export default LevelScoreContent;
