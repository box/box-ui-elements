import * as React from 'react';
import './ProgressBar.scss';

export interface ProgressBarProps {
    percent?: number;
}

const ProgressBar = ({ percent = 0 }: ProgressBarProps) => {
    const clampedPercentage = Math.max(0, Math.min(100, percent));

    const containerStyle = {
        transitionDelay: clampedPercentage > 0 && clampedPercentage < 100 ? '0' : '0.4s',
    };

    return (
        <div className="bcu-progress-container" style={containerStyle}>
            <div className="bcu-progress" role="progressbar" style={{ width: `${clampedPercentage}%` }} />
        </div>
    );
};

export default ProgressBar;
