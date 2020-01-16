import * as React from 'react';
import './Crawler.scss';

export enum LoadingIndicatorSize {
    SMALL = 'small',
    MEDIUM = 'medium',
    LARGE = 'large',
    DEFAULT = 'default',
}

export interface LoadingIndicatorProps {
    className?: string;
    size?: LoadingIndicatorSize;
}

const LoadingIndicator = ({ className = '', size = LoadingIndicatorSize.DEFAULT }: LoadingIndicatorProps) => (
    <div className={`crawler ${className} is-${size}`}>
        <div />
        <div />
        <div />
    </div>
);

export default LoadingIndicator;
