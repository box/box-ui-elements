import * as React from 'react';
import AsyncError from './AsyncError';
import { retryNumOfTimes } from '../../../utils/function';

interface Props {
    errorComponent?: React.ComponentType<{ error: Error }>;
    fallback?: React.ReactElement;
    loader: () => Promise<{ default: React.ComponentType<unknown> }>;
}

const DEFAULT_NUM_TIMES = 3;
const DEFAULT_INITIAL_DELAY = 500;
const DEFAULT_BACKOFF_FACTOR = 2;

const AsyncLoad = ({ errorComponent, fallback, loader }: Props) => {
    const lazyRetry = () =>
        retryNumOfTimes(
            (successCallback: (value: unknown) => void, errorCallback: (reason: unknown) => void) =>
                loader().then(successCallback).catch(errorCallback),
            DEFAULT_NUM_TIMES,
            DEFAULT_INITIAL_DELAY,
            DEFAULT_BACKOFF_FACTOR,
        );
    const LazyComponent = React.lazy(() => loader().catch(lazyRetry));

    return React.forwardRef((props: Record<string, unknown>, ref: React.Ref<unknown>) => (
        <AsyncError component={errorComponent}>
            <React.Suspense fallback={fallback || null}>
                <LazyComponent ref={ref} {...props} />
            </React.Suspense>
        </AsyncError>
    ));
};

export default AsyncLoad;
