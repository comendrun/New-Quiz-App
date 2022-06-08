import React from "react";

export default function Answer(props) {
  return (
    <button onClick={()=>props.onClick()} className="qa--answer-button">
      {props.answer}
    </button>
  );
}
