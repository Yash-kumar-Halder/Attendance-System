import React, { useEffect, useRef, useState } from 'react';

const CircleProgressBar = ({
    total = null,
    present = null,
    color = 'text-orange-500',
    baseColor = 'text-gray-300',
    label = 'Present',
}) => {
    const progressRef = useRef(null);
    const radius = 16;
    const circumference = 2 * Math.PI * radius;
    const duration = 500;

    const targetValue = total > 0 ? Math.round((present / total) * 100) : 0;

    const [animatedValue, setAnimatedValue] = useState(0);
    const [animatedTotal, setAnimatedTotal] = useState(0);
    const [animatedPresent, setAnimatedPresent] = useState(0);

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    useEffect(() => {
        const circle = progressRef.current;
        if (!circle || !total || !present) return;

        const targetOffset = circumference * (1 - targetValue / 100);
        const initialOffset = parseFloat(circle.style.strokeDashoffset) || circumference;
        const offsetDiff = targetOffset - initialOffset;

        let start = null;

        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutCubic(progress);

            // Animate circle
            circle.style.strokeDashoffset = initialOffset + offsetDiff * eased;

            // Animate numbers
            setAnimatedValue(Math.round(targetValue * eased));
            setAnimatedTotal(Math.round(total * eased));
            setAnimatedPresent(Math.round(present * eased));

            if (progress < 1) requestAnimationFrame(animate);
        };

        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = initialOffset;

        requestAnimationFrame(animate);
    }, [targetValue, total, present, circumference]);

    return (
        <div className="w-full h-full flex gap-[8%] items-center justify-center px-2 py-2">
            <div className="flex flex-col items-center justify-center">
                <div className="text-xl font-semibold text-[var(--white-7)] mb-2">Attendance</div>
                <div className="relative w-40 h-40">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <circle
                            className={baseColor}
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="transparent"
                            r={radius}
                            cx="18"
                            cy="18"
                        />
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
                                transition: 'stroke-dashoffset 0.3s ease-out',
                            }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className={`text-lg font-bold ${color}`}>{animatedValue}%</p>
                        <p className="text-xs text-gray-400">{label}</p>
                    </div>
                </div>
            </div>
            <div className="min-h-[50%] flex flex-col items-center justify-center text-xl font-bold pl-8 border-l border-gray-300">
                <p className="text-teal-400">Total : {total === null ? '0' : animatedTotal}</p>
                <p className="text-green-400">Present : {present === null ? '0' : animatedPresent}</p>
            </div>
        </div>
    );
};

export default CircleProgressBar;
