/**
 * @file withErrorBoundary HOC which adds error boundaries as well as error logging
 * @author Box
 */

import * as React from 'react';
import DefaultError from './DefaultError';
import ErrorBoundary from './ErrorBoundary';
import { ElementOrigin } from '../flowTypes';

// Using generic type parameter for component props
const withErrorBoundary =
    <P extends object>(
        errorOrigin: ElementOrigin,
        errorComponent: React.ComponentType<{ error: Error }> = DefaultError,
    ) =>
    (WrappedComponent: React.ComponentType<P & { ref?: React.Ref<unknown> }>) =>
        React.forwardRef<unknown, P>((props: P, ref) => (
            <ErrorBoundary errorComponent={errorComponent} errorOrigin={errorOrigin} {...props}>
                <WrappedComponent {...props} ref={ref} />
            </ErrorBoundary>
        ));

export default withErrorBoundary;
