/**
 * @flow
 * @file Error Boundary
 * @author Box
 */

import * as React from 'react';
import noop from 'lodash/noop';
import { ERROR_CODE_UNEXPECTED_EXCEPTION, IS_ERROR_DISPLAYED } from '../../constants';
import { enhanceErrorForLogging } from '../../util/error';

type Props = {
    children?: any,
    component: any,
    errorType: ErrorTypes,
    forwardedRef: ?React.ElementRef<any>,
    children: React.Element<*>,
} & ErrorContextProps;

type State = {
    error?: Error,
};

let onError: Function = noop; // closure to keep track of top level onError prop

class ErrorBoundary extends React.Component<Props, State> {
    props: Props;

    state: State = {};

    static defaultProps = {
        component: null,
        onError: noop,
    };

    constructor(props: Props) {
        super(props);
        this.updateOnError(props.onError);
    }

    componentDidUpdate() {
        this.updateOnError(this.props.onError);
    }

    componentDidCatch(error: Error, info: Object): void {
        this.setState({ error }, () => {
            this.props.onError(error, this.props.errorType, ERROR_CODE_UNEXPECTED_EXCEPTION, {
                ...info,
                [IS_ERROR_DISPLAYED]: true,
            });
        });
    }

    updateOnError(onErrorProp: ?Function) {
        // We only want to update onError if it is the top level onError.
        // For example if component tree is ContentPreview -> ContentSidebar, onError should be the
        // onError prop passed to ContentPreview, and should be used for ContentSidebar
        if (typeof onErrorProp === 'function') {
            onError = onErrorProp;
        }
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
    handleError = (e: Error, type: ErrorTypes, code: string, contextInfo: Object = {}) => {
        const enhancedError: ElementsError = enhanceErrorForLogging(e, type, code, contextInfo);

        onError(enhancedError);
    };

    render() {
        const { children, component, ...rest } = this.props;

        if (this.state.error) {
            return component;
        }

        return React.cloneElement(this.props.children, {
            ...rest,
            ref: this.props.forwardedRef,
            onError: this.handleError,
        });
    }
}

export default ErrorBoundary;
