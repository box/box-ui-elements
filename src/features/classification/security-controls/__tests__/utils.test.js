import messages from '../messages';
import appRestrictionsMessageMap from '../appRestrictionsMessageMap';
import downloadRestrictionsMessageMap from '../downloadRestrictionsMessageMap';
import { getShortSecurityControlsMessage, getFullSecurityControlsMessages } from '../utils';
import {
    APP_RESTRICTION_MESSAGE_TYPE,
    DOWNLOAD_CONTROL,
    LIST_ACCESS_LEVEL,
    MANAGED_USERS_ACCESS_LEVEL,
    SHARED_LINK_ACCESS_LEVEL,
} from '../../constants';

const { DEFAULT, WITH_APP_LIST, WITH_OVERFLOWN_APP_LIST } = APP_RESTRICTION_MESSAGE_TYPE;
const { DESKTOP, MOBILE, WEB } = DOWNLOAD_CONTROL;
const { BLOCK, WHITELIST, BLACKLIST } = LIST_ACCESS_LEVEL;
const { OWNERS_AND_COOWNERS, OWNERS_COOWNERS_AND_EDITORS } = MANAGED_USERS_ACCESS_LEVEL;
const { COLLAB_ONLY, COLLAB_AND_COMPANY_ONLY, PUBLIC } = SHARED_LINK_ACCESS_LEVEL;

