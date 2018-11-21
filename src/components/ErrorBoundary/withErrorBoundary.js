/**
 * @flow
 * @file withErrorBoundary HOC which adds error boundaries as well as error logging
 * @author Box
 */

import * as React from 'react';
import ErrorBoundary from './ErrorBoundary';

const withErrorBoundary = (errorOrigin: ErrorOrigins) => (WrappedComponent: React.ComponentType<any>) =>
    // $FlowFixMe doesn't know about forwardRef (https://github.com/facebook/flow/issues/6103)
    React.forwardRef((props: Object, ref: React.Ref<any>) => (
        <ErrorBoundary {...props} errorOrigin={errorOrigin}>
            <WrappedComponent ref={ref} />
        </ErrorBoundary>
    ));

export default withErrorBoundary;
