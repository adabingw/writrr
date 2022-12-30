import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';

import Drawer from './Drawer.js'
import Home from './Home.js'
import Error from './Error.js'

import Button from './utils/Button.js'

import "./App.css";

function App() {
    // usestate for setting a javascript
    // object for storing and using data
    const [text, setText] = useState("o");
  
    // Using useEffect for single rendering
    useEffect(() => {
        // Using fetch to fetch the api from 
        // flask server it will be redirected to proxy

        fetch('/index', {
            method: 'GET',
            mode:'no-cors',
            dataType: 'json'
        }).then(r => r.text())
          .then(r => {
              console.log(r)
              console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaa")
              setText(r)
          })
          .catch(err => console.log(err))
    }, []);
  
    return (
        <div className="App">    
            <Router>              
              <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/drawer" element={<Drawer />} />
                <Route exact_path="/*" element={<Error />} />
              </Routes>
            </Router>
        </div>
    );
}
  
export default App;