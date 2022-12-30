import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import Button from './utils/Button.js'

import './App.css'

function Error() {
    return (
        <div>
            <h1>ERROR!!!!1!1!!!!!1!</h1>
            <p>pls refresh ur page :D</p>
        </div>
    );
}

export default Error; 