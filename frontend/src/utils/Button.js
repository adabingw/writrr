import './Button.css';
import React from "react";

function Button(props) {

  console.log(props.type)

  return (
    <div className="button">
        <h1 className={props.type} onClick={props.onClick}>{props.text}</h1>
    </div>
  );
}

export default Button;