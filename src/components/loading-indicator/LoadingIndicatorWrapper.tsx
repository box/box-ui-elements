import * as React from 'react';
import classnames from 'classnames';
import LoadingIndicator, { LoadingIndicatorSize } from './LoadingIndicator';
import './LoadingIndicatorWrapper.scss';

export enum LoadingIndicatorWrapperPosition {
    CENTER = 'center',
    TOP = 'top',
}
export interface LoadingIndicatorWrapperProps {
    children: React.ReactNode;
    className: string;
    crawlerPosition: LoadingIndicatorWrapperPosition;
    crawlerSize: LoadingIndicatorSize;
    hideContent: boolean;
    isLoading: boolean;
}

const LoadingIndicatorWrapper = ({
    children,
    className,
    crawlerPosition,
    crawlerSize,
    isLoading,
    hideContent,
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

LoadingIndicatorWrapper.defaultProps = {
    className: '',
    crawlerPosition: LoadingIndicatorWrapperPosition.CENTER,
    crawlerSize: LoadingIndicatorSize.DEFAULT,
    isLoading: false,
    hideContent: false,
};

export default LoadingIndicatorWrapper;
