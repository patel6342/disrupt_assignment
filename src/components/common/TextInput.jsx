import React from "react";
import { cn } from "../../lib/utils";

const TextInput = ({
  value = "",
  onChange = () => {},
  placeholder = "Type here...",
  rows = 2,
  className,
  disabled = false,
  ...rest
}) => {
  return (
    <textarea
      rows={rows}
      disabled={disabled}
      // autoFocus
      className={cn(
        "w-full px-2 py-1 rounded-lg outline-none text-slate-800 min-h-10 max-h-40 shadow-inner border-[1px] border-slate-300",
        className
      )}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      {...rest}
    />
  );
};

export default TextInput;
