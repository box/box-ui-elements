import browser from '../Browser';

describe('util/Browser/isMobile()', () => {
    test('should return false if not mobile', () => {
        browser.getUserAgent = jest.fn().mockReturnValueOnce('foobar');
        expect(browser.isMobile()).toBeFalsy();
    });

    test.each`
        device
        ${'ipad'}
        ${'iphone'}
        ${'ipod'}
        ${'android'}
        ${'blackberry'}
        ${'bb10'}
        ${'mini'}
        ${'windows ce'}
        ${'palm'}
    `('should return true for $device', ({ device }) => {
        browser.getUserAgent = jest.fn().mockReturnValueOnce(device);
        expect(browser.isMobile()).toBeTruthy();
    });

    test('should return true if user agent contains the string "Mobi"', () => {
        browser.getUserAgent = jest
            .fn()
            .mockReturnValueOnce(
                'Mozilla/5.0 (iPad; CPU OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
            );
        expect(browser.isMobile()).toBeTruthy();
    });
});

describe('util/Browser/isIE()', () => {
    test('should return true if IE', () => {
        browser.getUserAgent = jest.fn().mockReturnValueOnce('Trident');
        expect(browser.isIE()).toBeTruthy();
    });
    test('should return false if not IE', () => {
        browser.getUserAgent = jest.fn().mockReturnValueOnce('foobar');
        expect(browser.isIE()).toBeFalsy();
    });
});

describe('util/Browser/isSafari()', () => {
    test.each`
        result   | userAgent
        ${true}  | ${'AppleWebKit/4.0'}
        ${false} | ${'Trident'}
        ${false} | ${'AppleWebKit/7.8 (KHTML, like Gecko) Chrome/1.2.3.4 Safari/5.6'}
    `('should return $result when user agent is $userAgent', ({ result, userAgent }) => {
        browser.getUserAgent = jest.fn().mockReturnValueOnce(userAgent);
        expect(browser.isSafari()).toBe(result);
    });
});

describe('util/Browser/isMobileSafari()', () => {
    afterEach(() => {
        browser.getUserAgent = jest.fn().mockReset();
    });

    test.each`
        result   | userAgent
        ${true}  | ${'AppleWebKit/603.1.23 (KHTML, like Gecko) Version/10.0 Mobile/14E5239e Safari/602.1'}
        ${false} | ${'AppleWebKit/4.0'}
        ${false} | ${'Trident'}
        ${false} | ${'AppleWebKit/7.8 (KHTML, like Gecko) Chrome/1.2.3.4 Safari/5.6'}
        ${false} | ${'AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/87.0.4280.77 Mobile/15E148 Safari/604.1'}
    `('should return $result when user agent is $userAgent', ({ result, userAgent }) => {
        browser.getUserAgent = jest.fn().mockReturnValue(userAgent);
        expect(browser.isMobileSafari()).toBe(result);
    });
});

describe('util/Browser/isMobileChromeOniOS()', () => {
    afterEach(() => {
        browser.getUserAgent = jest.fn().mockReset();
    });

    test.each`
        result   | userAgent
        ${true}  | ${'AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/87.0.4280.77 Mobile/15E148 Safari/604.1'}
        ${false} | ${'AppleWebKit/4.0'}
        ${false} | ${'Trident'}
        ${false} | ${'AppleWebKit/7.8 (KHTML, like Gecko) Chrome/1.2.3.4 Safari/5.6'}
    `('should return $result when user agent is $userAgent', ({ result, userAgent }) => {
        browser.getUserAgent = jest.fn().mockReturnValue(userAgent);
        expect(browser.isMobileChromeOniOS()).toBe(result);
    });
});

describe('util/Browser/getUserAgent()', () => {
    test('should return the user agent', () => {
        expect(browser.getUserAgent()).toBeUndefined();
    });
});

describe('util/Browser/canPlayDash()', () => {
    test('should return false when there is no media source', () => {
        expect(browser.canPlayDash()).toBeFalsy();
    });
    test('should return false when isTypeSupported is not a function', () => {
        global.MediaSource = { isTypeSupported: 'string' };
        expect(browser.canPlayDash(true)).toBeFalsy();
    });
    test('should return true when h264 is supported', () => {
        const isTypeSupportedMock = jest.fn();
        global.MediaSource = {
            isTypeSupported: isTypeSupportedMock.mockReturnValueOnce(true),
        };

        expect(browser.canPlayDash(true)).toBeTruthy();
        expect(isTypeSupportedMock).toHaveBeenCalledWith('video/mp4; codecs="avc1.64001E"');
    });
});

describe('Browser clipboard API', () => {
    // @see https://caniuse.com/#search=clipboard
    afterEach(() => {
        global.navigator.clipboard = undefined;
    });

    test('should return false when clipboard is unavailable', () => {
        expect(browser.canWriteToClipboard()).toBe(false);
        expect(browser.canReadFromClipboard()).toBe(false);
    });

    test('should return false when clipboard is partially available', () => {
        global.navigator.clipboard = {
            read: jest.fn(),
            write: jest.fn(),
        };

        expect(browser.canWriteToClipboard()).toBe(false);
        expect(browser.canReadFromClipboard()).toBe(false);
    });

    test('should return true when clipboard is fully available', () => {
        global.navigator.clipboard = {
            read: jest.fn(),
            write: jest.fn(),
            readText: jest.fn(),
            writeText: jest.fn(),
        };

        expect(browser.canWriteToClipboard()).toBe(true);
        expect(browser.canReadFromClipboard()).toBe(true);
    });
});
