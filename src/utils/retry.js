/**
 * @flow
 * @file A utility function to retry a function which returns a promise
 * @author Box
 */
const DEFAULT_NUM_RETRIES = 2;
const DEFAULT_INITIAL_DELAY = 500;

const retry = (
    operation: () => Promise<any>,
    times: number = DEFAULT_NUM_RETRIES,
    delay: number = DEFAULT_INITIAL_DELAY,
) => {
    return operation().catch(e => {
        if (times > 0) {
            return new Promise((resolve, reject) => {
                const retryCb = () => retry(operation, times - 1, 2 * delay).then(resolve, reject);
                setTimeout(retryCb, delay);
            });
        }

        throw e;
    });
};

export default retry;
