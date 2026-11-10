/**
 * NOTE: we don't use the NPM package directly because it has an unnecessary dependency on es6-promise + its commonjs format.
 * Returns the first promise in `promises` to successfully resolve.
 * If all fail, reject.
 * @see {@link https://github.com/jarofghosts/promise-one}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Resolves with whatever the first successful promise yields; channel responses are untyped.
const promiseOne = (promises: Array<Promise<any>>): Promise<any> => {
    const errors: unknown[] = [];
    let errorCount = 0;
    let error: Error;

    return new Promise((resolve, reject) => {
        const pushErrors =
            (idx: number) =>
            (err: unknown): void => {
                errors[idx] = err;
                errorCount += 1;

                if (errorCount === promises.length) {
                    error = new Error('no promises resolved');

                    reject(error);
                }
            };

        promises.forEach((promise, idx) => {
            promise.then(resolve).catch(pushErrors(idx));
        });
    });
};

export default promiseOne;
