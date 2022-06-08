import React from 'react';

import './ProgressBar.scss';

export interface ProgressBarProps {
    className?: string;
    /** A number between 0 and 100 inclusive representing the width percentage */
    progress?: number;
}

const ProgressBar = ({ className = '', progress = 0 }: ProgressBarProps) => {
    const style = {
        width: `${progress}%`,
    };

    return (
        <div className="progress-bar-container">
            <div className={`progress-bar ${className}`} style={style} />
        </div>
    );
};

export default ProgressBar;
