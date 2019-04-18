// @flow
import { isFloat } from '../utils';

describe('isFloat()', () => {
    test.each`
        value     | expected | should
        ${'1.0.'} | ${false} | ${'Should return false if the value is 1.0.'}
        ${'1.0'}  | ${true}  | ${'Should return true if the value is 1.0'}
        ${'1'}    | ${true}  | ${'Should return true if the value is 1'}
        ${'1.a'}  | ${false} | ${'Should return false if the value is 1.a'}
        ${'a'}    | ${false} | ${'Should return false if the value is a'}
        ${'0'}    | ${true}  | ${'Should return false if the value is 0'}
    `('$should', ({ value, expected }) => {
        const result = isFloat(value);
        expect(result).toBe(expected);
    });
});
