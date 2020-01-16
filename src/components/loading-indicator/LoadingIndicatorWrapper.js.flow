// @flow
import * as React from 'react';
import classnames from 'classnames';

import LoadingIndicator from './LoadingIndicator';
import './LoadingIndicatorWrapper.scss';

const CENTER: 'center' = 'center';
const TOP: 'top' = 'top';

type Position = typeof CENTER | typeof TOP;

type Props = {
    children: React.Node,
    className?: string,
    crawlerPosition?: Position,
    crawlerSize?: 'small' | 'medium' | 'large' | 'default',
    hideContent?: boolean,
    isLoading?: boolean,
};

const LoadingIndicatorWrapper = ({
    children,
    className = '',
    crawlerPosition = CENTER,
    crawlerSize = 'default',
    isLoading = false,
    hideContent = false,
    ...rest
}: Props) => {
    const crawlerPositionClassName = classnames(
        'loading-indicator-veil',
        {
            'is-with-top-crawler': crawlerPosition === TOP,
            'is-with-center-crawler': crawlerPosition === CENTER,
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
