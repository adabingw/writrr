import React, { useState, useRef } from "react";
import { Link } from 'react-router-dom';
import { Stage, Layer, Line, Rect } from 'react-konva';
import axios from "axios";
import Alert from "react-popup-alert"

import './utils/Button.css'
import './App.css'

let alphabet = [
    'A', 'a', 'B', 'b', 'C', 'c', 'D', 'd', 'E', 'e', 'F', 'f', 'G', 'g', 'H', 'h', 'I', 'i', 'J', 'j', 
    'K', 'k', 'L', 'l', 'M', 'm', 'N', 'n', 'O', 'o', 'P', 'p', 'Q', 'q', 'R', 'r', 'S', 's', 'T', 't',
    'U', 'u', 'V', 'v', 'W', 'w', 'X', 'x', 'Y', 'y', 'Z', 'z'
]

function Drawer() {

    const [tool, setTool] = useState('pen');
    const [lines, setLines] = useState([]);
    const [curr, setCurr] = useState(0); 
    const [end, setEnd] = useState(false); 
    const [alert, setAlert] = useState({
        type: 'error',
        text: ' ',
        show: false
    })

    const isDrawing = useRef(false);
    const stageRef = useRef(null); 

    function onCloseAlert() {
        setAlert({ type: '', text: '', show: false })
        // setCurr((curr) => curr + 1) 
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
        if (end) return (
            <Link to="/writer">
                <input name="submit" required type="submit" className="submit" value="submit" />
            </Link>
        )
        else return <h1 className="submit" onClick={(e) => handleSubmit(e)}>next</h1>
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (lines.length == 0) onShowAlert('warning', "please write something")
        else {
            if (curr == 51) setEnd(true)
            else setCurr((curr) => curr + 1) 
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
            <Link to="/"> <h1 className="head_sub">WRITRR</h1> </Link>
            <h1 className="subheader">write for letter '{alphabet[curr]}'</h1>
            <Stage
                width={window.innerWidth/4}
                height={window.innerHeight/3}
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
                <Rect
                    x={0}
                    y={0}
                    width={window.innerWidth}
                    height={window.innerHeight}
                    fill="white"
                    shadowBlur={0}   />
                {lines.map((line, i) => (
                    <Line
                        key={i}
                        points={line.points}
                        stroke="#000000"
                        strokeWidth={15}
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
                btnText={'close'}
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