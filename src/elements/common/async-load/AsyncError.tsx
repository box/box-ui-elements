import * as React from 'react';

interface Props {
    children: React.ReactNode;
    component: React.ComponentType<{ error: Error }>;
}

interface State {
    error: Error | null;
}

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
