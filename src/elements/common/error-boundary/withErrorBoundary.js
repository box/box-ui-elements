/**
 * @flow
 * @file withErrorBoundary HOC which adds error boundaries as well as error logging
 * @author Box
 */

import * as React from 'react';
import DefaultError from './DefaultError';
import ErrorBoundary from './ErrorBoundary';

const withErrorBoundary = (errorOrigin: ElementOrigin, errorComponent: React.ComponentType<any> = DefaultError) => (
    WrappedComponent: React.ComponentType<any>,
) =>
    React.forwardRef<Object, React.Ref<any>>((props: Object, ref: React.Ref<any>) => (
        <ErrorBoundary errorOrigin={errorOrigin} errorComponent={errorComponent} {...props}>
            <WrappedComponent ref={ref} />
        </ErrorBoundary>
    ));

export default withErrorBoundary;
