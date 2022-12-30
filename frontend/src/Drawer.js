import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import { Stage, Layer, Line, Text } from 'react-konva';

import Button from './utils/Button.js'

import './App.css'

function Drawer() {

    const [tool, setTool] = React.useState('pen');
    const [lines, setLines] = React.useState([]);
    const isDrawing = React.useRef(false);

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
        <div className="stage_div">
        <Stage
            width={window.innerWidth/2}
            height={window.innerHeight/2}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
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
            <Button text="clear" type="draw" />
            <select
                className="select"
                value={tool}
                onChange={(e) => {
                setTool(e.target.value);
                }} >
                <option value="pen">Pen</option>
                <option value="eraser">Eraser</option>
            </select>
        </div>
        </div>
    );
}

export default Drawer; 