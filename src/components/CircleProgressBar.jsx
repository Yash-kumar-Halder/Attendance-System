import React, { useEffect, useRef } from 'react';

const CircleProgressBar = ({
    value = 70,
    color = 'text-orange-500',
    baseColor = 'text-gray-300',
    label = 'Present',
}) => {
    const progressRef = useRef(null);
    const radius = 16;
    const circumference = 2 * Math.PI * radius;
    const duration = 700;

    useEffect(() => {
        const circle = progressRef.current;
        if (!circle) return;

        const targetOffset = circumference * (1 - value / 100);
        const initialOffset = parseFloat(circle.style.strokeDashoffset) || circumference;
        const diff = targetOffset - initialOffset;

        let start = null;

        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            circle.style.strokeDashoffset = initialOffset + diff * progress;

            if (progress < 1) requestAnimationFrame(animate);
        };

        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        if (!circle.style.strokeDashoffset) {
            circle.style.strokeDashoffset = circumference;
        }

        requestAnimationFrame(animate);
    }, [value]);
      

    return (
        <div className="w-full h-full flex gap-[8%] items-center justify-center px-2 py-2 ">
            <div className='flex flex-col items-center justify-center' >
                <div className="text-xl font-semibold text-[var(--white-7)] mb-2">Attendance</div>
                <div className="relative w-40 h-40">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        {/* Base Circle - full ring */}
                        <circle
                            className={baseColor}
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="transparent"
                            r={radius}
                            cx="18"
                            cy="18"
                        />
                        {/* Progress Circle - overlay on top */}
                        <circle
                            ref={progressRef}
                            className={color}
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="transparent"
                            r={radius}
                            cx="18"
                            cy="18"
                            style={{
                                strokeDasharray: `${circumference} ${circumference}`,
                                strokeDashoffset: circumference,
                                transition: 'stroke-dashoffset 1s ease-in-out',
                            }}
                        />
                    </svg>

                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className={`text-lg font-bold ${color}`}>{value}%</p>
                        <p className="text-xs text-gray-400">{label}</p>
                    </div>
                </div>
            </div>
            <div className='min-h-[50%] flex flex-col items-center justify-center text-xl font-bold pl-8 border-l border-gray-300' >
                <p className='text-teal-400' >Total - 80</p>
                <p className='text-green-400'>Present - 60</p>
            </div>
        </div>
    );
};

export default CircleProgressBar;
