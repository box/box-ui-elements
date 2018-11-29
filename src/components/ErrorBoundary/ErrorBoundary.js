/**
 * @flow
 * @file Error Boundary
 * @author Box
 */

import * as React from 'react';
import noop from 'lodash/noop';
import { ERROR_CODE_UNEXPECTED_EXCEPTION, IS_ERROR_DISPLAYED } from '../../constants';
import DefaultError from './DefaultError';

type Props = {
    ErrorComponent: React.Element,
    errorOrigin: ErrorOrigins,
    children: React.ChildrenArray<React.Element<any>>,
    onError: (error: ElementsError) => void,
};

type State = {
    error?: Error,
};

class ErrorBoundary extends React.Component<Props, State> {
    props: Props;

    state: State = {};

    static defaultProps = {
        ErrorComponent: DefaultError,
        onError: noop,
    };

    componentDidCatch(error: Error, info: Object): void {
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
     * @param {Error} e - the error which occured
     * @param {string} type - the error type to identify where the error occured
     * @param {string} code - the error code to identify what error occured
     * @param {Object} contextInfo - additional information which may be useful for the consumer of the error
     * @return {void}
     */
    handleError = (
        error: ElementsXhrError | Error,
        code: string,
        contextInfo: Object = {},
        origin: ErrorOrigins = this.props.errorOrigin,
    ) => {
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
        const { children, ErrorComponent, ...rest } = this.props;
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
