import * as React from 'react';
import classnames from 'classnames';
import LoadingIndicator, { LoadingIndicatorSize } from './LoadingIndicator';
import './LoadingIndicatorWrapper.scss';

export enum LoadingIndicatorWrapperPosition {
    CENTER = 'center',
    TOP = 'top',
}
export interface LoadingIndicatorWrapperProps {
    /** The content to wrap */
    children: React.ReactNode;
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

const LoadingIndicatorWrapper = ({
    children,
    className = '',
    crawlerPosition = LoadingIndicatorWrapperPosition.CENTER,
    crawlerSize = LoadingIndicatorSize.DEFAULT,
    isLoading = false,
    hideContent = false,
    ...rest
}: LoadingIndicatorWrapperProps) => {
    const crawlerPositionClassName = classnames(
        'loading-indicator-veil',
        {
            'is-with-top-crawler': crawlerPosition === LoadingIndicatorWrapperPosition.TOP,
            'is-with-center-crawler': crawlerPosition === LoadingIndicatorWrapperPosition.CENTER,
        },
        hideContent ? 'hide-content' : 'blur-content',
    );
    return (
        <div className={`loading-indicator-wrapper ${className}`} {...rest}>
            {children}
            {isLoading && (
                <div className={crawlerPositionClassName}>
                    <LoadingIndicator size={crawlerSize} />
                </div>
            )}
        </div>
    );
};

export default LoadingIndicatorWrapper;
