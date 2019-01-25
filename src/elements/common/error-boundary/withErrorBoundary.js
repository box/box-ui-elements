/**
 * @flow
 * @file withErrorBoundary HOC which adds error boundaries as well as error logging
 * @author Box
 */

import * as React from 'react';
import DefaultError from './DefaultError';
import ErrorBoundary from './ErrorBoundary';

const withErrorBoundary = (errorOrigin: ElementOrigin, errorComponent: React.Element = DefaultError) => (
    WrappedComponent: React.ComponentType<any>,
) =>
    // $FlowFixMe doesn't know about forwardRef (https://github.com/facebook/flow/issues/6103)
    React.forwardRef((props: Object, ref: React.Ref<any>) => (
        <ErrorBoundary errorOrigin={errorOrigin} errorComponent={errorComponent} {...props}>
            <WrappedComponent ref={ref} />
        </ErrorBoundary>
    ));

export default withErrorBoundary;
