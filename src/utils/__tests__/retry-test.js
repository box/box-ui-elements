import retry from '../retry';

describe('util/retry', () => {
    describe('retry()', () => {
        const DEFAULT_NUM_RETRIES = 2;
        let retryFn;

        beforeEach(() => {
            retryFn = jest.fn().mockRejectedValue('foo');
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.clearAllTimers();
        });

        const advanceTimerRecursively = numTimers => {
            if (numTimers === 0) {
                return;
            }

            setImmediate(() => {
                jest.runAllTimers();
                advanceTimerRecursively(numTimers - 1);
            });
        };

        test('should retry the default number of times', done => {
            retry(retryFn)
                .then(() => {
                    throw new Error('I should fail');
                })
                .catch(() => {
                    expect(retryFn).toHaveBeenCalledTimes(DEFAULT_NUM_RETRIES + 1);
                    done();
                });
            advanceTimerRecursively(DEFAULT_NUM_RETRIES);
        });

        test('should retry a custom number of times', done => {
            const NUM_TIMES = 1;
            retry(retryFn, NUM_TIMES)
                .then(() => {
                    throw new Error('I should fail');
                })
                .catch(() => {
                    expect(retryFn).toHaveBeenCalledTimes(NUM_TIMES + 1);
                    done();
                });
            advanceTimerRecursively(NUM_TIMES);
        });

        test('should not retry', done => {
            const shouldntRetryFn = jest.fn().mockResolvedValue('foo');
            retry(shouldntRetryFn)
                .then(() => {
                    expect(shouldntRetryFn).toHaveBeenCalledTimes(1);
                    done();
                })
                .catch(() => {
                    throw new Error('I should not fail');
                });
        });
    });
});
