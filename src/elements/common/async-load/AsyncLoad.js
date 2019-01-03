// @flow
import * as React from 'react';
import retry from 'utils/retry';

type Props = {
    loader: () => Promise<any>,
    fallback?: React.Element<any>,
    errorComponent?: React.ComponentType<any>,
};

type State = {
    error: ?Error,
};

const NullComponent = () => null;

const AsyncLoad = (asyncProps: Props) => {
    const LazyComponent = React.lazy(() => retry(() => asyncProps.loader()));

    return class extends React.Component<Object, State> {
        state = {
            error: null,
        };

        static getDerivedStateFromError(error: Error) {
            return {
                error,
            };
        }

        render() {
            const { fallback = null, errorComponent: ErrorComponent = NullComponent } = asyncProps;
            const { error } = this.state;
            if (error) {
                return <ErrorComponent error={error} />;
            }

            return (
                <React.Suspense fallback={fallback}>
                    <LazyComponent {...this.props} />
                </React.Suspense>
            );
        }
    };
};

export default AsyncLoad;
