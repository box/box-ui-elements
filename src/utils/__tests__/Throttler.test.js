// @flow
import Throttler from '../Throttler';

describe('features/targeting/utils/makeThrottle', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('throttle if the one parameter is passed', async () => {
        const callback = jest.fn().mockImplementation(x => x + 1);
        const throttler = new Throttler();
        expect(await throttler.throttle(() => callback(1), 1000, [1])).toEqual(2);
        expect(await throttler.throttle(() => callback(1), 1000, [1])).toEqual(2);
        expect(callback.mock.calls).toEqual([[1]]);
        expect(await throttler.throttle(() => callback(3), 1000, [2])).toEqual(4);
        expect(callback.mock.calls).toEqual([[1], [3]]);
    });

    test('will throttle within expiration date', async () => {
        const dateNowMockFn = jest
            .spyOn(Date, 'now')
            .mockImplementationOnce(() => 1479427200000)
            .mockImplementationOnce(() => 1479427200999);

        const callback = jest.fn().mockImplementation(x => x + 1);
        const throttler = new Throttler();
        expect(await throttler.throttle(() => callback(1), 1000, [1])).toEqual(2);
        expect(await throttler.throttle(() => callback(1), 1000, [1])).toEqual(2);
        expect(callback.mock.calls).toEqual([[1]]);

        dateNowMockFn.mockRestore();
    });

    test('will not throttle on or beyond expiration date', async () => {
        const dateNowMockFn = jest
            .spyOn(Date, 'now')
            .mockImplementationOnce(() => 1479427200000)
            .mockImplementationOnce(() => 1479427201000);

        const callback = jest.fn().mockImplementation(x => x + 1);
        const throttler = new Throttler();
        expect(await throttler.throttle(() => callback(1), 1000, [1])).toEqual(2);
        expect(await throttler.throttle(() => callback(1), 1000, [1])).toEqual(2);
        expect(callback.mock.calls).toEqual([[1], [1]]);

        dateNowMockFn.mockRestore();
    });

    test('will retrieve value after last promise is resolved', async () => {
        const callback = jest.fn().mockImplementation(
            x =>
                new Promise(resolve =>
                    setTimeout(() => {
                        resolve(x + 1);
                    }, 1000),
                ),
        );
        const throttler = new Throttler();
        const promise1 = throttler.throttle(() => callback(1), 1000, [1]);
        const promise2 = throttler.throttle(() => callback(1), 1000, [1]);
        expect(await promise1).toEqual(2);
        expect(await promise2).toEqual(2);
        expect(promise1 === promise2).toBe(true);
        expect(callback.mock.calls).toEqual([[1]]);
    });

    test('will not throttle beyond expiration date', async () => {
        const callback = jest.fn().mockImplementation(x => x + 1);
        const throttler = new Throttler();
        expect(await throttler.throttle(() => callback(1), 1000, [1])).toEqual(2);
        expect(await throttler.throttle(() => callback(1), 1000, [1])).toEqual(2);
        expect(callback.mock.calls).toEqual([[1]]);
        expect(await throttler.throttle(() => callback(3), 1000, [2])).toEqual(4);
        expect(callback.mock.calls).toEqual([[1], [3]]);
    });

    test('throttle if the two parameters are passed', async () => {
        const callback = jest.fn().mockImplementation(x => x + 1);
        const throttler = new Throttler();
        await throttler.throttle(() => callback(1, 2), 1000, [1, 2]);
        await throttler.throttle(() => callback(1, 2), 1000, [1, 2]);
        expect(callback.mock.calls).toEqual([[1, 2]]);
        await throttler.throttle(() => callback(3, 4), 1000, [2, 3]);
        expect(callback.mock.calls).toEqual([
            [1, 2],
            [3, 4],
        ]);
    });

    test('throttle if key is passed', async () => {
        const callback = jest.fn().mockImplementation(x => x + 1);
        const throttler = new Throttler();
        await throttler.throttle(() => callback(1, 2), 1000, [], '1');
        await throttler.throttle(() => callback(1, 2), 1000, [], '1');
        expect(callback.mock.calls).toEqual([[1, 2]]);
        await throttler.throttle(() => callback(3, 4), 1000, [], '3');
        expect(callback.mock.calls).toEqual([
            [1, 2],
            [3, 4],
        ]);
    });

    test('throttle if key and two parametrs are passed', async () => {
        const callback = jest.fn().mockImplementation(x => x + 1);
        const throttler = new Throttler();
        await throttler.throttle(() => callback(1, 2), 1000, [2, 3], '1');
        await throttler.throttle(() => callback(1, 2), 1000, [2, 3], '1');
        expect(callback.mock.calls).toEqual([[1, 2]]);
        await throttler.throttle(() => callback(3, 4), 1000, [4, 5], '1');
        expect(callback.mock.calls).toEqual([
            [1, 2],
            [3, 4],
        ]);
        await throttler.throttle(() => callback(5, 6), 1000, [4, 5], '2');
        expect(callback.mock.calls).toEqual([
            [1, 2],
            [3, 4],
            [5, 6],
        ]);
    });
});
