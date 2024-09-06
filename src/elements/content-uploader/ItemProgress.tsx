import * as React from 'react';
import ProgressBar from './ProgressBar';
import './ItemProgress.scss';

export interface ItemProgressProps {
    progress: number;
}

const ItemProgress = ({ progress }: ItemProgressProps) => (
    <div className="bcu-ItemProgress">
        <ProgressBar percent={progress} />
        <div className="bcu-ItemProgress-label">{progress}%</div>
    </div>
);

export default ItemProgress;
