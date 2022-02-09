// @flow

import * as React from 'react';
import classNames from 'classnames';
import useMediaQuery from './useMediaQuery';
import type { MediaShape } from './types';
import { CLASS_IS_MEDIUM, CLASS_IS_SMALL, SIZE_MEDIUM, SIZE_SMALL } from '../../constants';

type PropsShape = {
    children: React.Node,
    className: string,
};

function withMediaQuery<Props: PropsShape>(WrappedComponent: React.ComponentType<any>): React.ComponentType<any> {
    const MediaQueryComponent = ({ children, className, ...rest }: Props) => {
        const mediaProps: MediaShape = useMediaQuery();

        const isSmall = mediaProps.size === SIZE_SMALL;
        const isMedium = mediaProps.size === SIZE_MEDIUM;

        const styleClassName = classNames(
            {
                [CLASS_IS_SMALL]: isSmall,
                [CLASS_IS_MEDIUM]: isMedium,
            },
            className,
        );
        return (
            <WrappedComponent className={styleClassName} {...rest} {...mediaProps}>
                {children}
            </WrappedComponent>
        );
    };

    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    MediaQueryComponent.displayName = `WithMediaQuery(${displayName})`;
    return MediaQueryComponent;
}

export default withMediaQuery;
