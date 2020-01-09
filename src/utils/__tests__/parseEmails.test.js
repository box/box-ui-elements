import parseEmails from '../parseEmails';

describe('utils/parseEmails', () => {
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
            case: 'valid email but with space',
            input: ' fbar@example.com ',
            result: ['fbar@example.com'],
        },
        {
            case: 'multiple emails space separated',
            input: 'fbar@example.com dvader@example.com',
            result: ['fbar@example.com', 'dvader@example.com'],
        },
        {
            case: 'multiple emails comma separated',
            input: 'fbar@example.com, dvader@example.com',
            result: ['fbar@example.com', 'dvader@example.com'],
        },
        {
            case: 'multiple emails semicolon separated',
            input: 'fbar@example.com; dvader@example.com',
            result: ['fbar@example.com', 'dvader@example.com'],
        },
        {
            case: 'email with <Contact Data>',
            input: 'Bar, Foo <fbar@example.com>',
            result: ['fbar@example.com'],
        },
        {
            case: 'multiple emails with <Contact Data>',
            input: 'Bar, Foo <fbar@example.com>; Vader, Darth <dvader@example.com>',
            result: ['fbar@example.com', 'dvader@example.com'],
        },
    ].forEach(testCase => {
        test(`should return correct result when ${testCase.case}`, () => {
            const actualResult = parseEmails(testCase.input);
            const expectedResult = testCase.result;
            expect(actualResult).toEqual(expectedResult);
        });
    });
});
