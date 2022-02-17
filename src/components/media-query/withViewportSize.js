// @flow

import * as React from 'react';
import { useViewportSize, VIEWPORT_SIZE_DEFAULT_DEBOUNCE } from './useViewportSize';

type PropsShape = {
    children: React.Node,
    debounce?: number,
};

function withViewportSize<Props: PropsShape>(WrappedComponent: React.ComponentType<any>): React.ComponentType<any> {
    function ComponentWithViewportSize({ debounce = VIEWPORT_SIZE_DEFAULT_DEBOUNCE, children, ...rest }: Props) {
        const viewportProps = useViewportSize(debounce);
        return (
            <WrappedComponent {...rest} {...viewportProps}>
                {children}
            </WrappedComponent>
        );
    }

    const wrappedName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    ComponentWithViewportSize.displayName = wrappedName;

    return ComponentWithViewportSize;
}

export default withViewportSize;
