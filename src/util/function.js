/**
 * @flow
 * @file Function utilities
 * @author Box
 */

/**
 * Wrapper around the promises.create() method to allow a promise to retry
 * multiple times. A third parameter (besides resolve and reject) is passed
 * that allows the function to cancel retrying and immediately reject.
 *
 * @param {function} func - The function that performs the operation as a promise.
 * @param {number} times - Maximum number of times the operation should be attempted.
 * @param {number} [initialTimeout] - Optional timeout to retry the promise with after it fails, in milliseconds.
 * Otherwise, the input `func` is invoked after 1 event loop.
 * @param {number} [backoffFactor] - Optional exponential backoff factor to retry the promise with after it fails
 * @return {Promise} Promise - proxies the promise of the passed function.
 */

function retryNumOfTimes(
    func: Function,
    times: number,
    initialTimeout?: number = 0,
    backoffFactor?: number = 1,
): Promise<any> {
    let tries = 0;
    let timeout = initialTimeout;

    return new Promise((resolve, hardReject) => {
        function doTry() {
            tries += 1;

            new Promise((tryResolve, tryReject) => {
                func(tryResolve, tryReject, hardReject);
            })
                .then(resolve)
                .catch(reason => {
                    if (tries < times) {
                        timeout *= backoffFactor;
                        // eslint-disable-next-line no-use-before-define
                        executeAfterTimeout(timeout);
                        return;
                    }

                    hardReject(reason);
                });
        }

        function executeAfterTimeout(time) {
            setTimeout(() => {
                doTry();
            }, time);
        }

        executeAfterTimeout(timeout);
    });
}

// eslint-disable-next-line import/prefer-default-export
export { retryNumOfTimes };
