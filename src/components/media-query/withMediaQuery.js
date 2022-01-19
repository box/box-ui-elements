// @flow

import * as React from 'react';
import useMediaQuery from './useMediaQuery';
import type { MediaShape } from './types';

type PropsShape = {
    children: React.Node,
};

function withMediaQuery<Props: PropsShape>(WrappedComponent: React.ComponentType<any>): React.ComponentType<any> {
    return ({ children, ...rest }: Props) => {
        const mediaProps: MediaShape = useMediaQuery();

        return (
            <WrappedComponent {...rest} {...mediaProps}>
                {children}
            </WrappedComponent>
        );
    };
}

export default withMediaQuery;
