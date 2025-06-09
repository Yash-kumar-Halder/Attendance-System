// components/Skeleton/SubjectCard.jsx
import React from 'react';

const SubjectCard = () => {
    return (
        <div className="w-full h-24 px-5 py-2 rounded-md bg-[var(--card)] animate-pulse">
            <div className="flex justify-between items-start">
                <div className="w-full">
                    <div className="flex justify-between pr-5 w-full">
                        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    </div>
                    <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
                    <div className="flex gap-2">
                        <div className="h-3 bg-gray-300 rounded w-1/6"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/6"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubjectCard;