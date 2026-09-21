/**
 * Retries a promise factory up to `times`. The factory receives resolve, reject,
 * and hardReject so it can stop retrying immediately.
 */
const retryNumOfTimes = (
    func: Function,
    times: number,
    initialTimeout: number = 0,
    backoffFactor: number = 1,
): Promise<unknown> => {
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
                        // eslint-disable-next-line @typescript-eslint/no-use-before-define
                        executeAfterTimeout(timeout);
                        return;
                    }

                    hardReject(reason);
                });
        }

        function executeAfterTimeout(time: number): void {
            setTimeout(() => {
                doTry();
            }, time);
        }

        executeAfterTimeout(timeout);
    });
};

export { retryNumOfTimes };
