import * as React from 'react';
import useMediaQuery from './useMediaQuery';
import type { MediaShape } from './types';

function withMediaQuery<Props extends object>(
    WrappedComponent: React.ComponentType<Props>,
): React.ComponentType<Record<string, unknown>> {
    return (props: Record<string, unknown>) => {
        const mediaProps: MediaShape = useMediaQuery();

        return <WrappedComponent {...({ ...props, ...mediaProps } as Props)} />;
    };
}

export default withMediaQuery;
