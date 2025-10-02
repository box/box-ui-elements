// @flow
import * as React from 'react';

type Props = {
    children: React.Node,
    component: React.ComponentType<any>,
};

type State = {
    error: ?Error,
};

class AsyncError extends React.Component<Props, State> {
    static defaultProps = {
        component: () => null,
    };

    static getDerivedStateFromError(error: Error) {
        return { error };
    }

    state = { error: null };

    render() {
        const { children, component: ErrorComponent } = this.props;
        const { error } = this.state;

        return error ? <ErrorComponent error={error} /> : children;
    }
}

export default AsyncError;
