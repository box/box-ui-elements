// @flow
import * as React from 'react';
import { retryNumOfTimes } from 'utils/function';

type Props = {
    loader: () => Promise<any>,
    fallback?: React.Element<any>,
    errorComponent?: React.ComponentType<any>,
};

type State = {
    error: ?Error,
};

const DEFAULT_NUM_TIMES = 3;
const DEFAULT_INITIAL_DELAY = 500;
const DEFAULT_BACKOFF_FACTOR = 2;

const NullComponent = () => null;

const AsyncLoad = (asyncProps: Props = {}) => {
    const asyncLoadWithRetry = () =>
        retryNumOfTimes(
            (successCallback, errorCallback) => asyncProps.loader().then(successCallback, errorCallback),
            DEFAULT_NUM_TIMES,
            DEFAULT_INITIAL_DELAY,
            DEFAULT_BACKOFF_FACTOR,
        );
    const LazyComponent = React.lazy(asyncLoadWithRetry);

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
