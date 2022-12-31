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
let alphabet_uri = []

function Drawer() {

    const [tool, setTool] = React.useState('pen');
    const [lines, setLines] = React.useState([]);
    const [curr, setCurr] = React.useState(0); 
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
        cont()
    }
        
    function onShowAlert(type, text) {
        setAlert({
            type: type,
            text: text,
            show: true
        })
    }

    const cont = () => {
        console.log('here')
        setCurr((curr) => curr + 1) 
        const uri = stageRef.current.toDataURL();
        alphabet_uri.push(uri)
        clear()
    }

    const submit = () => {
        console.log(curr)
        if (lines.length == 0) {
            onShowAlert('warning', "submit empty? this letter will be styled in default Arial")
        } else cont()
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

    // handling submit
    const handleSubmit = (e) => {
        e.preventDefault()
        const uri = stageRef.current.toDataURL();
        const formData = uri;
        // const formData = new FormData(e.target);
        console.log(formData)

        const Upload = async() => {
        //   await fetch('/http://localhost:5000/drawer', {
        //     method: 'POST',
        //     body: formData
        //   }).then(resp => {
        //     // resp.json().then(data => {
        //     //     console.log(data)
        //     // })
        //     console.log(resp)
        //   })
            const config = {
                headers: {'Access-Control-Allow-Origin': '*'}
            };      
            console.log(config)
            axios.post("http://localhost:5000/drawer", {
                inputText: formData,
            }, config).then((res) => {
                console.log("res", res);
            }).catch((err) => {
                console.log(err);
            });
        }

        Upload();
    }

    // clearing canva
    const clear = () => {
        console.log(stageRef)
        console.log(stageRef.current)
        stageRef.current.clear()
        stageRef.current.clearCache() 
        setLines([])
        console.log("D:")
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
        <form onSubmit={handleSubmit}>
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
                <h1 className="submit" onClick={() => submit()}>submit</h1>
                <input name="submit" required type="submit" className="submit" value="submit" />
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