/**
 * NOTE: we don't use the NPM package directly because it has an unnecessary dependency on es6-promise + its commonjs format.
 * Returns the first promise in `promises` to successfully resolve.
 * If all fail, reject.
 * @see {@link https://github.com/jarofghosts/promise-one}
 */
function promiseOne(promises) {
  const errors = [];
  let errorCount = 0;
  let error;
  return new Promise((resolve, reject) => {
    const pushErrors = idx => err => {
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
}
export default promiseOne;
//# sourceMappingURL=promise.js.map