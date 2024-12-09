import React, { useRef, useEffect } from 'react';
import './autoResizeStyle.css';
import { Editor } from 'primereact/editor';

import { useAuth } from "../../routes/AuthContext";
import { faL } from '@fortawesome/free-solid-svg-icons';


const AutoResizeTextarea = ({ value, onChange, onDown, placeholder, className, rows = 1, disabled, wordCount = 0, controls=true, textAreaHeight = "130px" }) => {
  const {role} = useAuth();
  if(role==="judge")
    controls=false;

  const editorRef = useRef(null);


  const toolbarTemplate = (
    <span className="ql-formats">
      <button className="ql-bold" aria-label="Bold"></button>
      <button className="ql-italic" aria-label="Italic"></button>
      <button className="ql-underline" aria-label="Underline"></button>
      <button className="ql-list" value="ordered" aria-label="List"></button>
      <button className="ql-list" value="bullet" aria-label="Bullets"></button>
      <select className="ql-color" aria-label="Colors"></select>
      <select className="ql-background" aria-label="Background"></select>
      <select className="ql-align" aria-label="Align"></select>
    </span>
  );
  return (
    <>
  
        <Editor
          ref={editorRef}
          value = {value}
          onKeyDown={(e) =>{ 
            onDown(e)}}

          onTextChange={(e)=> onChange(e.htmlValue)}
          placeholder={placeholder}
          disabled={disabled}
        style={{ height: controls || role === "participant" ?"130px":"auto", width: '100%', border: "none", boxShadow: "1px 1px 6px 0px #0000001A inset", fontSize: "15px" }}
          // className={`textarea-auto-resize text-3xl ${className}`}
        {
        ...(controls
          ? { headerTemplate: toolbarTemplate } // If `controls` is true, use `headerTemplate`
          : { showHeader: false }               // If `controls` is false, set `showHeader` to false
        )
        }
        />
        
      {wordCount !== 0 && <div className="text-end text-xs p-2 text-gray-300">
        word count: {wordCount}
      </div>}
    
    </>
  );
};

export default AutoResizeTextarea;
