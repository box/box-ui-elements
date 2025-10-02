// @flow

/**
 * Throttler implements something similar to debounce but throttle is more suitable for
 * throttling backend call because it will retrieve result from a recorded call if a call of the
 * same key AND params has not expired.
 *
 * A couple of improvement compared with lodash/debounce is:
 *  1. avoid call only if key AND params are the same as cached
 *  2. avoid implementing using setTimeout as setTimeout is more complex, and fragile
 *  3. return value is recorded and retrieved next time if a second call is made
 *  4. key is optional and is used to optimize for retrieval performance but can only contain
 *     string or number, while params can accommodate array of any data for referential equality
 *     check.
 *
 *  Use case:
 *    1) when we make backend call to log event, we can avoid making multiple calls for the
 *       same event due to minor UI flickering, but still allow different event to go through.
 *    2) when we make backend call for email address validation, we can avoid making repeated calls
 *       in short period of time for the same email address.
 *  Implementation:
 *    store is an object of key => array of records where each record contains params array,
 *    expirationTime and result of the call.
 *  Example:
 *    Assuming there are two backend calls:
 *        const validateEmail = async (email :string) => boolean
 *        const postEvent = async (name: string, type: string) => void
 *
 *    Here is the code to implement a throttler that will throttle the call if it has been
 *    called in the last 1000 seconds. Notice that throttled version has exactly the same
 *    signature as unthrottled version.
 *        const validateEmailThrottler = new Throttler<boolean>();
 *        const throttledValidateEmail = (email: string) =>
 *            validateEmailThrottler(() => validateEmail(email), 1e6, [], email);
 *
 *        const postEventThrottler = new Throttler<void, Array<string>>();
 *        const throttledPostEvent = (name: string, type: string) =>
 *            postEventThrottler(() => postEvent(name, type), 1e6, [name, type]);
 *
 * Abbreviation
 *   V: the return value of the callback function.
 *   P: the parameter of the callback function as an array, default to Array<any>.
 *   PB: the base type for the parameter of the callback function.
 */

type PB = $ReadOnlyArray<mixed>;
type CallRecord<V, P: PB> = $ReadOnly<{
    expirationTime: number,
    params: P,
    result: V,
}>;

type CallRecords<V, P: PB> = Array<CallRecord<V, P>>;
type Store<V, P: PB> = { [string | number]: CallRecords<V, P> };

class Throttler<V = void, P: PB = PB> {
    store: Store<V, P> = {};

    throttle(callback: () => V, expirationInMs: number, params: P, key: string | number): V {
        function isMatchingRecord(record: CallRecord<V, P>) {
            if (record.params.length !== params.length) {
                return false;
            }
            return !params.some((param, i) => record.params[i] !== param);
        }

        const { [key]: records = [] } = this.store;
        const currentTime = Date.now();
        // remove existing records that have expired
        const filteredRecords = records.filter(({ expirationTime }: CallRecord<V, P>) => expirationTime > currentTime);
        // check if there is a matching record to reuse
        const matchedRecords = filteredRecords.filter(isMatchingRecord);
        this.store[key] = filteredRecords;
        if (matchedRecords.length < 1) {
            // add the call into records
            const expirationTime = currentTime + expirationInMs;
            const record = { expirationTime, params, result: callback() };
            this.store[key].push(record);
            return record.result;
        }
        return matchedRecords[0].result;
    }
}

export default Throttler;
