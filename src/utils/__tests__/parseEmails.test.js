import parseEmails, { checkIsExternalUser } from '../parseEmails';

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

    describe('checkIsExternalUser', () => {
        test.each`
            emailToCheck         | ownerEmailDomain       | isCurrentUserOwner | result   | description
            ${'narwhal@box.com'} | ${'box.com'}           | ${true}            | ${false} | ${'the current user owns the item and the email to check is internal'}
            ${'narwhal@box.com'} | ${'box.com'}           | ${false}           | ${false} | ${'the current user does not own the item and the email to check is internal'}
            ${'narwhal@box.com'} | ${'boxuielements.com'} | ${true}            | ${true}  | ${'the current user owns the item and the email to check is external'}
            ${'narwhal@box.com'} | ${'boxuielements.com'} | ${false}           | ${false} | ${'the current user does not own the item and the email to check is external'}
            ${undefined}         | ${'box.com'}           | ${true}            | ${false} | ${'the email to check is undefined'}
            ${'narwhal@box.com'} | ${null}                | ${true}            | ${false} | ${'the owner email domain is null'}
        `(
            'should return $result when $description',
            ({ isCurrentUserOwner, ownerEmailDomain, emailToCheck, result }) => {
                expect(checkIsExternalUser(isCurrentUserOwner, ownerEmailDomain, emailToCheck)).toBe(result);
            },
        );
    });
});
