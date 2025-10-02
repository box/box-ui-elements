import * as React from 'react';
import { LoadingIndicatorSize } from './LoadingIndicator';
import './LoadingIndicatorWrapper.scss';
export declare enum LoadingIndicatorWrapperPosition {
    CENTER = "center",
    TOP = "top"
}
export interface LoadingIndicatorWrapperProps {
    /** The content to wrap */
    children: React.ReactChild;
    /** Custom class for the loading indicator wrapper */
    className?: string;
    /** Location of the loading indicator - top, center */
    crawlerPosition?: LoadingIndicatorWrapperPosition;
    /** Size of the loading indicator - small, medium, large, default */
    crawlerSize?: LoadingIndicatorSize;
    /** Makes the background white hiding the content */
    hideContent?: boolean;
    /** Indicates whether loading indicator should show */
    isLoading?: boolean;
}
declare const LoadingIndicatorWrapper: ({ children, className, crawlerPosition, crawlerSize, isLoading, hideContent, ...rest }: LoadingIndicatorWrapperProps) => React.JSX.Element;
export default LoadingIndicatorWrapper;
