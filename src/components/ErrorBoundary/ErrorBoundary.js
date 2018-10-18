/**
 * @flow
 * @file Error Boundary
 * @author Box
 */

import React from 'react';
import noop from 'lodash/noop';

type Props = {
    children?: any,
    component: any,
    onError: Function,
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

    componentDidCatch(error: Error): void {
        this.setState({ error }, () => {
            this.props.onError(error);
        });
    }

    render() {
        if (this.state.error) {
            return this.props.component;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
