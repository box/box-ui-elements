import parseCSV from '../parseCSV';

describe('utils/parseCSV', () => {
    [
        {
            case: 'input is null',
            input: null,
            result: [],
        },
        {
            case: 'input is undefined',
            input: undefined,
            result: [],
        },
        {
            case: 'input is empty',
            input: '',
            result: [],
        },
        {
            case: 'input is valid and has not spaces',
            input: 'a,b,c,d',
            result: ['a', 'b', 'c', 'd'],
        },
        {
            case: 'input has some spaces',
            input: ' a, b,c, d  ',
            result: ['a', 'b', 'c', 'd'],
        },
        {
            case: 'string component has comma',
            input: 'a, "b, c", d',
            result: ['a', 'b, c', 'd'],
        },
        {
            case: 'input has carriage return',
            input: 'a\r\nb, c',
            result: ['a', 'b', 'c'],
        },
        {
            case: 'input has invalid format',
            input: 'a, , b c, ", d',
            result: ['a', '', 'b c', 'd'],
        },
        {
            case: 'input has comma at the end',
            input: 'a, b, c, d,',
            result: ['a', 'b', 'c', 'd'],
        },
        {
            case: 'input has carriage return at the end',
            input: 'a, b, c, d\r\n',
            result: ['a', 'b', 'c', 'd'],
        },
    ].forEach(testCase => {
        test(`should return correct result when ${testCase.case}`, () => {
            const actualResult = parseCSV(testCase.input);
            const expectedResult = testCase.result;
            expect(actualResult).toEqual(expectedResult);
        });
    });
});
