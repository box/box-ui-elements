// @flow
import { isValidValue } from '../validator';

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
