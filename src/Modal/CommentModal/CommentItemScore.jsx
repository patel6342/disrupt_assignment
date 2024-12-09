import React from 'react'

export const CommentItemScore = (props) => {
    const {req, demand, judge, score, onclick, identifier, content} = props;

    console.log("jjrscore", score);
    return (
        <div 
        onClick={() => onclick(identifier)}
        className={`${demand?"":"text-center"} rounded border-2 border-[#aaaaaa] my-[15px] p-[10px] transition-all durration-300 hover:scale-105 cursor-pointer`}
        >
            safsfaf
        </div>
        )
}