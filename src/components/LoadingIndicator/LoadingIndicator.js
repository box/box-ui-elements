/**
 * @flow
 * @file Loading Indicator component
 * @author Box
 */

import React from 'react';
import './LoadingIndicator.scss';

type Props = {
    className: string,
    size: string
};

const LoadingIndicator = ({ className = '', size = 'default' }: Props) =>
    <div className={`buik-crawler ${className} buik-crawler-is-${size}`}>
        <div />
        <div />
        <div />
    </div>;

export default LoadingIndicator;
