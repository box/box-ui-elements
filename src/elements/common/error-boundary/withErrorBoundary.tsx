import * as React from 'react';
import DefaultError, { DefaultErrorProps } from './DefaultError';
import ErrorBoundary from './ErrorBoundary';
import type { ElementOrigin } from '../flowTypes';

type ComponentWithRef<P, T = unknown> = React.ComponentType<P & React.RefAttributes<T>>;

const withErrorBoundary =
    (errorOrigin: ElementOrigin, errorComponent: React.ComponentType<DefaultErrorProps> = DefaultError) =>
    <P extends object, T = unknown>(WrappedComponent: ComponentWithRef<P, T>) => {
        const WithErrorBoundaryComponent = React.forwardRef<T, P>((props: P, ref: React.Ref<T>) => (
            <ErrorBoundary
                errorComponent={errorComponent}
                errorOrigin={errorOrigin}
                {...(props as Record<string, unknown>)}
            >
                <WrappedComponent {...props} ref={ref} />
            </ErrorBoundary>
        ));

        return WithErrorBoundaryComponent;
    };

export default withErrorBoundary;
