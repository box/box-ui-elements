// @flow
import { isValidValue, isValidCondition } from '../validator';

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

[
    {
        description: `should return false if there is no condition`,
        type: 'float',
        condition: null,
        expected: false,
    },
    {
        description: `should return true if type is float and valueKey is a number`,
        type: 'string',
        condition: {
            valueKey: '123',
        },
        expected: true,
    },
    {
        description: `should return false if the type is float and the value is not a number`,
        type: 'float',
        condition: {
            valueKey: 'asd',
        },
        expected: false,
    },
    {
        description: `should return true if the type is not float and the key attributes are not null or empty strings`,
        type: 'string',
        condition: {
            attributeKey: 1,
            valueKey: 1,
            operatorKey: 1,
        },
        expected: true,
    },
    {
        description: `should return false if the type is not float and the key attributes are null`,
        type: 'string',
        condition: {
            attributeKey: null,
            valueKey: null,
            operatorKey: null,
        },
        expected: false,
    },
].forEach(({ description, type, condition, expected }) => {
    test(description, () => {
        const actual = isValidCondition(type, condition);
        expect(actual).toEqual(expected);
    });
});
