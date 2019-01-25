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
            input: ' ppaul@box.com ',
            result: ['ppaul@box.com'],
        },
        {
            case: 'multiple emails space separated',
            input: 'ppaul@box.com bmonroe@box.com',
            result: ['ppaul@box.com', 'bmonroe@box.com'],
        },
        {
            case: 'multiple emails comma separated',
            input: 'ppaul@box.com, bmonroe@box.com',
            result: ['ppaul@box.com', 'bmonroe@box.com'],
        },
        {
            case: 'multiple emails semicolon separated',
            input: 'ppaul@box.com; bmonroe@box.com',
            result: ['ppaul@box.com', 'bmonroe@box.com'],
        },
        {
            case: 'email with <Contact Data>',
            input: 'Paul, Patrick <ppaul@box.com>',
            result: ['ppaul@box.com'],
        },
        {
            case: 'multiple emails with <Contact Data>',
            input: 'Paul, Patrick <ppaul@box.com>; Monroe, Brad <bmonroe@box.com>',
            result: ['ppaul@box.com', 'bmonroe@box.com'],
        },
    ].forEach(testCase => {
        test(`should return correct result when ${testCase.case}`, () => {
            const actualResult = parseEmails(testCase.input);
            const expectedResult = testCase.result;
            expect(actualResult).toEqual(expectedResult);
        });
    });
});
