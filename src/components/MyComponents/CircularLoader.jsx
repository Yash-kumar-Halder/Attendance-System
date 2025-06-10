import React from 'react';
import '../../Styles/Animations/Loading.css'; // Make sure this path is correct based on your file structure

const CircularLoader = () => {
    return (
        <div className='w-full h-screen absolute top-0 left-0 flex items-center justify-center bg-[#0000001e] ' >
            <svg
                width="100"
                height="100"
                viewBox="0 0 100 100"
                className="morphing-loader scale-50 "
            >
                <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="var(--white-9)"
                    strokeWidth="5"
                    strokeLinecap="round"
                />
            </svg>
        </div>
    );
};

export default CircularLoader;