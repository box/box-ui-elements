// @flow
import makeThrottle from '../makeThrottle';

describe('features/targeting/utils/makeThrottle', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('throttle if the one parameter is passed', async () => {
        const callback = jest.fn().mockImplementation(x => x + 1);
        const throttle = makeThrottle();
        await throttle(() => callback(1), 1000, [1]);
        await throttle(() => callback(1), 1000, [1]);
        expect(callback.mock.calls).toEqual([[1]]);
        await throttle(() => callback(3), 1000, [2]);
        expect(callback.mock.calls).toEqual([[1], [3]]);
    });

    test('throttle if the two parameters are passed', async () => {
        const callback = jest.fn().mockImplementation(x => x + 1);
        const throttle = makeThrottle();
        await throttle(() => callback(1, 2), 1000, [1, 2]);
        await throttle(() => callback(1, 2), 1000, [1, 2]);
        expect(callback.mock.calls).toEqual([[1, 2]]);
        await throttle(() => callback(3, 4), 1000, [2, 3]);
        expect(callback.mock.calls).toEqual([
            [1, 2],
            [3, 4],
        ]);
    });

    test('throttle if key is passed', async () => {
        const callback = jest.fn().mockImplementation(x => x + 1);
        const throttle = makeThrottle();
        await throttle(() => callback(1, 2), 1000, [], '1');
        await throttle(() => callback(1, 2), 1000, [], '1');
        expect(callback.mock.calls).toEqual([[1, 2]]);
        await throttle(() => callback(3, 4), 1000, [], '3');
        expect(callback.mock.calls).toEqual([
            [1, 2],
            [3, 4],
        ]);
    });

    test('throttle if key and two parametrs are passed', async () => {
        const callback = jest.fn().mockImplementation(x => x + 1);
        const throttle = makeThrottle();
        await throttle(() => callback(1, 2), 1000, [2, 3], '1');
        await throttle(() => callback(1, 2), 1000, [2, 3], '1');
        expect(callback.mock.calls).toEqual([[1, 2]]);
        await throttle(() => callback(3, 4), 1000, [4, 5], '1');
        expect(callback.mock.calls).toEqual([
            [1, 2],
            [3, 4],
        ]);
        await throttle(() => callback(5, 6), 1000, [4, 5], '2');
        expect(callback.mock.calls).toEqual([
            [1, 2],
            [3, 4],
            [5, 6],
        ]);
    });
});
