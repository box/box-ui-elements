import * as React from 'react';
import './ProgressBar.scss';

type Props = {
    percent?: number;
};

const ProgressBar = ({ percent }: Props) => {
    const clampedPercentage = Math.max(0, Math.min(100, percent || 0));

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
