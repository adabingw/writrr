import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import { Stage, Layer, Line, Text } from 'react-konva';
import axios from "axios";
import Alert from "react-popup-alert"

import Button from './utils/Button.js'
import './utils/Button.css'

import './App.css'

let alphabet = [
    'A', 'a', 'B', 'b', 'C', 'c', 'D', 'd', 'E', 'e', 'F', 'f', 'G', 'g', 'H', 'h', 'I', 'i', 'J', 'j', 
    'K', 'k', 'L', 'l', 'M', 'm', 'N', 'n', 'O', 'o', 'P', 'p', 'Q', 'q', 'R', 'r', 'S', 's', 'W', 'w',
    'X', 'x', 'Y', 'y', 'Z', 'z'
]

function Drawer() {

    const [tool, setTool] = React.useState('pen');
    const [lines, setLines] = React.useState([]);
    const [curr, setCurr] = React.useState(0); 
    const [end, setEnd] = React.useState(false); 
    const [alert, setAlert] = React.useState({
        type: 'error',
        text: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        show: false
    })

    const isDrawing = React.useRef(false);
    const stageRef = React.useRef(null); 

    function onCloseAlert() {
        setAlert({
            type: '',
            text: '',
            show: false
        })
        setCurr((curr) => curr + 1) 
        clear()
    }
        
    function onShowAlert(type, text) {
        setAlert({
            type: type,
            text: text,
            show: true
        })
    }

    window.addEventListener("beforeunload", (ev) => {  
        ev.preventDefault();
        console.log("clean")
        let type = "clean"
        axios.post("http://localhost:5000/drawer", {
            inputText: type,
            symbol: alphabet[curr]
        }).then((res) => {
            console.log("res", res);
        }).catch((err) => {
            console.log(err);
        });
    });

    function getButton() {
        if (end) return <input name="submit" required type="submit" className="submit" value="submit" />
        else return <h1 className="submit" onClick={(e) => handleSubmit(e)}>next</h1>
    }

    // function to download the png drawn on the canva
    const downloadURI = (uri, name) => {
        var link = document.createElement('a');
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // handling download
    const handleExport = () => {
        const uri = stageRef.current.toDataURL();
        console.log(uri);
        downloadURI(uri, 'stage.png');
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        if (lines.length == 0) {
            onShowAlert('warning', "submit empty? this letter will be styled in default Arial")
        } else {
            if (curr == 44) {
                setEnd(true)
            } else setCurr((curr) => curr + 1) 
            const uri = stageRef.current.toDataURL();
            const formData = uri;

            clear()

            const Upload = async() => {
                axios.post("http://localhost:5000/drawer", {
                    inputText: formData,
                    symbol: alphabet[curr]
                }).then((res) => {
                    console.log("res", res);
                }).catch((err) => {
                    console.log(err);
                });
            }

            Upload();
        }
    }

    // handling submit
    const submitAll = (e) => {
        e.preventDefault()
        console.log("owie")
    }

    // clearing canva
    const clear = () => {
        console.log(stageRef)
        console.log(stageRef.current)
        stageRef.current.clear()
        stageRef.current.clearCache() 
        setLines([])
    };

    // touch screen events 
    const handleTouchStart = (e) => {
        isDrawing.current = true; 
        const pos = e.target.getStage().getPointerPosition(); 
        setLines([...lines, { tool, points: [pos.x, pos.y] }])
    };

    const handleTouchMove = (e) => {
        if (!isDrawing.current) return; 
        const stage = e.target.getStage(); 
        const point = stage.getPointerPosition(); 
        let lastLine = lines[lines.length - 1]; 

        lastLine.points = lastLine.points.concat([point.x, point.y]); 

        lines.splice(lines.length - 1, 1, lastLine); 
        setLines(lines.concat()); 
    };

    const handleTouchEnd = (e) => {
        isDrawing.current = false; 
    };

    // mouse events
    const handleMouseDown = (e) => {
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        setLines([...lines, { tool, points: [pos.x, pos.y] }]);
    };

    const handleMouseMove = (e) => {
        // no drawing - skipping
        if (!isDrawing.current) return;
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        let lastLine = lines[lines.length - 1];

        // add point
        lastLine.points = lastLine.points.concat([point.x, point.y]);

        // replace last
        lines.splice(lines.length - 1, 1, lastLine);
        setLines(lines.concat());
    };

    const handleMouseUp = () => {
        isDrawing.current = false;
    };

    return (
        <form onSubmit={submitAll}>
            <div className="stage_div">
            <h1>write for letter '{alphabet[curr]}'</h1>
            <Stage
                width={window.innerWidth/2}
                height={window.innerHeight/2}
                onMouseDown={handleMouseDown}
                onMousemove={handleMouseMove}
                onMouseup={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove} 
                onTouchEnd={handleTouchEnd}
                id="stage"
                ref={stageRef}
                className="stage" >
                <Layer>
                {lines.map((line, i) => (
                    <Line
                        key={i}
                        points={line.points}
                        stroke="#000000"
                        strokeWidth={4}
                        tension={0.5}
                        lineCap="round"
                        lineJoin="round"
                        globalCompositeOperation={
                            line.tool === 'eraser' ? 'destination-out' : 'source-over'
                        }
                    />
                ))}
                </Layer>
            </Stage>
            <div className="menu">
                <h1 className="submit" onClick={() => clear()}>clear</h1>
                {/* <Button text="clear" type="draw" /> */}
                <select
                    className="select"
                    value={tool}
                    onChange={(e) => {
                        setTool(e.target.value);
                    }} >
                    <option value="pen">Pen</option>
                    <option value="eraser">Eraser</option>
                </select>
                {getButton()}
            </div>
            <Alert
                header={'woah - '}
                btnText={'yeah ok'}
                text={alert.text}
                type={alert.type}
                show={alert.show}
                onClosePress={onCloseAlert}
                pressCloseOnOutsideClick={true}
                showBorderBottom={false}
                alertStyles={{}}
                headerStyles={{}}
                textStyles={{}}
                buttonStyles={{}} />
            </div>
        </form>
    );
}

export default Drawer; 