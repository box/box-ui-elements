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
