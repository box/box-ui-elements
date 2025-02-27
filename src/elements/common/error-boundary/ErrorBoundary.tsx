/**
 * @file Error Boundary
 * @author Box
 */

import * as React from 'react';
import noop from 'lodash/noop';
import { ERROR_CODE_UNEXPECTED_EXCEPTION, IS_ERROR_DISPLAYED } from '../../../constants';
import DefaultError from './DefaultError';
import type { ElementsXhrError, ElementsError } from '../../../common/types/api';
import type { ElementOrigin } from '../flowTypes';

interface Props {
    children: React.ReactElement;
    errorComponent: React.ComponentType<{ error: Error }>;
    errorOrigin: ElementOrigin;
    onError: (error: ElementsError) => void;
}

interface State {
    error?: Error;
}

class ErrorBoundary extends React.Component<Props, State> {
    static defaultProps = {
        errorComponent: DefaultError,
        onError: noop,
    };

    state: State = {};

    componentDidCatch(error: Error, info: Record<string, unknown>): void {
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
     * @param {Error} error - the error which occurred
     * @param {string} type - the error type to identify where the error occurred
     * @param {string} code - the error code to identify what error occurred
     * @param {Record<string, unknown>} contextInfo - additional information which may be useful for the consumer of the error
     * @return {void}
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

    render(): React.ReactElement {
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
