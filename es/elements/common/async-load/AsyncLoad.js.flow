// @flow
import * as React from 'react';
import AsyncError from './AsyncError';
import { retryNumOfTimes } from '../../../utils/function';

type Props = {
    errorComponent?: React.ComponentType<any>,
    fallback?: React.Element<any>,
    loader: () => Promise<any>,
};

const DEFAULT_NUM_TIMES = 3;
const DEFAULT_INITIAL_DELAY = 500;
const DEFAULT_BACKOFF_FACTOR = 2;

const AsyncLoad = ({ errorComponent, fallback, loader }: Props = {}) => {
    const lazyRetry = () =>
        retryNumOfTimes(
            (successCallback, errorCallback) =>
                loader()
                    .then(successCallback)
                    .catch(errorCallback),
            DEFAULT_NUM_TIMES,
            DEFAULT_INITIAL_DELAY,
            DEFAULT_BACKOFF_FACTOR,
        );
    const LazyComponent = React.lazy(() => loader().catch(lazyRetry));

    return React.forwardRef<Object, React.Ref<any>>((props: Object, ref: React.Ref<any>) => (
        <AsyncError component={errorComponent}>
            <React.Suspense fallback={fallback || null}>
                <LazyComponent ref={ref} {...props} />
            </React.Suspense>
        </AsyncError>
    ));
};

export default AsyncLoad;
