import ComServerClient from '../ComServerClient';
import CONSTANTS from '../constants';

import Browser, { BROWSER_CONSTANTS } from '../BrowserUtils';
import HTTPChannel from '../HTTPChannel';
import SafariChannel from '../SafariChannel';
import ActiveXChannel from '../ActiveXChannel';

jest.mock('../HTTPChannel', () => {
    return jest.fn().mockImplementation(() => {
        return { getComServerStatus: jest.fn().mockResolvedValue() };
    });
});

jest.mock('../SafariChannel', () => {
    return jest.fn().mockImplementation(() => {
        return { getComServerStatus: jest.fn().mockResolvedValue() };
    });
});

jest.mock('../ActiveXChannel', () => {
    return jest.fn().mockImplementation(() => {
        return { getComServerStatus: jest.fn().mockResolvedValue() };
    });
});

const APP_NAME = 'Box_Edit';

describe('lib/box-edit/ComServerClient', () => {
    let client;

    beforeEach(() => {});

    afterEach(() => {
        HTTPChannel.mockClear();
        SafariChannel.mockClear();
        ActiveXChannel.mockClear();
        jest.restoreAllMocks();
    });

    describe('constructor()', () => {
        const { BOX_UNSECURE_LOCAL_BASE_URL } = CONSTANTS;

        describe('on browsers that support mixed content', () => {
            beforeEach(() => {
                Browser.isMinBrowser = jest.fn((name, version) => {
                    return name === BROWSER_CONSTANTS.CHROME && version === 53;
                });
            });

            test('should create an HTTP channel when called', () => {
                client = new ComServerClient(APP_NAME);

                expect(HTTPChannel).toBeCalled();
                expect(HTTPChannel.mock.calls[0]).toContain(APP_NAME);
                expect(HTTPChannel.mock.calls[0]).toContain(BOX_UNSECURE_LOCAL_BASE_URL);
            });
        });

        describe('on safari', () => {
            beforeEach(() => {
                Browser.isMinBrowser = jest.fn((name, version) => {
                    return name === BROWSER_CONSTANTS.SAFARI && version === 10;
                });
            });

            test('should create a Safari channel and an HTTPS channel when called and HTTPS certificate unrevoked', () => {
                client = new ComServerClient(APP_NAME);

                expect(SafariChannel).toBeCalled();
                expect(SafariChannel).toBeCalledWith(APP_NAME);
            });
        });

        describe('on browsers that rely on activex for mixed content communication', () => {
            beforeEach(() => {
                Browser.isMinBrowser = jest.fn((name, version) => {
                    return name === BROWSER_CONSTANTS.IE && version === 11;
                });
                Browser.isIEAndSpecificBrowserPluginSupported = jest.fn().mockReturnValue(true);
            });

            test('should create a ActiveX channel and no HTTPS channel when called and HTTPS certificate revoked', () => {
                client = new ComServerClient(APP_NAME);

                expect(ActiveXChannel.mock.calls[0]).toContain(APP_NAME);
            });
        });

        describe('on browsers with no means of communicating over localhost via HTTP or custom/unknown user agents', () => {
            beforeEach(() => {
                Browser.isMinBrowser = jest.fn().mockReturnValue(false);
                Browser.isIEAndSpecificBrowserPluginSupported = jest.fn().mockReturnValue(false);
                Browser.isFirefox = jest.fn().mockReturnValue(false);
            });

            test('should create four channels to try all of them, and activex channel should be set to synchronous mode', () => {
                client = new ComServerClient(APP_NAME);

                expect(HTTPChannel.mock.calls[0]).toContain(APP_NAME);
                expect(HTTPChannel.mock.calls[0]).toContain(BOX_UNSECURE_LOCAL_BASE_URL);
                expect(SafariChannel).toBeCalledWith(APP_NAME);
                expect(ActiveXChannel.mock.calls[0]).toContain(APP_NAME);
            });
        });
    });

    describe('getComServerStatus', () => {
        describe('MSEdge Support', () => {
            describe.each([
                ['14.19000', false],
                ['15.19000', false],
                ['16.16000', false],
                ['16.16298', false],
                ['17.17000', true],
                ['17.17133', false],
            ])('%o', (edgeVersion, isVersionGreaterThanSupportedEdge16Version) => {
                beforeEach(() => {
                    // ARRANGE
                    Browser.isEdge = jest.fn().mockReturnValue(true);
                    Browser.getVersion = jest.fn().mockReturnValue(edgeVersion);
                    Browser.isMinBrowser = jest.fn((name, version) => {
                        if (name === BROWSER_CONSTANTS && version === '17.17134') {
                            return false;
                        }
                        if (name === BROWSER_CONSTANTS.EDGE && version === '16.16299') {
                            return isVersionGreaterThanSupportedEdge16Version;
                        }
                        return null;
                    });
                });

                test(`should return a rejected Promise when Edge support is enabled and the browser is Edge version ${edgeVersion}`, async () => {
                    // ACT
                    client = new ComServerClient(APP_NAME);

                    try {
                        await client.getComServerStatus();
                    } catch (err) {
                        // ASSERT
                        expect(err.message).toEqual(CONSTANTS.BOX_EDIT_UPGRADE_BROWSER_ERROR);
                    }
                });
            });

            describe.each([
                ['16.16299', true, false],
                ['16.16999', true, false],
                ['17.17134', false, true],
                ['17.17999', false, true],
            ])(
                '%o',
                (
                    edgeVersion,
                    isVersionGreaterThanMinimumSupportedEdge16Version,
                    isVersionGreaterThanMinimumSupportedEdge17Version,
                ) => {
                    test('should call getComServerStatus on all active channels when called', async () => {
                        // ARRANGE
                        const { EDGE } = BROWSER_CONSTANTS;
                        Browser.isEdge = jest.fn().mockReturnValue(true);
                        Browser.getVersion = jest.fn().mockReturnValue(edgeVersion);
                        Browser.isMinBrowser = jest.fn((name, version) => {
                            if (name === EDGE && version === '17.17134') {
                                return isVersionGreaterThanMinimumSupportedEdge17Version;
                            }

                            if (name === EDGE && version === '16.16299') {
                                return isVersionGreaterThanMinimumSupportedEdge16Version;
                            }

                            return null;
                        });

                        // ACT
                        client = new ComServerClient(APP_NAME);
                        await client.getComServerStatus();
                        // ASSERT

                        client.channels.forEach(channel => {
                            expect(channel.getComServerStatus).toBeCalledTimes(1);
                        });
                    });
                },
            );
        });

        test('should call getComServerStatus on all active channels when called', async () => {
            // ARRANGE
            Browser.isMinBrowser = jest.fn((name, version) => {
                return name === BROWSER_CONSTANTS.CHROME && version === 53;
            });

            Browser.isEdge = jest.fn().mockReturnValue(false);

            // ACT
            client = new ComServerClient(APP_NAME);
            await client.getComServerStatus();

            // ASSERT
            client.channels.forEach(channel => {
                expect(channel.getComServerStatus).toBeCalledTimes(1);
            });
        });

        describe('when using a browser that supports mixed-mode localhost', () => {
            beforeEach(() => {
                Browser.browserName = jest.fn().mockReturnValue('Chrome');
                Browser.isChrome = jest.fn().mockReturnValue(true);

                Browser.isMinBrowser = jest.fn((name, version) => {
                    return name === BROWSER_CONSTANTS.CHROME && version === 53;
                });
            });

            test("should return the result of the primary channel's getComServerStatus call when it resolves first", async () => {
                // Arrange
                const expectedResolution = 'first';
                HTTPChannel.mockImplementation(() => {
                    return {
                        getComServerStatus: jest.fn().mockResolvedValue(expectedResolution),
                    };
                });

                client = new ComServerClient(APP_NAME);

                // Act
                const value = await client.getComServerStatus();

                // Assert
                expect(value).toEqual(expectedResolution);
            });

            test("should return the result of the secondary channel's getComServerStatus call when it resolves first", async () => {
                // Arrange
                const expectedResolution = 'first foo';

                Browser.isMinBrowser = jest.fn().mockReturnValue(false);
                Browser.isIEAndSpecificBrowserPluginSupported = jest.fn().mockReturnValue(false);
                Browser.isFirefox = jest.fn().mockReturnValue(false);

                HTTPChannel.mockImplementation(() => {
                    return {
                        getComServerStatus: jest.fn().mockRejectedValue(),
                    };
                });

                SafariChannel.mockImplementation(() => {
                    return {
                        getComServerStatus: jest.fn().mockResolvedValue(expectedResolution),
                    };
                });

                client = new ComServerClient(APP_NAME);

                // Act
                const value = await client.getComServerStatus();

                // Assert
                expect(value).toEqual(expectedResolution);
            });

            test("should fail gracefully when called and neither channel's getComServerStatus call succeeds", async () => {
                // arrange
                HTTPChannel.mockImplementation(() => {
                    return {
                        getComServerStatus: jest.fn().mockRejectedValue(),
                    };
                });

                client = new ComServerClient(APP_NAME);

                // act
                await expect(client.getComServerStatus()).rejects.toThrow();
            });

            test('should return a rejected Promise when the browser is Chrome 53 and Box Edit v4 is not installed', async () => {
                // arrange
                Browser.isChrome = jest.fn().mockReturnValue(true);
                Browser.isMinBrowser = jest.fn((name, version) => {
                    return name === BROWSER_CONSTANTS.CHROME && version === 53;
                });

                HTTPChannel.mockImplementation(() => {
                    return {
                        getComServerStatus: jest.fn().mockRejectedValue(),
                    };
                });

                client = new ComServerClient(APP_NAME);

                // act
                await expect(client.getComServerStatus()).rejects.toThrow(CONSTANTS.BOX_EDIT_UNINSTALLED_ERROR);
            });

            test('should return a rejected Promise when the browser is Firefox 55 and Box Edit v4 is not installed', async () => {
                // arrange
                Browser.isChrome = jest.fn().mockReturnValue(false);
                Browser.isFirefox = jest.fn().mockReturnValue(true);
                Browser.isMinBrowser = jest.fn((name, version) => {
                    return name === BROWSER_CONSTANTS.FIREFOX && version === 55;
                });

                HTTPChannel.mockImplementation(() => {
                    return {
                        getComServerStatus: jest.fn().mockRejectedValue(),
                    };
                });

                client = new ComServerClient(APP_NAME);

                // act
                await expect(client.getComServerStatus()).rejects.toThrow(CONSTANTS.BOX_EDIT_UNINSTALLED_ERROR);
            });

            test('should return a rejected Promise when the browser is IE 11 and Box Edit v4 is not installed', async () => {
                // arrange
                Browser.isMinBrowser = jest.fn((name, version) => {
                    return name === BROWSER_CONSTANTS.IE && version === 11;
                });

                Browser.isIEAndSpecificBrowserPluginSupported = jest.fn().mockReturnValue(true);

                ActiveXChannel.mockImplementation(() => {
                    return {
                        getComServerStatus: jest.fn().mockRejectedValue(),
                    };
                });

                // act
                client = new ComServerClient(APP_NAME);
                await expect(client.getComServerStatus()).rejects.toThrow(CONSTANTS.BOX_EDIT_UNINSTALLED_ERROR);
            });

            test('should return a rejected Promise when the browser is Chrome under version 53', async () => {
                Browser.isMinBrowser = jest.fn((name, version) => {
                    if (name === BROWSER_CONSTANTS.CHROME && version === 53) {
                        return false;
                    }
                    return null;
                });

                // arrange
                Browser.isChrome = jest.fn(() => true);
                Browser.version = 52;

                HTTPChannel.mockImplementation(() => {
                    return {
                        getComServerStatus: jest.fn().mockResolvedValue(),
                    };
                });

                client = new ComServerClient(APP_NAME);

                // act
                await expect(client.getComServerStatus()).rejects.toThrow(CONSTANTS.BOX_EDIT_UPGRADE_BROWSER_ERROR);
            });

            test('should return a rejected Promise when the browser is Firefox under version 55', async () => {
                // arrange
                Browser.isMinBrowser = jest.fn((name, version) => {
                    if (name === BROWSER_CONSTANTS.FIREFOX && version === 55) {
                        return false;
                    }
                    return null;
                });

                Browser.isFirefox = jest.fn().mockReturnValue(true);
                Browser.getVersion = jest.fn().mockReturnValue(42);

                HTTPChannel.mockImplementation(() => {
                    return {
                        getComServerStatus: jest.fn().mockRejectedValue(),
                    };
                });

                client = new ComServerClient(APP_NAME);
                // act
                await expect(client.getComServerStatus()).rejects.toThrow(CONSTANTS.BOX_EDIT_UPGRADE_BROWSER_ERROR);
            });

            test('should return a rejected Promise when the browser is Safari', async () => {
                Browser.isMinBrowser = jest.fn((name, version) => {
                    if (name === BROWSER_CONSTANTS.SAFARI && version === 10) {
                        return true;
                    }

                    if (name === BROWSER_CONSTANTS.CHROME && version === 53) {
                        return false;
                    }
                    return null;
                });
                // arrange

                Browser.isFirefox = jest.fn().mockReturnValue(false);
                Browser.isChrome = jest.fn().mockReturnValue(false);
                Browser.isSafari = jest.fn().mockReturnValue(true);

                SafariChannel.mockImplementation(() => {
                    return {
                        getComServerStatus: jest.fn().mockRejectedValue(),
                    };
                });

                client = new ComServerClient(APP_NAME);

                await expect(client.getComServerStatus()).rejects.toThrow(CONSTANTS.BOX_EDIT_SAFARI_ERROR);
            });

            test('should return an upgrade browser message when user is on a browser (Safari) that does not support Box Tools v4', async () => {
                // arrange
                Browser.isFirefox = jest.fn().mockReturnValue(false);
                Browser.isChrome = jest.fn().mockReturnValue(false);
                Browser.isSafari = jest.fn().mockReturnValue(true);

                Browser.isMinBrowser = jest.fn(() => false);
                client = new ComServerClient(APP_NAME);

                HTTPChannel.mockImplementation(() => {
                    return {
                        getComServerStatus: jest.fn().mockRejectedValue(),
                    };
                });

                SafariChannel.mockImplementation(() => {
                    return {
                        getComServerStatus: jest.fn().mockRejectedValue(),
                    };
                });

                ActiveXChannel.mockImplementation(() => {
                    return {
                        getComServerStatus: jest.fn().mockRejectedValue(),
                    };
                });

                await expect(client.getComServerStatus()).rejects.toThrow(CONSTANTS.BOX_EDIT_UPGRADE_BROWSER_ERROR);
            });

            test('should return an upgrade browser message when  user is on a Firefox that does not support Box Tools v4', async () => {
                // arrange
                Browser.isFirefox = jest.fn().mockReturnValue(true);
                Browser.isChrome = jest.fn().mockReturnValue(false);
                Browser.isSafari = jest.fn().mockReturnValue(false);

                Browser.isMinBrowser = jest.fn(() => false);

                client = new ComServerClient(APP_NAME);

                // act
                await expect(client.getComServerStatus()).rejects.toThrow(CONSTANTS.BOX_EDIT_UPGRADE_BROWSER_ERROR);
            });

            test('should return an upgrade browser message with EOL enabled and user is on a Chrome that does not support Box Tools v4', async () => {
                // arrange
                Browser.isFirefox = jest.fn().mockReturnValue(false);
                Browser.isChrome = jest.fn().mockReturnValue(true);
                Browser.isSafari = jest.fn().mockReturnValue(false);

                Browser.isMinBrowser = jest.fn(() => false);

                client = new ComServerClient(APP_NAME);

                HTTPChannel.mockImplementation(() => {
                    return {
                        getComServerStatus: jest.fn().mockRejectedValue(),
                    };
                });

                SafariChannel.mockImplementation(() => {
                    return {
                        getComServerStatus: jest.fn().mockRejectedValue(),
                    };
                });

                ActiveXChannel.mockImplementation(() => {
                    return {
                        getComServerStatus: jest.fn().mockRejectedValue(),
                    };
                });

                await expect(client.getComServerStatus()).rejects.toThrow(CONSTANTS.BOX_EDIT_UPGRADE_BROWSER_ERROR);
            });
        });
    });
});
