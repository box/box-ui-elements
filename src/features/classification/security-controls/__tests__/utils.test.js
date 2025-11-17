import messages from '../messages';
import appRestrictionsMessageMap from '../appRestrictionsMessageMap';
import integrationRestrictionsMessageMap from '../integrationRestrictionsMessageMap';
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
    const allSecurityControls = {
        sharedLink: {},
        download: {},
        externalCollab: {},
        app: {},
        watermark: {},
        boxSignRequest: {},
    };

    beforeEach(() => {
        accessPolicy = {};
    });

    describe('getShortSecurityControlsMessage()', () => {
        test.each`
            securityControls                                                                            | expectedMessages                                                      | description
            ${{}}                                                                                       | ${[]}                                                                 | ${'there are no restrictions'}
            ${allSecurityControls}                                                                      | ${[messages.shortSharingDownloadAppSign, messages.shortWatermarking]} | ${'all restrictions are present'}
            ${{ sharedLink: { accessLevel: PUBLIC } }}                                                  | ${[]}                                                                 | ${'shared link restriction has a "public" access level'}
            ${{ sharedLink: {}, download: {}, app: {} }}                                                | ${[messages.shortSharingDownloadApp]}                                 | ${'download, app and shared link restrictions are present'}
            ${{ externalCollab: {}, download: {}, app: {} }}                                            | ${[messages.shortSharingDownloadApp]}                                 | ${'download, app and external collab restrictions are present'}
            ${{ download: {}, app: {}, boxSignRequest: {} }}                                            | ${[messages.shortDownloadAppSign]}                                    | ${'download, app and sign restrictions are present'}
            ${{ app: {}, boxSignRequest: {}, sharedLink: {} }}                                          | ${[messages.shortSharingAppSign]}                                     | ${'app, sign and shared link restrictions are present'}
            ${{ app: {}, boxSignRequest: {}, externalCollab: {} }}                                      | ${[messages.shortSharingAppSign]}                                     | ${'app, sign and external collab restrictions are present'}
            ${{ download: {}, boxSignRequest: {}, sharedLink: {} }}                                     | ${[messages.shortSharingDownloadSign]}                                | ${'download, sign and shared link restrictions are present'}
            ${{ download: {}, boxSignRequest: {}, externalCollab: {} }}                                 | ${[messages.shortSharingDownloadSign]}                                | ${'download, sign and external collab restrictions are present'}
            ${{ sharedLink: {}, boxSignRequest: {} }}                                                   | ${[messages.shortSharingSign]}                                        | ${'sign and shared link restrictions are present'}
            ${{ externalCollab: {}, boxSignRequest: {} }}                                               | ${[messages.shortSharingSign]}                                        | ${'sign and external collab restrictions are present'}
            ${{ download: {}, boxSignRequest: {} }}                                                     | ${[messages.shortDownloadSign]}                                       | ${'download and sign restrictions are present'}
            ${{ app: {}, boxSignRequest: {} }}                                                          | ${[messages.shortAppSign]}                                            | ${'app and sign restrictions are present'}
            ${{ sharedLink: {}, download: {} }}                                                         | ${[messages.shortSharingDownload]}                                    | ${'download and shared link restrictions are present'}
            ${{ externalCollab: {}, download: {} }}                                                     | ${[messages.shortSharingDownload]}                                    | ${'download and external collab restrictions are present'}
            ${{ sharedLink: {}, app: {} }}                                                              | ${[messages.shortSharingApp]}                                         | ${'app and shared link restrictions are present'}
            ${{ externalCollab: {}, app: {} }}                                                          | ${[messages.shortSharingApp]}                                         | ${'app and external collab restrictions are present'}
            ${{ download: {}, app: {} }}                                                                | ${[messages.shortDownloadApp]}                                        | ${'app and download restrictions are present'}
            ${{ sharedLink: {}, externalCollab: {} }}                                                   | ${[messages.shortSharing]}                                            | ${'shared link and external collab restrictions are present'}
            ${{ sharedLink: {} }}                                                                       | ${[messages.shortSharing]}                                            | ${'shared link restrictions are present'}
            ${{ externalCollab: {} }}                                                                   | ${[messages.shortSharing]}                                            | ${'external collab restrictions are present'}
            ${{ download: {} }}                                                                         | ${[messages.shortDownload]}                                           | ${'download restrictions are present'}
            ${{ app: {} }}                                                                              | ${[messages.shortApp]}                                                | ${'app restrictions are present'}
            ${{ watermark: {} }}                                                                        | ${[messages.shortWatermarking]}                                       | ${'watermark restrictions are present'}
            ${{ boxSignRequest: {} }}                                                                   | ${[messages.shortSign]}                                               | ${'sign restrictions are present'}
            ${{ sharedLinkAutoExpiration: true }}                                                       | ${[messages.shortAutoExpiration]}                                     | ${'Auto-Expiration restriction is present'}
            ${{ sharedLinkAutoExpiration: true, download: {} }}                                         | ${[messages.shortDownloadAutoExpiration]}                             | ${'download and Auto-Expiration restrictions are present'}
            ${{ sharedLinkAutoExpiration: true, sharedLink: {} }}                                       | ${[messages.shortSharingAutoExpiration]}                              | ${'shared link and Auto-Expiration restrictions are present'}
            ${{ sharedLinkAutoExpiration: true, externalCollab: {} }}                                   | ${[messages.shortSharingAutoExpiration]}                              | ${'external collab and Auto-Expiration restrictions are present'}
            ${{ sharedLinkAutoExpiration: true, app: {} }}                                              | ${[messages.shortAppAutoExpiration]}                                  | ${'app and Auto-Expiration restrictions are present'}
            ${{ sharedLinkAutoExpiration: true, boxSignRequest: {} }}                                   | ${[messages.shortSignAutoExpiration]}                                 | ${'sign and Auto-Expiration restrictions are present'}
            ${{ sharedLinkAutoExpiration: true, sharedLink: {}, download: {} }}                         | ${[messages.shortSharingDownloadAutoExpiration]}                      | ${'shared link, download and Auto-Expiration restrictions are present'}
            ${{ sharedLinkAutoExpiration: true, externalCollab: {}, download: {} }}                     | ${[messages.shortSharingDownloadAutoExpiration]}                      | ${'external collab, download and Auto-Expiration restrictions are present'}
            ${{ sharedLinkAutoExpiration: true, sharedLink: {}, app: {} }}                              | ${[messages.shortSharingAppAutoExpiration]}                           | ${'shared link, app and Auto-Expiration restrictions are present'}
            ${{ sharedLinkAutoExpiration: true, externalCollab: {}, app: {} }}                          | ${[messages.shortSharingAppAutoExpiration]}                           | ${'external collab, app and Auto-Expiration restrictions are present'}
            ${{ sharedLinkAutoExpiration: true, sharedLink: {}, boxSignRequest: {} }}                   | ${[messages.shortSharingSignAutoExpiration]}                          | ${'shared link, sign and Auto-Expiration restrictions are present'}
            ${{ sharedLinkAutoExpiration: true, externalCollab: {}, boxSignRequest: {} }}               | ${[messages.shortSharingSignAutoExpiration]}                          | ${'external collab, sign and Auto-Expiration restrictions are present'}
            ${{ sharedLinkAutoExpiration: true, download: {}, app: {} }}                                | ${[messages.shortDownloadAppAutoExpiration]}                          | ${'download, app and Auto-Expiration restrictions are present'}
            ${{ sharedLinkAutoExpiration: true, download: {}, boxSignRequest: {} }}                     | ${[messages.shortDownloadSignAutoExpiration]}                         | ${'download, sign and Auto-Expiration restrictions are present'}
            ${{ sharedLinkAutoExpiration: true, app: {}, boxSignRequest: {} }}                          | ${[messages.shortAppSignAutoExpiration]}                              | ${'app, sign and Auto-Expiration restrictions are present'}
            ${{ sharedLinkAutoExpiration: true, sharedLink: {}, download: {}, app: {} }}                | ${[messages.shortSharingDownloadAppAutoExpiration]}                   | ${'shared link, download, app and Auto-Expiration restrictions are present'}
            ${{ sharedLinkAutoExpiration: true, externalCollab: {}, download: {}, app: {} }}            | ${[messages.shortSharingDownloadAppAutoExpiration]}                   | ${'external collab, download, app and Auto-Expiration restrictions are present'}
            ${{ sharedLinkAutoExpiration: true, sharedLink: {}, download: {}, boxSignRequest: {} }}     | ${[messages.shortSharingDownloadSignAutoExpiration]}                  | ${'shared link, download, sign and Auto-Expiration restrictions are present'}
            ${{ sharedLinkAutoExpiration: true, externalCollab: {}, download: {}, boxSignRequest: {} }} | ${[messages.shortSharingDownloadSignAutoExpiration]}                  | ${'external collab, download, sign and Auto-Expiration restrictions are present'}
            ${{ sharedLinkAutoExpiration: true, sharedLink: {}, app: {}, boxSignRequest: {} }}          | ${[messages.shortSharingAppSignAutoExpiration]}                       | ${'shared link, app, sign and Auto-Expiration restrictions are present'}
            ${{ sharedLinkAutoExpiration: true, externalCollab: {}, app: {}, boxSignRequest: {} }}      | ${[messages.shortSharingAppSignAutoExpiration]}                       | ${'external collab, app, sign and Auto-Expiration restrictions are present'}
            ${{ sharedLinkAutoExpiration: true, download: {}, app: {}, boxSignRequest: {} }}            | ${[messages.shortDownloadAppSignAutoExpiration]}                      | ${'download, app, sign and Auto-Expiration restrictions are present'}
        `('should return correct messages when $description', ({ securityControls, expectedMessages }) => {
            const expectedResult = expectedMessages.map(message => ({ message }));

            const result = getShortSecurityControlsMessage(securityControls);

            expect(result).toEqual(expectedResult);
        });

        test.each`
            securityControls                                                                            | expectedMessages                                                              | description
            ${{}}                                                                                       | ${[]}                                                                         | ${'there are no restrictions'}
            ${allSecurityControls}                                                                      | ${[messages.shortSharingDownloadIntegrationSign, messages.shortWatermarking]} | ${'all restrictions are present'}
            ${{ sharedLink: { accessLevel: PUBLIC } }}                                                  | ${[]}                                                                         | ${'shared link restriction has a "public" access level'}
            ${{ sharedLink: {}, download: {}, app: {} }}                                                | ${[messages.shortSharingDownloadIntegration]}                                 | ${'download, integration and shared link restrictions are present'}
            ${{ externalCollab: {}, download: {}, app: {} }}                                            | ${[messages.shortSharingDownloadIntegration]}                                 | ${'download, integration and external collab restrictions are present'}
            ${{ download: {}, app: {}, boxSignRequest: {} }}                                            | ${[messages.shortDownloadIntegrationSign]}                                    | ${'download, integration and sign restrictions are present'}
            ${{ app: {}, boxSignRequest: {}, sharedLink: {} }}                                          | ${[messages.shortSharingIntegrationSign]}                                     | ${'integration, sign and shared link restrictions are present'}
            ${{ app: {}, boxSignRequest: {}, externalCollab: {} }}                                      | ${[messages.shortSharingIntegrationSign]}                                     | ${'integration, sign and external collab restrictions are present'}
            ${{ download: {}, boxSignRequest: {}, sharedLink: {} }}                                     | ${[messages.shortSharingDownloadSign]}                                        | ${'download, sign and shared link restrictions are present'}
            ${{ download: {}, boxSignRequest: {}, externalCollab: {} }}                                 | ${[messages.shortSharingDownloadSign]}                                        | ${'download, sign and external collab restrictions are present'}
            ${{ sharedLink: {}, boxSignRequest: {} }}                                                   | ${[messages.shortSharingSign]}                                                | ${'sign and shared link restrictions are present'}
            ${{ externalCollab: {}, boxSignRequest: {} }}                                               | ${[messages.shortSharingSign]}                                                | ${'sign and external collab restrictions are present'}
            ${{ download: {}, boxSignRequest: {} }}                                                     | ${[messages.shortDownloadSign]}                                               | ${'download and sign restrictions are present'}
            ${{ app: {}, boxSignRequest: {} }}                                                          | ${[messages.shortIntegrationSign]}                                            | ${'integration and sign restrictions are present'}
            ${{ sharedLink: {}, download: {} }}                                                         | ${[messages.shortSharingDownload]}                                            | ${'download and shared link restrictions are present'}
            ${{ externalCollab: {}, download: {} }}                                                     | ${[messages.shortSharingDownload]}                                            | ${'download and external collab restrictions are present'}
            ${{ sharedLink: {}, app: {} }}                                                              | ${[messages.shortSharingIntegration]}                                         | ${'integration and shared link restrictions are present'}
            ${{ externalCollab: {}, app: {} }}                                                          | ${[messages.shortSharingIntegration]}                                         | ${'integration and external collab restrictions are present'}
            ${{ download: {}, app: {} }}                                                                | ${[messages.shortDownloadIntegration]}                                        | ${'integration and download restrictions are present'}
            ${{ sharedLink: {}, externalCollab: {} }}                                                   | ${[messages.shortSharing]}                                                    | ${'shared link and external collab restrictions are present'}
            ${{ sharedLink: {} }}                                                                       | ${[messages.shortSharing]}                                                    | ${'shared link restrictions are present'}
            ${{ externalCollab: {} }}                                                                   | ${[messages.shortSharing]}                                                    | ${'external collab restrictions are present'}
            ${{ download: {} }}                                                                         | ${[messages.shortDownload]}                                                   | ${'download restrictions are present'}
            ${{ app: {} }}                                                                              | ${[messages.shortIntegration]}                                                | ${'integration restrictions are present'}
            ${{ watermark: {} }}                                                                        | ${[messages.shortWatermarking]}                                               | ${'watermark restrictions are present'}
            ${{ boxSignRequest: {} }}                                                                   | ${[messages.shortSign]}                                                       | ${'sign restrictions are present'}
            ${{ sharedLinkAutoExpiration: true }}                                                       | ${[messages.shortAutoExpiration]}                                             | ${'Auto-Expiration restriction is present'}
            ${{ sharedLinkAutoExpiration: true, download: {} }}                                         | ${[messages.shortDownloadAutoExpiration]}                                     | ${'download and Auto-Expiration restrictions are present'}
            ${{ sharedLinkAutoExpiration: true, sharedLink: {} }}                                       | ${[messages.shortSharingAutoExpiration]}                                      | ${'shared link and Auto-Expiration restrictions are present'}
            ${{ sharedLinkAutoExpiration: true, externalCollab: {} }}                                   | ${[messages.shortSharingAutoExpiration]}                                      | ${'external collab and Auto-Expiration restrictions are present'}
            ${{ sharedLinkAutoExpiration: true, app: {} }}                                              | ${[messages.shortIntegrationAutoExpiration]}                                  | ${'integration and Auto-Expiration restrictions are present'}
            ${{ sharedLinkAutoExpiration: true, boxSignRequest: {} }}                                   | ${[messages.shortSignAutoExpiration]}                                         | ${'sign and Auto-Expiration restrictions are present'}
            ${{ sharedLinkAutoExpiration: true, sharedLink: {}, download: {} }}                         | ${[messages.shortSharingDownloadAutoExpiration]}                              | ${'shared link, download and Auto-Expiration restrictions are present'}
            ${{ sharedLinkAutoExpiration: true, externalCollab: {}, download: {} }}                     | ${[messages.shortSharingDownloadAutoExpiration]}                              | ${'external collab, download and Auto-Expiration restrictions are present'}
            ${{ sharedLinkAutoExpiration: true, sharedLink: {}, app: {} }}                              | ${[messages.shortSharingIntegrationAutoExpiration]}                           | ${'shared link, integration and Auto-Expiration restrictions are present'}
            ${{ sharedLinkAutoExpiration: true, externalCollab: {}, app: {} }}                          | ${[messages.shortSharingIntegrationAutoExpiration]}                           | ${'external collab, integration and Auto-Expiration restrictions are present'}
            ${{ sharedLinkAutoExpiration: true, sharedLink: {}, boxSignRequest: {} }}                   | ${[messages.shortSharingSignAutoExpiration]}                                  | ${'shared link, sign and Auto-Expiration restrictions are present'}
            ${{ sharedLinkAutoExpiration: true, externalCollab: {}, boxSignRequest: {} }}               | ${[messages.shortSharingSignAutoExpiration]}                                  | ${'external collab, sign and Auto-Expiration restrictions are present'}
            ${{ sharedLinkAutoExpiration: true, download: {}, app: {} }}                                | ${[messages.shortDownloadIntegrationAutoExpiration]}                          | ${'download, integration and Auto-Expiration restrictions are present'}
            ${{ sharedLinkAutoExpiration: true, download: {}, boxSignRequest: {} }}                     | ${[messages.shortDownloadSignAutoExpiration]}                                 | ${'download, sign and Auto-Expiration restrictions are present'}
            ${{ sharedLinkAutoExpiration: true, app: {}, boxSignRequest: {} }}                          | ${[messages.shortIntegrationSignAutoExpiration]}                              | ${'integration, sign and Auto-Expiration restrictions are present'}
            ${{ sharedLinkAutoExpiration: true, sharedLink: {}, download: {}, app: {} }}                | ${[messages.shortSharingDownloadIntegrationAutoExpiration]}                   | ${'shared link, download, integration and Auto-Expiration restrictions are present'}
            ${{ sharedLinkAutoExpiration: true, externalCollab: {}, download: {}, app: {} }}            | ${[messages.shortSharingDownloadIntegrationAutoExpiration]}                   | ${'external collab, download, integration and Auto-Expiration restrictions are present'}
            ${{ sharedLinkAutoExpiration: true, sharedLink: {}, download: {}, boxSignRequest: {} }}     | ${[messages.shortSharingDownloadSignAutoExpiration]}                          | ${'shared link, download, sign and Auto-Expiration restrictions are present'}
            ${{ sharedLinkAutoExpiration: true, externalCollab: {}, download: {}, boxSignRequest: {} }} | ${[messages.shortSharingDownloadSignAutoExpiration]}                          | ${'external collab, download, sign and Auto-Expiration restrictions are present'}
            ${{ sharedLinkAutoExpiration: true, sharedLink: {}, app: {}, boxSignRequest: {} }}          | ${[messages.shortSharingIntegrationSignAutoExpiration]}                       | ${'shared link, integration, sign and Auto-Expiration restrictions are present'}
            ${{ sharedLinkAutoExpiration: true, externalCollab: {}, app: {}, boxSignRequest: {} }}      | ${[messages.shortSharingIntegrationSignAutoExpiration]}                       | ${'external collab, integration, sign and Auto-Expiration restrictions are present'}
            ${{ sharedLinkAutoExpiration: true, download: {}, app: {}, boxSignRequest: {} }}            | ${[messages.shortDownloadIntegrationSignAutoExpiration]}                      | ${'download, integration, sign and Auto-Expiration restrictions are present'}
        `(
            'should return correct messages when $description and shouldDisplayAppsAsIntegrations is true',
            ({ securityControls, expectedMessages }) => {
                const expectedResult = expectedMessages.map(message => ({ message }));

                const result = getShortSecurityControlsMessage(securityControls, true);

                expect(result).toEqual(expectedResult);
            },
        );

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
            'should include correct variable when integration download is restricted by %s and integrations list is not provided and shouldDisplayAppsAsIntegrations is true',
            listType => {
                accessPolicy = {
                    app: {
                        accessLevel: listType,
                        apps: [],
                    },
                };
                const expectedMessage = integrationRestrictionsMessageMap[listType][DEFAULT];

                expect(expectedMessage).toBeTruthy();
                expect(getFullSecurityControlsMessages(accessPolicy, 3, true)).toEqual([
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
            'should include correct variable when integration download is restricted by %s and integrations are less than maxAppCount and shouldDisplayAppsAsIntegrations is true',
            listType => {
                accessPolicy = {
                    app: {
                        accessLevel: listType,
                        apps: [{ displayText: 'a' }, { displayText: 'b' }, { displayText: 'c' }],
                    },
                };
                const expectedMessage = integrationRestrictionsMessageMap[listType][WITH_APP_LIST];

                expect(expectedMessage).toBeTruthy();
                expect(getFullSecurityControlsMessages(accessPolicy, 3, true)).toEqual([
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

        test.each([WHITELIST, BLACKLIST])(
            'should include correct message and tooltipMessage when integration download is restricted by %s and integrations are maxAppCount or more and shouldDisplayAppsAsIntegrations is true',
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
                const expectedMessage = integrationRestrictionsMessageMap[listType][WITH_OVERFLOWN_APP_LIST];

                expect(expectedMessage).toBeTruthy();
                expect(getFullSecurityControlsMessages(accessPolicy, 3, true)).toEqual([
                    {
                        message: {
                            ...expectedMessage,
                            values: { appNames: 'a, b, c', remainingAppCount: 2 },
                        },
                        tooltipMessage: {
                            ...messages.allIntegrationNames,
                            values: { appsList: 'a, b, c, d, e' },
                        },
                    },
                ]);
            },
        );

        test('should include correct message when Box Sign requests are restricted', () => {
            accessPolicy = {
                boxSignRequest: {
                    enabled: true,
                },
            };

            expect(getFullSecurityControlsMessages(accessPolicy)).toEqual([
                { message: messages.boxSignRequestRestricted },
            ]);
        });

        test('should include correct message when shared link Auto-Expiration is enabled', () => {
            accessPolicy = {
                sharedLinkAutoExpiration: true,
            };

            expect(getFullSecurityControlsMessages(accessPolicy)).toEqual([
                { message: messages.sharedLinkAutoExpirationApplied },
            ]);
        });

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
