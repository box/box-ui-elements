/**
 * @flow
 * @file Error Boundary
 * @author Box
 */

import * as React from 'react';
import noop from 'lodash/noop';
import { ERROR_CODE_UNEXPECTED_EXCEPTION } from '../../constants';

type Props = {
    children?: any,
    component: any,
    errorOrigin: ErrorOrigins,
    forwardedRef: ?React.ElementRef<any>,
    children: React.Element<*>,
    onError: (error: ElementsError) => void,
};

type State = {
    error?: Error,
};

class ErrorBoundary extends React.Component<Props, State> {
    props: Props;

    state: State = {};

    static defaultProps = {
        component: null,
        onError: noop,
    };

    componentDidCatch(error: Error, info: Object): void {
        this.setState({ error }, () => {
            this.handleError(
                error,
                ERROR_CODE_UNEXPECTED_EXCEPTION,
                true,
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
        error: ElementsXhrError,
        code: string,
        isErrorDisplayed: boolean = false,
        contextInfo: Object = {},
        origin: ErrorOrigins = this.props.errorOrigin,
    ) => {
        const elementsError: ElementsError = {
            type: 'error',
            code,
            message: error.message,
            origin,
            context_info: {
                ...contextInfo,
                isErrorDisplayed,
            },
        };

        this.props.onError(elementsError);
    };

    render() {
        const { children, component, forwardedRef, ...rest } = this.props;

        if (this.state.error) {
            return component;
        }

        return React.cloneElement(children, {
            ...rest,
            ref: forwardedRef,
            onError: this.handleError,
        });
    }
}

// $FlowFixMe doesn't know about forwardRef (https://github.com/facebook/flow/issues/6103)
export default React.forwardRef((props: Object, ref: React.Ref<any>) => (
    <ErrorBoundary {...props} forwardedRef={ref} />
));
