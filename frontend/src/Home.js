import React, { useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
  } from 'react-router-dom';

import Button from './utils/Button.js'

function Home() {
    return (
        <div className="App">    
            <h1 className="head">WRITRR</h1>
            <p className="description">create your own writing</p>
            <div className="menuRow">
                <Link to="/drawer"> <Button text="get started" type="home_button" /> </Link>
                <Link to="/demo"> <Button text="see a demo" type="home_button" /> </Link>
            </div>
            <Link to="/writer"> <p className="description"> shortcut to writer </p> </Link>
        </div>
    );
}

export default Home;