// @flow

import * as React from 'react';
import useMedia from './useMedia';
import type { MediaShape } from './types';

type PropsShape = {
    children: React.Node,
};

function withMedia<Props: PropsShape>(WrappedComponent: React.ComponentType<any>): React.ComponentType<any> {
    return ({ children, ...rest }: Props) => {
        const mediaProps: MediaShape = useMedia();

        return (
            <WrappedComponent {...rest} {...mediaProps}>
                {children}
            </WrappedComponent>
        );
    };
}

export default withMedia;
