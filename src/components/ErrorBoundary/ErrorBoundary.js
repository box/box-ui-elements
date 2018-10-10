/**
 * @flow
 * @file Error Boundary
 * @author Box
 */

import React from 'react';
import noop from 'lodash/noop';

type Props = {
    children?: any,
    errorComponent: any,
    onError: Function,
    render?: Function,
};

type State = {
    error?: Error,
};

class ErrorBoundary extends React.Component<Props, State> {
    props: Props;
    state: State = {};

    static defaultProps = {
        errorComponent: null,
        onError: noop,
    };

    componentDidCatch(error: Error): void {
        this.setState({ error }, () => {
            this.props.onError(error);
        });
    }

    render() {
        const { errorComponent, render }: Props = this.props;
        const { error }: State = this.state;

        if (render) {
            return render({ error });
        }

        if (error) {
            return errorComponent;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
