import * as React from 'react';
import './Crawler.scss';
export declare enum LoadingIndicatorSize {
    SMALL = "small",
    MEDIUM = "medium",
    LARGE = "large",
    DEFAULT = "default"
}
export interface LoadingIndicatorProps {
    /** Custom class for the loading indicator */
    className?: string;
    /** Size of the loading indicator - small, medium, large, default */
    size?: LoadingIndicatorSize;
}
declare const LoadingIndicator: ({ className, size }: LoadingIndicatorProps) => React.JSX.Element;
export default LoadingIndicator;
