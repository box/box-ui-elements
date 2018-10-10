/**
 * @flow
 * @file withErrorBoundary HOC
 * @author Box
 */

import * as React from 'react';
import ErrorBoundary from './ErrorBoundary';

type Props = {
    onComponentError?: Function,
};

const withErrorBoundary = (WrappedComponent: React.ComponentType<any>) => {
    // $FlowFixMe doesn't know about forwardRef (https://github.com/facebook/flow/issues/6103)
    return React.forwardRef(
        ({ onComponentError, ...rest }: Props, ref: React.Ref<any>) => (
            <ErrorBoundary onError={onComponentError}>
                <WrappedComponent {...rest} ref={ref} />
            </ErrorBoundary>
        ),
    );
};

export default withErrorBoundary;
