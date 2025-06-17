import { domainNameValidator, emailValidator, hostnameValidator, ipv4AddressValidator } from '../validators';

describe('util/validators', () => {
    describe('domainNameValidator()', () => {
        test.each([
            ['a.com', true],
            ['www.a.com', true],
            ['a-1.com', true],
            ['www.a-1.com', true],
            ['-a.com', false],
            ['www.a.com-', false],
            ['a@b.com', false],
            ['a.', false],
            ['1.1.1.1', false],
            ['1.1.1', false],
            ['1.1', false],
            ['a', false],
        ])('domainNameValidator(%s) should return %s', (domain: string, expected: boolean) => {
            expect(domainNameValidator(domain)).toBe(expected);
        });
    });

    describe('hostnameValidator()', () => {
        test.each([
            ['a.com', true],
            ['www.a.com', true],
            ['a-1.com', true],
            ['www.a-1.com', true],
            ['-a.com', false],
            ['www.a.com-', false],
            ['a@b.com', false],
            ['a.', false],
            ['1.1.1.1', true],
            ['1.1.1', true],
            ['1.1', true],
            ['a', true],
        ])('hostnameValidator(%s) should return %s', (hostname: string, expected: boolean) => {
            expect(hostnameValidator(hostname)).toBe(expected);
        });
    });

    describe('ipv4AddressValidator()', () => {
        test.each([
            ['a.com', false],
            ['www.a.com', false],
            ['a-1.com', false],
            ['www.a-1.com', false],
            ['-a.com', false],
            ['www.a.com-', false],
            ['a@b.com', false],
            ['a.', false],
            ['1.1.1.1', true],
            ['256.1.1.1', false],
            ['1.256.1.1', false],
            ['1.1.256.1', false],
            ['1.1.1.256', false],
            ['1.1.1', false],
            ['1.1', false],
            ['1.1.', false],
            ['1.', false],
            ['a', false],
        ])('ipv4AddressValidator(%s) should return %s', (address: string, expected: boolean) => {
            expect(ipv4AddressValidator(address)).toBe(expected);
        });
    });

    describe('emailValidator()', () => {
        test.each([
            ['a.com', false],
            ['www.a.com', false],
            ['a-1.com', false],
            ['www.a-1.com', false],
            ['-a.com', false],
            ['www.a.com-', false],
            ['a@b.com', true],
            ['a@b.dfdsfsdffs', false],
            ['a@b.whatever', false],
            ['a@b.junk', false],
            ['a@b.design', true],
            ['a@b.dog', true],
            ['a@b.business', true],
            ['a@b.club', true],
            ['a@b.life', true],
            ['a@b.co.com', true],
            ['a@.com', false],
            ['a.x@b.com', true],
            ['a:x@b.com', false],
            ['a..x@b.com', false],
            ['@b.com', false],
            ['a.', false],
            ['1.1.1.1', false],
            ['256.1.1.1', false],
            ['1.256.1.1', false],
            ['1.1.256.1', false],
            ['1.1.1.256', false],
            ['1.1.1', false],
            ['1.1', false],
            ['1.1.', false],
            ['1.', false],
            ['a', false],
        ])('emailValidator(%s) should return %s', (email: string, expected: boolean) => {
            expect(emailValidator(email)).toBe(expected);
        });
    });
});
