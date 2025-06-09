import React from 'react';
import '../../Styles/Animations/Loading.css'; // Make sure this path is correct based on your file structure

const CircularLoader = ({ show, size = 60, strokeWidth = 8, color = '#ffffff' }) => {
    if (!show) {
        return null;
    }

    const radius = size / 2 - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;
    const dashArray = `${circumference} ${circumference}`;
    const dashOffset = circumference * 0.25; // Start at the top

    const style = {
        width: size,
        height: size,
    };

    const circleStyle = {
        stroke: color,
        strokeWidth: strokeWidth,
        strokeDasharray: dashArray,
        strokeDashoffset: dashOffset,
        strokeLinecap: 'round',
        animation: 'circular-rotate 1.5s linear infinite',
        fill: 'transparent',
        r: radius,
        cx: size / 2,
        cy: size / 2,
    };

    return (
        <div className="circular-loader-container">
            <svg style={style} viewBox={`0 0 ${size} ${size}`}>
                <circle style={circleStyle} />
            </svg>
        </div>
    );
};

export default CircularLoader;