describe('features/classification/security-controls/utils', () => {
    let accessPolicy;

    beforeEach(() => {
        accessPolicy = {};
    });

    describe('getShortSecurityControlsMessage()', () => {
        test('should return null when there are no restrictions', () => {
            expect(getShortSecurityControlsMessage({})).toEqual([]);
        });

        test('should not return messages when shared link restriction has a "public" access level', () => {
            accessPolicy = { sharedLink: { accessLevel: PUBLIC } };
            expect(getShortSecurityControlsMessage(accessPolicy)).toEqual([]);
        });

        test('should return correct message when all restrictions are present', () => {
            accessPolicy = { sharedLink: {}, download: {}, externalCollab: {}, app: {}, watermark: {} };
            expect(getShortSecurityControlsMessage(accessPolicy)[0].message).toBe(messages.shortAllRestrictions);
            expect(getShortSecurityControlsMessage(accessPolicy)[1].message).toBe(messages.shortWatermarking);
        });

        test('should return all restrictions message when download, app and either shared link, or external collab restrictions are present', () => {
            accessPolicy = { sharedLink: {}, download: {}, app: {} };
            expect(getShortSecurityControlsMessage(accessPolicy)[0].message).toBe(messages.shortAllRestrictions);
            accessPolicy = { externalCollab: {}, download: {}, app: {} };
            expect(getShortSecurityControlsMessage(accessPolicy)[0].message).toBe(messages.shortAllRestrictions);
        });

        test('should return correct message when download and either shared link, or external collab restrictions are present', () => {
            accessPolicy = { sharedLink: {}, download: {} };
            expect(getShortSecurityControlsMessage(accessPolicy)[0].message).toBe(messages.shortSharingDownload);
            accessPolicy = { externalCollab: {}, download: {} };
            expect(getShortSecurityControlsMessage(accessPolicy)[0].message).toBe(messages.shortSharingDownload);
        });

        test('should return correct message when app and either shared link, or external collab restrictions are present', () => {
            accessPolicy = { sharedLink: {}, app: {} };
            expect(getShortSecurityControlsMessage(accessPolicy)[0].message).toBe(messages.shortSharingApp);
            accessPolicy = { externalCollab: {}, app: {} };
            expect(getShortSecurityControlsMessage(accessPolicy)[0].message).toBe(messages.shortSharingApp);
        });

        test('should return correct message when app and download restrictions are present', () => {
            accessPolicy = { download: {}, app: {} };
            expect(getShortSecurityControlsMessage(accessPolicy)[0].message).toBe(messages.shortDownloadApp);
        });

        test('should return correct message when there are shared link or external collab restrictions', () => {
            accessPolicy = { sharedLink: {}, externalCollab: {} };
            expect(getShortSecurityControlsMessage(accessPolicy)[0].message).toBe(messages.shortSharing);

            accessPolicy = { sharedLink: {} };
            expect(getShortSecurityControlsMessage(accessPolicy)[0].message).toBe(messages.shortSharing);

            accessPolicy = { externalCollab: {} };
            expect(getShortSecurityControlsMessage(accessPolicy)[0].message).toBe(messages.shortSharing);
        });

        test('should return correct message when there is a download restriction', () => {
            accessPolicy = { download: {} };
            expect(getShortSecurityControlsMessage(accessPolicy)[0].message).toBe(messages.shortDownload);
        });

        test('should return correct message when there is a download restriction', () => {
            accessPolicy = { app: {} };
            expect(getShortSecurityControlsMessage(accessPolicy)[0].message).toBe(messages.shortApp);
        });

        test('should return correct message when there is a watermark restriction', () => {
            accessPolicy = { watermark: {} };
            expect(getShortSecurityControlsMessage(accessPolicy)[0].message).toBe(messages.shortWatermarking);
        });

        test('should not return tooltipMessage', () => {
            accessPolicy = { sharedLink: {}, download: {}, externalCollab: {}, app: {} };
            expect(getShortSecurityControlsMessage(accessPolicy)[0].tooltipMessage).toBeUndefined();
        });
    });

    describe('getFullSecurityControlsMessages()', () => {
        test('should include correct message when shared link is restricted to collaborators', () => {
            accessPolicy = {
                sharedLink: {
                    accessLevel: COLLAB_ONLY,
                },
            };
            expect(getFullSecurityControlsMessages(accessPolicy)).toEqual([{ message: messages.sharingCollabOnly }]);
        });

        test('should include correct message when shared link is restricted to collaborators and company', () => {
            accessPolicy = {
                sharedLink: {
                    accessLevel: COLLAB_AND_COMPANY_ONLY,
                },
            };
            expect(getFullSecurityControlsMessages(accessPolicy)).toEqual([
                { message: messages.sharingCollabAndCompanyOnly },
            ]);
        });

        test('should include correct message when watermark is applied', () => {
            accessPolicy = {
                watermark: {
                    enabled: true,
                },
            };
            expect(getFullSecurityControlsMessages(accessPolicy)).toEqual([{ message: messages.watermarkingApplied }]);
        });

        test('should include correct message when external collab is blocked', () => {
            accessPolicy = {
                externalCollab: {
                    accessLevel: BLOCK,
                },
            };
            expect(getFullSecurityControlsMessages(accessPolicy)).toEqual([{ message: messages.externalCollabBlock }]);
        });

        test.each([WHITELIST, BLACKLIST])(
            'should include correct message when external collab is restricted to %s',
            listType => {
                accessPolicy = {
                    externalCollab: {
                        accessLevel: listType,
                    },
                };
                expect(getFullSecurityControlsMessages(accessPolicy)).toEqual([
                    { message: messages.externalCollabDomainList },
                ]);
            },
        );

        test('should include correct message when app download is blocked', () => {
            accessPolicy = {
                app: {
                    accessLevel: BLOCK,
                },
            };
            expect(getFullSecurityControlsMessages(accessPolicy)).toEqual([
                { message: messages.appDownloadRestricted },
            ]);
        });

        test.each([WHITELIST, BLACKLIST])(
            'should include correct message when app download is restricted by %s and apps list is not provided',
            listType => {
                accessPolicy = {
                    app: {
                        accessLevel: listType,
                        apps: [],
                    },
                };
                const expectedMessage = appRestrictionsMessageMap[listType][DEFAULT];

                expect(expectedMessage).toBeTruthy();
                expect(getFullSecurityControlsMessages(accessPolicy, 3)).toEqual([
                    {
                        message: {
                            ...expectedMessage,
                            values: { appNames: '' },
                        },
                    },
                ]);
            },
        );

        test.each([WHITELIST, BLACKLIST])(
            'should include correct message when app download is restricted by %s and apps are less than maxAppCount',
            listType => {
                accessPolicy = {
                    app: {
                        accessLevel: listType,
                        apps: [{ displayText: 'a' }, { displayText: 'b' }, { displayText: 'c' }],
                    },
                };
                const expectedMessage = appRestrictionsMessageMap[listType][WITH_APP_LIST];

                expect(expectedMessage).toBeTruthy();
                expect(getFullSecurityControlsMessages(accessPolicy, 3)).toEqual([
                    {
                        message: {
                            ...expectedMessage,
                            values: { appNames: 'a, b, c' },
                        },
                    },
                ]);
            },
        );

        test.each([WHITELIST, BLACKLIST])(
            'should include correct message and tooltipMessage when app download is restricted by %s and apps are maxAppCount or more',
            listType => {
                accessPolicy = {
                    app: {
                        accessLevel: listType,
                        apps: [
                            { displayText: 'a' },
                            { displayText: 'b' },
                            { displayText: 'c' },
                            { displayText: 'd' },
                            { displayText: 'e' },
                        ],
                    },
                };
                const expectedMessage = appRestrictionsMessageMap[listType][WITH_OVERFLOWN_APP_LIST];

                expect(expectedMessage).toBeTruthy();
                expect(getFullSecurityControlsMessages(accessPolicy, 3)).toEqual([
                    {
                        message: {
                            ...expectedMessage,
                            values: { appNames: 'a, b, c', remainingAppCount: 2 },
                        },
                        tooltipMessage: {
                            ...messages.allAppNames,
                            values: { appsList: 'a, b, c, d, e' },
                        },
                    },
                ]);
            },
        );

        describe.each([DESKTOP, MOBILE, WEB])('%s download restriction', platform => {
            test.each([OWNERS_AND_COOWNERS, OWNERS_COOWNERS_AND_EDITORS])(
                'should include correct message when both external and "%s" managed users are restricted',
                managedUsersCombo => {
                    accessPolicy.download = {
                        [platform]: {
                            restrictManagedUsers: managedUsersCombo,
                            restrictExternalUsers: true,
                        },
                    };

                    expect(getFullSecurityControlsMessages(accessPolicy)).toEqual([
                        { message: downloadRestrictionsMessageMap[platform].externalRestricted[managedUsersCombo] },
                    ]);
                },
            );

            test.each([OWNERS_AND_COOWNERS, OWNERS_COOWNERS_AND_EDITORS])(
                'should include correct message when "%s" managed users are restricted',
                managedUsersCombo => {
                    accessPolicy.download = {
                        [platform]: {
                            restrictManagedUsers: managedUsersCombo,
                            restrictExternalUsers: false,
                        },
                    };

                    expect(getFullSecurityControlsMessages(accessPolicy)).toEqual([
                        { message: downloadRestrictionsMessageMap[platform].externalAllowed[managedUsersCombo] },
                    ]);
                },
            );

            test('should include correct message when external users are restricted', () => {
                accessPolicy.download = {
                    [platform]: {
                        restrictExternalUsers: true,
                    },
                };

                expect(getFullSecurityControlsMessages(accessPolicy)).toEqual([
                    { message: downloadRestrictionsMessageMap[platform].externalRestricted.default },
                ]);
            });
        });
    });
});
