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
            securityControls                                            | expectedMessages                                                      | description
            ${{}}                                                       | ${[]}                                                                 | ${'there are no restrictions'}
            ${allSecurityControls}                                      | ${[messages.shortSharingDownloadAppSign, messages.shortWatermarking]} | ${'all restrictions are present'}
            ${{ sharedLink: { accessLevel: PUBLIC } }}                  | ${[]}                                                                 | ${'shared link restriction has a "public" access level'}
            ${{ sharedLink: {}, download: {}, app: {} }}                | ${[messages.shortSharingDownloadApp]}                                 | ${'download, app and shared link restrictions are present'}
            ${{ externalCollab: {}, download: {}, app: {} }}            | ${[messages.shortSharingDownloadApp]}                                 | ${'download, app and external collab restrictions are present'}
            ${{ download: {}, app: {}, boxSignRequest: {} }}            | ${[messages.shortDownloadAppSign]}                                    | ${'download, app and sign restrictions are present'}
            ${{ app: {}, boxSignRequest: {}, sharedLink: {} }}          | ${[messages.shortSharingAppSign]}                                     | ${'app, sign and shared link restrictions are present'}
            ${{ app: {}, boxSignRequest: {}, externalCollab: {} }}      | ${[messages.shortSharingAppSign]}                                     | ${'app, sign and external collab restrictions are present'}
            ${{ download: {}, boxSignRequest: {}, sharedLink: {} }}     | ${[messages.shortSharingDownloadSign]}                                | ${'download, sign and shared link restrictions are present'}
            ${{ download: {}, boxSignRequest: {}, externalCollab: {} }} | ${[messages.shortSharingDownloadSign]}                                | ${'download, sign and external collab restrictions are present'}
            ${{ sharedLink: {}, boxSignRequest: {} }}                   | ${[messages.shortSharingSign]}                                        | ${'sign and shared link restrictions are present'}
            ${{ externalCollab: {}, boxSignRequest: {} }}               | ${[messages.shortSharingSign]}                                        | ${'sign and external collab restrictions are present'}
            ${{ download: {}, boxSignRequest: {} }}                     | ${[messages.shortDownloadSign]}                                       | ${'download and sign restrictions are present'}
            ${{ app: {}, boxSignRequest: {} }}                          | ${[messages.shortAppSign]}                                            | ${'app and sign restrictions are present'}
            ${{ sharedLink: {}, download: {} }}                         | ${[messages.shortSharingDownload]}                                    | ${'download and shared link restrictions are present'}
            ${{ externalCollab: {}, download: {} }}                     | ${[messages.shortSharingDownload]}                                    | ${'download and external collab restrictions are present'}
            ${{ sharedLink: {}, app: {} }}                              | ${[messages.shortSharingApp]}                                         | ${'app and shared link restrictions are present'}
            ${{ externalCollab: {}, app: {} }}                          | ${[messages.shortSharingApp]}                                         | ${'app and external collab restrictions are present'}
            ${{ download: {}, app: {} }}                                | ${[messages.shortDownloadApp]}                                        | ${'app and download restrictions are present'}
            ${{ sharedLink: {}, externalCollab: {} }}                   | ${[messages.shortSharing]}                                            | ${'shared link and external collab restrictions are present'}
            ${{ sharedLink: {} }}                                       | ${[messages.shortSharing]}                                            | ${'shared link restrictions are present'}
            ${{ externalCollab: {} }}                                   | ${[messages.shortSharing]}                                            | ${'external collab restrictions are present'}
            ${{ download: {} }}                                         | ${[messages.shortDownload]}                                           | ${'download restrictions are present'}
            ${{ app: {} }}                                              | ${[messages.shortApp]}                                                | ${'app restrictions are present'}
            ${{ watermark: {} }}                                        | ${[messages.shortWatermarking]}                                       | ${'watermark restrictions are present'}
            ${{ boxSignRequest: {} }}                                   | ${[messages.shortSign]}                                               | ${'sign restrictions are present'}
        `('should return correct messages when $description', ({ securityControls, expectedMessages }) => {
            const expectedResult = expectedMessages.map(message => ({ message }));

            const result = getShortSecurityControlsMessage(securityControls);

            expect(result).toEqual(expectedResult);
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
            const { message: watermarkFormattedMessages } = getFullSecurityControlsMessages(accessPolicy)[0];
            const { props: formattedMessageProps = {} } = watermarkFormattedMessages;
            const { children: objArr = [] } = formattedMessageProps;
            const { props: firstMessageObj = {} } = objArr[0];
            const { props: linkObj = {} } = objArr[1];
            const { props: secondMessageObj = {} } = linkObj.children;

            const expectedFirstMessageId = 'boxui.securityControls.watermarkingApplied';
            const expectedSecondMessageId = 'boxui.securityControls.linkForMoreDetails';

            expect(objArr.length).toEqual(2);
            expect(firstMessageObj.id).toEqual(expectedFirstMessageId);
            expect(secondMessageObj.id).toEqual(expectedSecondMessageId);
            expect(formattedMessageProps).toMatchSnapshot();
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
