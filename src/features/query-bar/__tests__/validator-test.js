// @flow
import { isFloat, isInt, isValidValue } from '../validator';

[
    {
        description: `should return true if there is no value`,
        type: 'float',
        value: null,
        expected: true,
    },
    {
        description: `should return false if type is not float`,
        type: 'string',
        value: 'hello',
        expected: false,
    },
    {
        description: `should return true if the type is float and the value is a number`,
        type: 'float',
        value: '234',
        expected: true,
    },
].forEach(({ description, type, value, expected }) => {
    test(description, () => {
        const actual = isValidValue(type, value);
        expect(actual).toEqual(expected);
    });
});

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

describe('isInt()', () => {
    test.each`
        value     | expected | should
        ${'1.0.'} | ${false} | ${'Should return false if the value is 1.0.'}
        ${'1.0'}  | ${false} | ${'Should return false if the value is 1.0'}
        ${'1'}    | ${true}  | ${'Should return true if the value is 1'}
        ${'a'}    | ${false} | ${'Should return false if the value is a'}
        ${'1a'}   | ${false} | ${'Should return false if the value is 1a'}
        ${'0'}    | ${true}  | ${'Should return true if the value is 0'}
    `('$should', ({ value, expected }) => {
        const result = isInt(value);
        expect(result).toBe(expected);
    });
});
