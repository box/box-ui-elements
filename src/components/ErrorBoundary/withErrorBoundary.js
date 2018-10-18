/**
 * @flow
 * @file withErrorBoundary HOC
 * @author Box
 */

import * as React from 'react';
import ErrorBoundary from './ErrorBoundary';

const withErrorBoundary = (WrappedComponent: React.ComponentType<any>) => {
    // $FlowFixMe doesn't know about forwardRef (https://github.com/facebook/flow/issues/6103)
    return React.forwardRef((props: Object, ref: React.Ref<any>) => (
        <ErrorBoundary>
            <WrappedComponent {...props} ref={ref} />
        </ErrorBoundary>
    ));
};

export default withErrorBoundary;
