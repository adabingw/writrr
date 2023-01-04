import React, { useState, useEffect, useRef } from "react";
import Alert from "react-popup-alert"
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from 'react-router-dom';
import axios from "axios";

import Button from './utils/Button.js'
import './utils/Button.css'

import './App.css'


function Writer() {

    const src = require("./images/white.png")
    const [input, setInput] = useState("")
    const [source, setSource] = useState(src)

    const inputCheck = (e) => {
        console.log(e.target.value);
        if (e.target.value.length <= 35) setInput(e.target.value)
    };

    useEffect(() => {
        checkSource()
    })

    const checkSource = () => {
        try{
            const src = require("./images/result.png")
            setSource(src)
        }
        catch(err){
            console.log("cannot find result")
        }
    }

    async function handleSubmit (e) {
        e.preventDefault()
        const Upload = async() => {
            axios.post("http://localhost:5000/writer", {
                text: input 
            }).then((res) => {
                console.log("res", res);
            }).catch((err) => {
                console.log(err);
            });
        }

        await Upload();
        checkSource()
    }

    function download(url) {
        const a = document.createElement('a')
        a.href = url
        
        a.download = "writrr_download"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    return (
        <div className="generate_div">
            <Link to="/"> <h1 className="head_sub">WRITRR</h1> </Link>
            <input type="textarea" rows="1" className="generator" onChange={(e) => inputCheck(e)} value={input} />
            <h1 className="submit" onClick={(e) => handleSubmit(e)}>generate!</h1>
            <img src={source} alt="huh" className="writing" />
            <h1 className="submit" onClick={() => download(source)}>download</h1>
        </div>
    )
}

export default Writer