// @flow
type PB = $ReadOnlyArray<any>;
type CallRecord<V, P: PB = PB> = {
    expirationTime: number,
    params: P,
    result: V,
};

type CallRecords<V, P: PB = PB> = $Array<CallRecord<V, P>>;
type Store<V, P: PB = PB> = Record<string, CallRecords<V, P>>;

export type Throttle<V, P: PB = PB> = (callback: () => V, expirationInMs: number, params: P, key: string) => V;

function isMatching<P: PB = PB>(currParams: P, params: P) {
    if (currParams.length !== params.length) {
        return false;
    }
    return !params.some((param, i) => currParams[i] !== param);
}

/**
 * This function is similar to debounce but it will retrieve result from a recorded call if
 * a call of the same key and params has not expired. A couple of highlights compared with
 * lodash/debounce that is somewhat similar:
 *  1. avoid call if key and params are the same as cached
 *  2. avoid using setTimeout as it is more complex, and fragile
 *  3. return value is recorded and retrieved next time if a second call is made
 *  4. key is optional and is used to optimize for retrieval performance but can only contain
 *     string, while params can accommodate any data structure for referential equality check.
 *  Use case:
 *    1) when we make backend call to log event, we can avoid making multiple calls for the
 *       same event due to minor UI flickering, but still allow different event to go through.
 *    2) when we make backend call for email address validation, we can avoid making repeated calls
 *       in short period of time for the same email address.
 *  Implementation:
 *    store is a hash map of key => array of records
 */
async function throttle<V, P: PB = PB>(
    store: Store<V, P>,
    callback: () => V,
    expirationInMs: number,
    params: P,
    key = '_',
): V {
    const { [key]: records = [] } = store;
    const currentTime = new Date().getTime();
    // remove existing records that have expired
    const filteredRecords = records.filter(({ expirationTime }: CallRecord<V, P>) => expirationTime > currentTime);
    // check if there is a matching record to reuse
    const matchedRecords = filteredRecords.filter(({ params: recordParams }: CallRecord<V, P>) =>
        isMatching<P>(recordParams, params),
    );
    store[key] = filteredRecords;
    if (matchedRecords.length < 1) {
        // add the call into records
        const expirationTime = currentTime + expirationInMs;
        const result = await callback();
        store[key].push({ expirationTime, params, result });
        return result;
    }
    return matchedRecords[0].result;
}

/**
 * makeCachedAsyncCall will create a store for the returned CachedAsyncCall so different
 * instance will not share the same CallRecords
 */
function makeThrottle<V, P: PB = PB>(): Throttle<V, P> {
    const store: Store<V, P> = {};
    return (callback: () => V, expirationInMs: number, params: P, key: string) =>
        throttle<V, P>(store, callback, expirationInMs, params, key);
}

export default makeThrottle;
