import sinon from 'sinon';
import { retryNumOfTimes } from '../function';

const sandbox = sinon.sandbox.create();

describe('util/function', () => {
    const clock = sandbox.useFakeTimers();
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('retryNumOfTimes()', () => {
        test('should create a promise that resolves when the wrapped promise resolves', () => {
            const inner = sandbox.mock();
            const promise = retryNumOfTimes(resolve => {
                inner();
                resolve();
            }, 2);

            clock.tick(10);

            return promise.then(sandbox.mock());
        });

        test('should create a promise that resolves when the wrapped promise resolves on the second try', () => {
            let times = 0;
            const inner = sandbox.mock().twice();
            const promise = retryNumOfTimes((resolve, reject) => {
                times += 1;
                inner();
                if (times === 2) {
                    resolve();
                } else {
                    reject();
                }
            }, 2);

            clock.tick(10);

            return promise.then(sandbox.mock());
        });

        test('should create a promise that rejects when the wrapped promise fails after the second try', () => {
            const inner = sandbox.spy();
            const promise = retryNumOfTimes((resolve, reject) => {
                inner();
                reject(); // Always rejects
            }, 2);

            setTimeout(() => {
                promise.catch(sandbox.mock());
                expect(inner.callCount).to.equal(2);
            }, 100);
        });

        test('should create a promise that does not retry when the wrapped promise hardRejects', () => {
            const inner = sandbox.spy();
            const promise = retryNumOfTimes((resolve, reject, hardReject) => {
                inner();
                hardReject();
            }, 2);

            setTimeout(() => {
                promise.catch(sandbox.mock());
                expect(inner.callCount).to.equal(1);
            }, 100);
        });
    });
});
