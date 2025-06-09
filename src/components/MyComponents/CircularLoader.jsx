import React from 'react';
import '../../Styles/Animations/Loading.css'; // Make sure this path is correct based on your file structure

const CircularLoader = () => {


    return (
       <div className='w-full h-screen absolute top-0 left-0 flex items-center justify-center bg-[#0000001a]' >
            <svg
                width="80"
                height="80"
                viewBox="0 0 100 100"
                className="morphing-loader scale-50 "
            >
                <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="white"
                    strokeWidth="8"
                    strokeLinecap="round"
                />
            </svg>
       </div>
      );
};

export default CircularLoader;