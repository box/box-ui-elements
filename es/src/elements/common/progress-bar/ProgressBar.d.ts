import React from 'react';
import './ProgressBar.scss';
export interface ProgressBarProps {
    percent: number;
}
declare const ProgressBar: ({ percent: initialPercent }: ProgressBarProps) => React.JSX.Element;
export default ProgressBar;
