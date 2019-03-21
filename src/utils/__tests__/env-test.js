import isDevEnvironment from '../env';

describe('util/env', () => {
    describe('isDevEnvironment()', () => {
        test('isDevEnvironment is true inside of unit tests', () => {
            expect(isDevEnvironment()).toBeTruthy();
        });
    });
});
