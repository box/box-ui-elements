import * as React from 'react';
import noop from 'lodash/noop';
import DefaultError, { ErrorComponentProps } from './DefaultError';
import { ERROR_CODE_UNEXPECTED_EXCEPTION, IS_ERROR_DISPLAYED } from '../../../constants';
import type { ElementsXhrError, ElementsError } from '../../../common/types/api';
import type { ElementOrigin } from '../flowTypes';

export interface ErrorBoundaryProps {
    children: React.ReactElement;
    errorComponent: React.ComponentType<ErrorComponentProps>;
    errorOrigin: ElementOrigin;
    onError: (error: ElementsError) => void;
}

type State = {
    error?: Error;
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, State> {
    static defaultProps = {
        errorComponent: DefaultError,
        onError: noop,
    };

    state: State = {};

    componentDidCatch(error: Error, info: React.ErrorInfo): void {
        this.setState({ error }, () => {
            this.handleError(
                error,
                ERROR_CODE_UNEXPECTED_EXCEPTION,
                {
                    ...info,
                },
                this.props.errorOrigin,
            );
        });
    }

    /**
     * Formats the error and emits it to the top level onError prop
     *
     * @param error - the error which occurred
     * @param code - the error code to identify what error occurred
     * @param contextInfo - additional information which may be useful for the consumer of the error
     * @param origin - the origin of the error
     * @return void
     */
    handleError = (
        error: ElementsXhrError | Error,
        code: string,
        contextInfo: Record<string, unknown> = {},
        origin: ElementOrigin = this.props.errorOrigin,
    ): void => {
        if (!error || !code || !origin) {
            return;
        }

        const elementsError: ElementsError = {
            type: 'error',
            code,
            message: error.message,
            origin,
            context_info: {
                [IS_ERROR_DISPLAYED]: true,
                ...contextInfo,
            },
        };

        this.props.onError(elementsError);
    };

    render() {
        const { children, errorComponent: ErrorComponent, ...rest } = this.props;
        const { error } = this.state;
        if (error) {
            return <ErrorComponent error={error} />;
        }

        return React.cloneElement(children, {
            ...rest,
            onError: this.handleError,
        });
    }
}

export default ErrorBoundary;
