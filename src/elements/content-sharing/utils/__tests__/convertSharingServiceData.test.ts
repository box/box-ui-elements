import {
    ACCESS_COLLAB,
    ACCESS_COMPANY,
    ACCESS_OPEN,
    PERMISSION_CAN_DOWNLOAD,
    PERMISSION_CAN_EDIT,
    PERMISSION_CAN_PREVIEW,
} from '../../../../constants';
import { convertISOStringToUTCDate } from '../../../../utils/datetime';
import { convertSharedLinkPermissions, convertSharedLinkSettings } from '../convertSharingServiceData';

jest.mock('../../../../utils/datetime', () => ({
    ...jest.requireActual('../../../../utils/datetime'),
    convertISOStringToUTCDate: jest.fn(),
}));

describe('elements/content-sharing/utils/convertSharingServiceData', () => {
    beforeEach(() => {
        // Mock convertISOStringToUTCDate to return a the same date as the expiration date to simplify the test logic
        (convertISOStringToUTCDate as jest.Mock).mockReturnValue(new Date('2024-12-31T23:59:59Z'));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('convertSharedLinkPermissions', () => {
        test.each([
            [
                PERMISSION_CAN_DOWNLOAD,
                { [PERMISSION_CAN_DOWNLOAD]: true, [PERMISSION_CAN_EDIT]: false, [PERMISSION_CAN_PREVIEW]: false },
            ],
            [
                PERMISSION_CAN_EDIT,
                { [PERMISSION_CAN_DOWNLOAD]: true, [PERMISSION_CAN_EDIT]: true, [PERMISSION_CAN_PREVIEW]: false },
            ],
            [
                PERMISSION_CAN_PREVIEW,
                { [PERMISSION_CAN_DOWNLOAD]: false, [PERMISSION_CAN_EDIT]: false, [PERMISSION_CAN_PREVIEW]: true },
            ],
        ])('should return correct permissions for %s permission level', (permissionLevel, expected) => {
            const result = convertSharedLinkPermissions(permissionLevel);
            expect(result).toEqual(expected);
        });

        test('should handle empty string permission level', () => {
            const result = convertSharedLinkPermissions('');
            expect(result).toEqual({});
        });
    });

    describe('convertSharedLinkSettings', () => {
        const mockServerUrl = 'https://example.com/server-url/';
        const mockSettings = {
            expiration: new Date('2024-12-31T23:59:59Z'),
            isDownloadEnabled: true,
            isExpirationEnabled: true,
            isPasswordEnabled: true,
            password: 'test-password',
            vanityName: 'vanity-name',
        };

        describe('basic conversion', () => {
            test('should return settings with correct values', () => {
                const result = convertSharedLinkSettings(mockSettings, ACCESS_OPEN, true, mockServerUrl);

                expect(result).toEqual({
                    password: 'test-password',
                    permissions: {
                        can_preview: false,
                        can_download: true,
                    },
                    unshared_at: '2024-12-31T23:59:59.000Z',
                    vanity_url: 'https://example.com/server-url/vanity-name',
                });
            });

            test('should handle minimal settings', () => {
                const minimalSettings = {
                    expiration: null,
                    isDownloadEnabled: false,
                    isExpirationEnabled: false,
                    isPasswordEnabled: false,
                    password: '',
                    vanityName: '',
                };

                const result = convertSharedLinkSettings(minimalSettings, ACCESS_OPEN, false, '');

                expect(result).toEqual({
                    password: null,
                    permissions: {
                        can_preview: true,
                    },
                    unshared_at: null,
                    vanity_url: '',
                });
            });
        });

        describe('expiration handling', () => {
            test('should set unshared_at to null when expiration is disabled', () => {
                const settingsWithoutExpiration = {
                    ...mockSettings,
                    isExpirationEnabled: false,
                    expiration: new Date('2024-12-31T23:59:59Z'),
                };

                const result = convertSharedLinkSettings(settingsWithoutExpiration, ACCESS_OPEN, true, mockServerUrl);

                expect(result.unshared_at).toBeNull();
            });

            test.each([null, undefined])('should set unshared_at to null when expiration is %s', expiration => {
                const settingsWithNullExpiration = {
                    ...mockSettings,
                    isExpirationEnabled: true,
                    expiration,
                };

                const result = convertSharedLinkSettings(settingsWithNullExpiration, ACCESS_OPEN, true, mockServerUrl);

                expect(result.unshared_at).toBeNull();
            });

            test('should omit unshared_at when the date field submits the saved local calendar day', () => {
                const saved = new Date('2026-10-15T23:59:00-07:00');
                const submittedDay = [
                    saved.getFullYear(),
                    String(saved.getMonth() + 1).padStart(2, '0'),
                    String(saved.getDate()).padStart(2, '0'),
                ].join('-');
                const settings = {
                    ...mockSettings,
                    expiration: submittedDay,
                    isDownloadEnabled: false,
                };

                const result = convertSharedLinkSettings(settings, ACCESS_OPEN, true, mockServerUrl, saved.getTime());

                expect(result.unshared_at).toBeUndefined();
                expect(result.permissions).toEqual({ can_preview: true, can_download: false });
            });

            test('should omit unshared_at when the submitted date is the same local calendar day', () => {
                const settings = {
                    ...mockSettings,
                    expiration: new Date(2024, 11, 31, 0, 0, 0),
                };

                const result = convertSharedLinkSettings(
                    settings,
                    ACCESS_OPEN,
                    true,
                    mockServerUrl,
                    new Date(2024, 11, 31, 18, 30, 0).getTime(),
                );

                expect(result.unshared_at).toBeUndefined();
            });

            test('should include unshared_at when the submitted date is a different local calendar day', () => {
                const settings = {
                    ...mockSettings,
                    expiration: new Date(2024, 11, 31, 0, 0, 0),
                };

                const result = convertSharedLinkSettings(
                    settings,
                    ACCESS_OPEN,
                    true,
                    mockServerUrl,
                    new Date(2024, 11, 30, 23, 0, 0).getTime(),
                );

                expect(result.unshared_at).toBe('2024-12-31T23:59:59.000Z');
            });

            test('should include unshared_at when expiration is toggled on and there was no current expiration', () => {
                const result = convertSharedLinkSettings(mockSettings, ACCESS_OPEN, true, mockServerUrl, null);

                expect(result.unshared_at).toBe('2024-12-31T23:59:59.000Z');
            });

            test('should set unshared_at to null when expiration is toggled off and there was a current expiration', () => {
                const settingsWithoutExpiration = {
                    ...mockSettings,
                    isExpirationEnabled: false,
                };

                const result = convertSharedLinkSettings(
                    settingsWithoutExpiration,
                    ACCESS_OPEN,
                    true,
                    mockServerUrl,
                    new Date(2024, 11, 31, 18, 30, 0).getTime(),
                );

                expect(result.unshared_at).toBeNull();
            });

            test('should include unshared_at when the current expiration argument is omitted', () => {
                const result = convertSharedLinkSettings(mockSettings, ACCESS_OPEN, true, mockServerUrl);

                expect(result.unshared_at).toBe('2024-12-31T23:59:59.000Z');
            });

            describe('which shared link fields are sent together', () => {
                const sameDay = new Date(2024, 11, 31, 18, 30, 0).getTime();
                const otherDay = new Date(2024, 11, 30, 23, 0, 0).getTime();
                const sameDaySettings = {
                    ...mockSettings,
                    expiration: new Date(2024, 11, 31, 0, 0, 0),
                };

                test.each([
                    {
                        name: 'day - same, download, vanity name, no expiration',
                        inputs: {
                            settings: { ...sameDaySettings, isDownloadEnabled: true, vanityName: 'vanity-name' },
                            access: ACCESS_COMPANY,
                            isDownloadAvailable: true,
                            serverUrl: mockServerUrl,
                            currentExpiresAt: sameDay,
                        },
                        expected_body: {
                            permissions: { can_preview: false, can_download: true },
                            vanity_url: 'https://example.com/server-url/vanity-name',
                        },
                    },
                    {
                        name: 'day - same, download, no vanity name, no expiration',
                        inputs: {
                            settings: { ...sameDaySettings, isDownloadEnabled: true, vanityName: '' },
                            access: ACCESS_COMPANY,
                            isDownloadAvailable: true,
                            serverUrl: '',
                            currentExpiresAt: sameDay,
                        },
                        expected_body: {
                            permissions: { can_preview: false, can_download: true },
                            vanity_url: '',
                        },
                    },
                    {
                        name: 'day - same, vanity name, download off, no expiration',
                        inputs: {
                            settings: { ...sameDaySettings, isDownloadEnabled: false, vanityName: 'vanity-name' },
                            access: ACCESS_COMPANY,
                            isDownloadAvailable: true,
                            serverUrl: mockServerUrl,
                            currentExpiresAt: sameDay,
                        },
                        expected_body: {
                            permissions: { can_preview: true, can_download: false },
                            vanity_url: 'https://example.com/server-url/vanity-name',
                        },
                    },
                    {
                        name: 'day - same, download off, no vanity name, no expiration',
                        inputs: {
                            settings: { ...sameDaySettings, isDownloadEnabled: false, vanityName: '' },
                            access: ACCESS_COMPANY,
                            isDownloadAvailable: true,
                            serverUrl: '',
                            currentExpiresAt: sameDay,
                        },
                        expected_body: {
                            permissions: { can_preview: true, can_download: false },
                            vanity_url: '',
                        },
                    },
                    {
                        name: 'day - different, expiration, download, vanity name',
                        inputs: {
                            settings: { ...sameDaySettings, isDownloadEnabled: true, vanityName: 'vanity-name' },
                            access: ACCESS_COMPANY,
                            isDownloadAvailable: true,
                            serverUrl: mockServerUrl,
                            currentExpiresAt: otherDay,
                        },
                        expected_body: {
                            permissions: { can_preview: false, can_download: true },
                            unshared_at: '2024-12-31T23:59:59.000Z',
                            vanity_url: 'https://example.com/server-url/vanity-name',
                        },
                    },
                    {
                        name: 'day - different, expiration, download, no vanity name',
                        inputs: {
                            settings: { ...sameDaySettings, isDownloadEnabled: true, vanityName: '' },
                            access: ACCESS_COMPANY,
                            isDownloadAvailable: true,
                            serverUrl: '',
                            currentExpiresAt: otherDay,
                        },
                        expected_body: {
                            permissions: { can_preview: false, can_download: true },
                            unshared_at: '2024-12-31T23:59:59.000Z',
                            vanity_url: '',
                        },
                    },
                    {
                        name: 'day - different, expiration, vanity name, download off',
                        inputs: {
                            settings: { ...sameDaySettings, isDownloadEnabled: false, vanityName: 'vanity-name' },
                            access: ACCESS_COMPANY,
                            isDownloadAvailable: true,
                            serverUrl: mockServerUrl,
                            currentExpiresAt: otherDay,
                        },
                        expected_body: {
                            permissions: { can_preview: true, can_download: false },
                            unshared_at: '2024-12-31T23:59:59.000Z',
                            vanity_url: 'https://example.com/server-url/vanity-name',
                        },
                    },
                    {
                        name: 'day - different, expiration, download off, no vanity name',
                        inputs: {
                            settings: { ...sameDaySettings, isDownloadEnabled: false, vanityName: '' },
                            access: ACCESS_COMPANY,
                            isDownloadAvailable: true,
                            serverUrl: '',
                            currentExpiresAt: otherDay,
                        },
                        expected_body: {
                            permissions: { can_preview: true, can_download: false },
                            unshared_at: '2024-12-31T23:59:59.000Z',
                            vanity_url: '',
                        },
                    },
                    {
                        name: 'day - off, expiration null, download, vanity name',
                        inputs: {
                            settings: {
                                ...sameDaySettings,
                                isDownloadEnabled: true,
                                isExpirationEnabled: false,
                                vanityName: 'vanity-name',
                            },
                            access: ACCESS_COMPANY,
                            isDownloadAvailable: true,
                            serverUrl: mockServerUrl,
                            currentExpiresAt: sameDay,
                        },
                        expected_body: {
                            permissions: { can_preview: false, can_download: true },
                            unshared_at: null,
                            vanity_url: 'https://example.com/server-url/vanity-name',
                        },
                    },
                    {
                        name: 'day - off, expiration null, download, no vanity name',
                        inputs: {
                            settings: {
                                ...sameDaySettings,
                                isDownloadEnabled: true,
                                isExpirationEnabled: false,
                                vanityName: '',
                            },
                            access: ACCESS_COMPANY,
                            isDownloadAvailable: true,
                            serverUrl: '',
                            currentExpiresAt: sameDay,
                        },
                        expected_body: {
                            permissions: { can_preview: false, can_download: true },
                            unshared_at: null,
                            vanity_url: '',
                        },
                    },
                    {
                        name: 'day - off, expiration null, vanity name, download off',
                        inputs: {
                            settings: {
                                ...sameDaySettings,
                                isDownloadEnabled: false,
                                isExpirationEnabled: false,
                                vanityName: 'vanity-name',
                            },
                            access: ACCESS_COMPANY,
                            isDownloadAvailable: true,
                            serverUrl: mockServerUrl,
                            currentExpiresAt: sameDay,
                        },
                        expected_body: {
                            permissions: { can_preview: true, can_download: false },
                            unshared_at: null,
                            vanity_url: 'https://example.com/server-url/vanity-name',
                        },
                    },
                    {
                        name: 'day - off, expiration null, download off, no vanity name',
                        inputs: {
                            settings: {
                                ...sameDaySettings,
                                isDownloadEnabled: false,
                                isExpirationEnabled: false,
                                vanityName: '',
                            },
                            access: ACCESS_COMPANY,
                            isDownloadAvailable: true,
                            serverUrl: '',
                            currentExpiresAt: sameDay,
                        },
                        expected_body: {
                            permissions: { can_preview: true, can_download: false },
                            unshared_at: null,
                            vanity_url: '',
                        },
                    },
                ])('$name', ({ inputs, expected_body }) => {
                    const { settings, access, isDownloadAvailable, serverUrl, currentExpiresAt } = inputs;
                    const result =
                        currentExpiresAt === undefined
                            ? convertSharedLinkSettings(settings, access, isDownloadAvailable, serverUrl)
                            : convertSharedLinkSettings(
                                  settings,
                                  access,
                                  isDownloadAvailable,
                                  serverUrl,
                                  currentExpiresAt,
                              );

                    expect(result).toEqual(expected_body);
                });
            });
        });

        describe('vanity URL', () => {
            test.each([
                ['', ''],
                ['', 'vanity-name'],
                ['https://example.com/server-url/', ''],
            ])(
                'should return empty string when at least one of serverURL or vanityName is empty',
                (serverUrl, vanityName) => {
                    const result = convertSharedLinkSettings(
                        { ...mockSettings, vanityName },
                        ACCESS_OPEN,
                        true,
                        serverUrl,
                    );

                    expect(result.vanity_url).toBe('');
                },
            );
        });

        describe('permissions handling', () => {
            test('should not set permissions for ACCESS_COLLAB access level', () => {
                const result = convertSharedLinkSettings(mockSettings, ACCESS_COLLAB, true, mockServerUrl);

                expect(result.permissions).toBeUndefined();
            });

            test('should set permissions with download disabled when isDownloadEnabled is false', () => {
                const settingsWithDownloadDisabled = {
                    ...mockSettings,
                    isDownloadEnabled: false,
                };

                const result = convertSharedLinkSettings(
                    settingsWithDownloadDisabled,
                    ACCESS_OPEN,
                    true,
                    mockServerUrl,
                );

                expect(result.permissions).toEqual({
                    can_preview: true,
                    can_download: false,
                });
            });

            test('should not set can_download when isDownloadAvailable is false', () => {
                const result = convertSharedLinkSettings(mockSettings, ACCESS_OPEN, false, mockServerUrl);

                expect(result.permissions).toEqual({
                    can_preview: false,
                });
                expect(result.permissions.can_download).toBeUndefined();
            });
        });

        describe('password handling', () => {
            test('should set password to null when isPasswordEnabled is false', () => {
                const settingsWithPasswordDisabled = {
                    ...mockSettings,
                    isPasswordEnabled: false,
                    password: 'existingpassword',
                };

                const result = convertSharedLinkSettings(
                    settingsWithPasswordDisabled,
                    ACCESS_OPEN,
                    true,
                    mockServerUrl,
                );

                expect(result.password).toBeNull();
            });

            test('should not set password when isPasswordEnabled is true but password is empty', () => {
                const settingsWithEmptyPassword = {
                    ...mockSettings,
                    isPasswordEnabled: true,
                    password: '',
                };

                const result = convertSharedLinkSettings(settingsWithEmptyPassword, ACCESS_OPEN, true, mockServerUrl);

                expect(result.password).toBeUndefined();
            });

            test.each([ACCESS_COLLAB, ACCESS_COMPANY])('should not set password for non open access level', access => {
                const result = convertSharedLinkSettings(mockSettings, access, true, mockServerUrl);

                expect(result.password).toBeUndefined();
            });
        });
    });
});
