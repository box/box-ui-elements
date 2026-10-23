import { parseDate } from '@box/blueprint-web';

import { convertSharedLinkPermissions, convertSharedLinkSettings } from '../convertSharingServiceData';

import {
    ACCESS_COLLAB,
    ACCESS_COMPANY,
    ACCESS_OPEN,
    PERMISSION_CAN_DOWNLOAD,
    PERMISSION_CAN_EDIT,
    PERMISSION_CAN_PREVIEW,
} from '../../../../constants';

describe('elements/content-sharing/utils/convertSharingServiceData', () => {
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
            expiration: parseDate('2024-12-31'),
            isDownloadEnabled: true,
            isExpirationEnabled: true,
            isOtpEnabled: false,
            isPasswordEnabled: true,
            isVanityNameEnabled: true,
            otpMode: 'none' as const,
            password: 'test-password',
            vanityName: 'vanity-name',
        };
        const mockPrevSettings = {
            canChangeExpiration: true,
            isDownloadAvailable: true,
            otpMode: 'none' as const,
        };

        describe('basic conversion', () => {
            test('should return settings with correct values', () => {
                const result = convertSharedLinkSettings(mockSettings, mockPrevSettings, ACCESS_OPEN, mockServerUrl);

                expect(result).toEqual({
                    password: 'test-password',
                    permissions: {
                        can_preview: false,
                        can_download: true,
                    },
                    unshared_at: '2024-12-31T08:00:00.000Z',
                    vanity_url: 'https://example.com/server-url/vanity-name',
                });
            });

            test('should handle minimal settings', () => {
                const nextSettings = {
                    expiration: null,
                    isDownloadEnabled: false,
                    isExpirationEnabled: false,
                    isOtpEnabled: false,
                    isPasswordEnabled: false,
                    isVanityNameEnabled: false,
                    otpMode: 'none' as const,
                    password: '',
                    vanityName: '',
                };
                const prevSettings = {
                    ...mockPrevSettings,
                    canChangeExpiration: false,
                    isDownloadAvailable: false,
                };

                const result = convertSharedLinkSettings(nextSettings, prevSettings, ACCESS_OPEN, '');

                expect(result).toEqual({
                    password: null,
                    permissions: {
                        can_preview: true,
                    },
                    vanity_url: '',
                });
            });
        });

        describe('expiration handling', () => {
            test('should set unshared_at to null when expiration is disabled', () => {
                const nextSettings = {
                    ...mockSettings,
                    isExpirationEnabled: false,
                    expiration: parseDate('2024-12-31'),
                };

                const result = convertSharedLinkSettings(nextSettings, mockPrevSettings, ACCESS_OPEN, mockServerUrl);

                expect(result.unshared_at).toBeNull();
            });

            test.each([null, undefined])('should set unshared_at to null when expiration is %s', expiration => {
                const nextSettings = {
                    ...mockSettings,
                    isExpirationEnabled: true,
                    expiration,
                };

                const result = convertSharedLinkSettings(nextSettings, mockPrevSettings, ACCESS_OPEN, mockServerUrl);

                expect(result.unshared_at).toBeNull();
            });
        });

        describe('vanity handling', () => {
            test.each([
                ['', ''],
                ['', 'vanity-name'],
                ['https://example.com/server-url/', ''],
            ])(
                'should return empty string when at least one of serverURL or vanityName is empty',
                (serverUrl, vanityName) => {
                    const nextSettings = {
                        ...mockSettings,
                        vanityName,
                    };

                    const result = convertSharedLinkSettings(nextSettings, mockPrevSettings, ACCESS_OPEN, serverUrl);

                    expect(result.vanity_url).toBe('');
                },
            );
        });

        describe('permissions handling', () => {
            test('should not set permissions for ACCESS_COLLAB access level', () => {
                const result = convertSharedLinkSettings(mockSettings, mockPrevSettings, ACCESS_COLLAB, mockServerUrl);

                expect(result.permissions).toBeUndefined();
            });

            test('should set permissions with download disabled when isDownloadEnabled is false', () => {
                const nextSettings = {
                    ...mockSettings,
                    isDownloadEnabled: false,
                };

                const result = convertSharedLinkSettings(nextSettings, mockPrevSettings, ACCESS_OPEN, mockServerUrl);

                expect(result.permissions).toEqual({
                    can_preview: true,
                    can_download: false,
                });
            });

            test('should not set can_download when isDownloadAvailable is false', () => {
                const prevSettings = {
                    ...mockPrevSettings,
                    isDownloadAvailable: false,
                };

                const result = convertSharedLinkSettings(mockSettings, prevSettings, ACCESS_OPEN, mockServerUrl);

                expect(result.permissions).toEqual({
                    can_preview: false,
                });
                expect(result.permissions.can_download).toBeUndefined();
            });
        });

        describe('password handling', () => {
            test('should set password to null when isPasswordEnabled is false', () => {
                const nextSettings = {
                    ...mockSettings,
                    isPasswordEnabled: false,
                    password: 'existingpassword',
                };

                const result = convertSharedLinkSettings(nextSettings, mockPrevSettings, ACCESS_OPEN, mockServerUrl);

                expect(result.password).toBeNull();
            });

            test('should not set password when isPasswordEnabled is true but password is empty', () => {
                const nextSettings = {
                    ...mockSettings,
                    isPasswordEnabled: true,
                    password: '',
                };

                const result = convertSharedLinkSettings(nextSettings, mockPrevSettings, ACCESS_OPEN, mockServerUrl);

                expect(result.password).toBeUndefined();
            });

            test.each([ACCESS_COLLAB, ACCESS_COMPANY])('should not set password for non open access level', access => {
                const result = convertSharedLinkSettings(mockSettings, mockPrevSettings, access, mockServerUrl);

                expect(result.password).toBeUndefined();
            });
        });
    });
});
