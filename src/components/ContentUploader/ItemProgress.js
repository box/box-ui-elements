/**
 * @flow
 * @file Upload item progress component
 */

import React from 'react';
import ProgressBar from './ProgressBar';
import './ItemProgress.scss';

type Props = {
    progress: number,
};

const ItemProgress = ({ progress }: Props) => (
    <div className="bcu-item-progress">
        <ProgressBar percent={progress} />
        <div className="bcu-progress-label">{progress}%</div>
    </div>
);

export default ItemProgress;
