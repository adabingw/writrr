import './Button.css';
import React from "react";

function Button(props) {

  return (
    <div className="button">
        <h1 className={props.type}>{props.text}</h1>
    </div>
  );
}

export default Button;