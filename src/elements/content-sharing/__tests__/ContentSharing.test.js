import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import API from '../../../api';
import ErrorMask from '../../../components/error-mask/ErrorMask';
import ContentSharing from '../ContentSharing';
import Notification from '../../../components/notification/Notification';
import SharedLinkSettingsModal from '../../../features/shared-link-settings-modal';
import UnifiedShareModal from '../../../features/unified-share-modal/UnifiedShareModal';
import {
    ACCESS_COLLAB,
    ACCESS_COMPANY,
    ACCESS_NONE,
    ACCESS_OPEN,
    DEFAULT_HOSTNAME_API,
    PERMISSION_CAN_DOWNLOAD,
    PERMISSION_CAN_PREVIEW,
    TYPE_FILE,
    TYPE_FOLDER,
} from '../../../constants';
import { CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS } from '../constants';
import {
    ANYONE_WITH_LINK,
    ANYONE_IN_COMPANY,
    CAN_VIEW_DOWNLOAD,
    CAN_VIEW_ONLY,
    PEOPLE_IN_ITEM,
} from '../../../features/unified-share-modal/constants';
import {
    convertContactsResponse,
    convertItemResponse,
    convertUserResponse,
    convertSharedLinkPermissions,
} from '../../../features/unified-share-modal/utils/convertData';
import {
    MOCK_CONTACTS_API_RESPONSE,
    MOCK_CONTACTS_CONVERTED_RESPONSE,
    MOCK_CONVERTED_ITEM_DATA,
    MOCK_CONVERTED_ITEM_DATA_WITHOUT_SHARED_LINK,
    MOCK_CONVERTED_USER_DATA,
    MOCK_ITEM,
    MOCK_ITEM_API_RESPONSE,
    MOCK_ITEM_ID,
    MOCK_NULL_SHARED_LINK,
    MOCK_SHARED_LINK,
    MOCK_SHARED_LINK_DATA_AFTER_NORMALIZATION,
    MOCK_USER_API_RESPONSE,
    MOCK_ITEM_API_RESPONSE_WITHOUT_SHARED_LINK,
} from '../../../features/unified-share-modal/utils/__mocks__/USMMocks';
import SharingNotification from '../SharingNotification';

jest.mock('../../../api');
jest.mock('../../../features/unified-share-modal/utils/convertData');

// Stub the queryCommandSupported function, which is used in the Shared Link Settings Modal
global.document.queryCommandSupported = jest.fn();

const createAPIMock = (fileAPI, folderAPI, usersAPI) => () => ({
    getFileAPI: jest.fn().mockReturnValue(fileAPI),
    getFileCollaborationsAPI: jest.fn().mockReturnValue({
        getCollaborations: jest.fn(),
    }),
    getFolderAPI: jest.fn().mockReturnValue(folderAPI),
    getFolderCollaborationsAPI: jest.fn().mockReturnValue({
        getCollaborations: jest.fn(),
    }),
    getUsersAPI: jest.fn().mockReturnValue(usersAPI),
});

describe('elements/content-sharing/ContentSharing', () => {
    const getWrapper = props =>
        mount(<ContentSharing apiHost={DEFAULT_HOSTNAME_API} itemID={MOCK_ITEM_ID} language="" token="" {...props} />);

    const createSuccessMock = responseFromAPI => (id, successFn) => {
        return Promise.resolve(responseFromAPI).then(response => {
            successFn(response);
        });
    };

    const createMockItemData = (accessLevel = PEOPLE_IN_ITEM, permissionLevel = CAN_VIEW_DOWNLOAD) => {
        return {
            item: MOCK_ITEM,
            sharedLink: {
                ...MOCK_SHARED_LINK,
                accessLevel,
                permissionLevel,
            },
        };
    };

    beforeEach(() => {
        convertItemResponse.mockReturnValue(MOCK_CONVERTED_ITEM_DATA);
        convertUserResponse.mockReturnValue(MOCK_CONVERTED_USER_DATA);
    });

    afterEach(() => {
        jest.resetModules();
        jest.restoreAllMocks();
    });

    describe('with successful GET requests to the Item and Users API', () => {
        test('should call getFileAPI().getFile() if itemType is "file"', async () => {
            const getFile = jest.fn().mockImplementation(createSuccessMock(MOCK_ITEM_API_RESPONSE));
            API.mockImplementation(createAPIMock({ getFile }, null, { getUser: jest.fn() }));

            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ itemType: TYPE_FILE });
            });

            wrapper.update();
            const usm = wrapper.find(UnifiedShareModal);

            expect(getFile).toHaveBeenCalled();
            expect(convertItemResponse).toHaveBeenCalledWith(MOCK_ITEM_API_RESPONSE);
            expect(usm.prop('item')).toEqual(MOCK_ITEM);
            expect(usm.prop('sharedLink')).toEqual(MOCK_SHARED_LINK);
            expect(wrapper.exists(SharingNotification)).toBe(true);
        });

        test('should call getFolderAPI().getFolderFields() if itemType is "folder"', async () => {
            const getFolderFields = jest.fn().mockImplementation(createSuccessMock(MOCK_ITEM_API_RESPONSE));

            API.mockImplementation(createAPIMock(null, { getFolderFields }, { getUser: jest.fn() }));

            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ itemType: TYPE_FOLDER });
            });
            wrapper.update();
            const usm = wrapper.find(UnifiedShareModal);
            expect(getFolderFields).toHaveBeenCalled();
            expect(convertItemResponse).toHaveBeenCalledWith(MOCK_ITEM_API_RESPONSE);
            expect(usm.prop('item')).toEqual(MOCK_ITEM);
            expect(usm.prop('sharedLink')).toEqual(MOCK_SHARED_LINK);
            expect(wrapper.exists(SharingNotification)).toBe(true);
        });

        test('should call getUsersAPI().getUser() if item and sharedLink are defined, but currentUserID is not', async () => {
            const getFile = jest.fn().mockImplementation(createSuccessMock(MOCK_ITEM_API_RESPONSE));
            const getUser = jest.fn().mockImplementation(createSuccessMock(MOCK_USER_API_RESPONSE));
            API.mockImplementation(createAPIMock({ getFile }, { getFolderFields: jest.fn() }, { getUser }));

            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ itemType: TYPE_FILE });
            });
            wrapper.update();
            const usm = wrapper.find(UnifiedShareModal);
            expect(getFile).toHaveBeenCalled();
            expect(getUser).toHaveBeenCalled();
            expect(convertUserResponse).toHaveBeenCalledWith(MOCK_USER_API_RESPONSE);
            expect(usm.prop('item')).toEqual(MOCK_ITEM);
            expect(usm.prop('sharedLink')).toEqual(MOCK_SHARED_LINK_DATA_AFTER_NORMALIZATION);
            expect(wrapper.exists(SharingNotification)).toBe(true);
        });

        test('should toggle between the Unified Share Modal and the Shared Link Settings Modal', async () => {
            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ itemType: TYPE_FILE });
            });
            wrapper.update();

            // Check that the Shared Link Settings Modal is hidden on load
            expect(wrapper.exists(SharedLinkSettingsModal)).toBe(false);
            const usm = wrapper.find(UnifiedShareModal);
            await act(async () => {
                usm.invoke('onSettingsClick')();
            });
            wrapper.update();

            // Check that the Unified Share Modal disappears and the Shared Link Settings Modal appears
            expect(wrapper.exists(UnifiedShareModal)).toBe(false);
            const slsm = wrapper.find(SharedLinkSettingsModal);
            await act(async () => {
                slsm.invoke('onRequestClose')();
            });
            wrapper.update();

            // Check that the Shared Link Settings Modal disappears and the Unified Share Modal appears
            expect(wrapper.exists(SharedLinkSettingsModal)).toBe(false);
            expect(wrapper.exists(UnifiedShareModal)).toBe(true);
        });
    });

    describe('with failed GET requests to the Item and/or Users API', () => {
        test('should show the ErrorMask and skip the call to getUser() if the call to getFile() fails', async () => {
            const getFile = jest.fn().mockImplementation((id, successFn, failureFn) => {
                return Promise.reject(new Error({ status: '400' })).catch(response => {
                    failureFn(response);
                });
            });
            const getUser = jest.fn();
            API.mockImplementation(createAPIMock({ getFile }, null, { getUser }));

            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ itemType: TYPE_FILE });
            });
            wrapper.update();
            expect(getFile).toHaveBeenCalled();
            expect(getUser).not.toHaveBeenCalled();
            expect(convertItemResponse).not.toHaveBeenCalled();
            expect(wrapper.exists(ErrorMask)).toBe(true);
            expect(wrapper.exists(UnifiedShareModal)).toBe(false);
            expect(wrapper.exists(SharingNotification)).toBe(false);
        });

        test('should show the ErrorMask and skip the call to getUser() if the call to getFolderFields() fails', async () => {
            const getFolderFields = jest.fn().mockImplementation((id, successFn, failureFn) => {
                return Promise.reject(new Error({ status: '400' })).catch(response => {
                    failureFn(response);
                });
            });
            const getUser = jest.fn();
            API.mockImplementation(createAPIMock(null, { getFolderFields }, { getUser }));

            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ itemType: TYPE_FOLDER });
            });
            wrapper.update();
            expect(getFolderFields).toHaveBeenCalled();
            expect(getUser).not.toHaveBeenCalled();
            expect(convertItemResponse).not.toHaveBeenCalled();
            expect(wrapper.exists(ErrorMask)).toBe(true);
            expect(wrapper.exists(UnifiedShareModal)).toBe(false);
            expect(wrapper.exists(SharingNotification)).toBe(false);
        });
    });

    describe('with successful item API calls, but an unsuccessful users API call', () => {
        let getFile;
        let getFolderFields;
        let getUser;
        beforeAll(() => {
            getFile = jest.fn().mockImplementation(createSuccessMock(MOCK_ITEM_API_RESPONSE));
            getFolderFields = jest.fn().mockImplementation(createSuccessMock(MOCK_ITEM_API_RESPONSE));
            getUser = jest.fn().mockImplementation((id, successFn, failureFn) => {
                return Promise.reject(new Error({ status: '400' })).catch(response => {
                    failureFn(response);
                });
            });
            API.mockImplementation(createAPIMock({ getFile }, { getFolderFields }, { getUser }));
        });

        test('should show the ErrorMask if the call to getFile() succeeds, but the call to getUser() fails', async () => {
            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ itemType: TYPE_FILE });
            });
            wrapper.update();
            expect(getFile).toHaveBeenCalled();
            expect(convertItemResponse).toHaveBeenCalledWith(MOCK_ITEM_API_RESPONSE);
            expect(getUser).toHaveBeenCalled();
            expect(convertUserResponse).not.toHaveBeenCalled();
            expect(wrapper.exists(ErrorMask)).toBe(true);
            expect(wrapper.exists(UnifiedShareModal)).toBe(false);
            expect(wrapper.exists(SharingNotification)).toBe(false);
        });

        test('should show the ErrorMask if the call to getFolderFields() succeeds, but the call to getUser() fails', async () => {
            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ itemType: TYPE_FOLDER });
            });
            wrapper.update();
            expect(getFolderFields).toHaveBeenCalled();
            expect(convertItemResponse).toHaveBeenCalledWith(MOCK_ITEM_API_RESPONSE);
            expect(getUser).toHaveBeenCalled();
            expect(convertUserResponse).not.toHaveBeenCalled();
            expect(wrapper.exists(ErrorMask)).toBe(true);
            expect(wrapper.exists(UnifiedShareModal)).toBe(false);
            expect(wrapper.exists(SharingNotification)).toBe(false);
        });
    });

    describe('with specific errors', () => {
        test.each`
            status   | expectedErrorName
            ${'400'} | ${'badRequestError'}
            ${'401'} | ${'noAccessError'}
            ${'403'} | ${'noAccessError'}
            ${'404'} | ${'notFoundError'}
            ${'500'} | ${'loadingError'}
        `(
            'should show the correct error message when a call fails with a $status and the response is of type "ErrorResponseData"',
            async ({ status, expectedErrorName }) => {
                const getFolderFields = jest.fn().mockImplementation((id, successFn, failureFn) => {
                    return Promise.reject(new Error()).catch(() => {
                        failureFn({ status });
                    });
                });
                const getUser = jest.fn();
                API.mockImplementation(createAPIMock(null, { getFolderFields }, { getUser }));

                let wrapper;
                await act(async () => {
                    wrapper = getWrapper({ itemType: TYPE_FOLDER });
                });
                wrapper.update();
                expect(getFolderFields).toHaveBeenCalled();
                expect(wrapper.exists(ErrorMask)).toBe(true);
                expect(
                    wrapper
                        .find(ErrorMask)
                        .find(FormattedMessage)
                        .at(1) // the error header appears after the IconSadCloud title
                        .prop('id'),
                ).toBe(`be.contentSharing.${expectedErrorName}`);
            },
        );

        test.each`
            status   | expectedErrorName
            ${'400'} | ${'badRequestError'}
            ${'401'} | ${'noAccessError'}
            ${'403'} | ${'noAccessError'}
            ${'404'} | ${'notFoundError'}
            ${'500'} | ${'loadingError'}
        `(
            'should show the correct error message when a call fails with a $status and the response is of type "$AxiosError"',
            async ({ status, expectedErrorName }) => {
                const getFolderFields = jest.fn().mockImplementation((id, successFn, failureFn) => {
                    return Promise.reject(new Error()).catch(() => {
                        failureFn({ response: { status } });
                    });
                });
                const getUser = jest.fn();
                API.mockImplementation(createAPIMock(null, { getFolderFields }, { getUser }));

                let wrapper;
                await act(async () => {
                    wrapper = getWrapper({ itemType: TYPE_FOLDER });
                });
                wrapper.update();
                expect(getFolderFields).toHaveBeenCalled();
                expect(wrapper.exists(ErrorMask)).toBe(true);
                expect(
                    wrapper
                        .find(ErrorMask)
                        .find(FormattedMessage)
                        .at(1)
                        .prop('id'),
                ).toBe(`be.contentSharing.${expectedErrorName}`);
            },
        );

        test('should show the default error message when a call fails and the response is unparseable', async () => {
            const getFolderFields = jest.fn().mockImplementation((id, successFn, failureFn) => {
                return Promise.reject(new Error()).catch(() => {
                    failureFn({ response: undefined });
                });
            });
            const getUser = jest.fn();
            API.mockImplementation(createAPIMock(null, { getFolderFields }, { getUser }));

            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ itemType: TYPE_FOLDER });
            });
            wrapper.update();
            expect(getFolderFields).toHaveBeenCalled();
            expect(wrapper.exists(ErrorMask)).toBe(true);
            expect(
                wrapper
                    .find(ErrorMask)
                    .find(FormattedMessage)
                    .at(1)
                    .prop('id'),
            ).toBe(`be.contentSharing.loadingError`);
        });
    });

    describe('with successful PUT requests to the Item API', () => {
        let share;
        let updateSharedLink;
        beforeAll(() => {
            share = jest.fn().mockImplementation((dataForAPI, accessType, successFn) => {
                return Promise.resolve(MOCK_ITEM_API_RESPONSE).then(response => {
                    successFn(response);
                });
            });
            updateSharedLink = jest.fn().mockImplementation((dataForAPI, sharedLinkParams, successFn) => {
                return Promise.resolve(MOCK_ITEM_API_RESPONSE).then(response => {
                    successFn(response);
                });
            });
            API.mockImplementation(
                createAPIMock(
                    {
                        getFile: createSuccessMock(MOCK_ITEM_API_RESPONSE_WITHOUT_SHARED_LINK),
                        share,
                        updateSharedLink,
                    },
                    {
                        getFolderFields: createSuccessMock(MOCK_ITEM_API_RESPONSE_WITHOUT_SHARED_LINK),
                        share,
                        updateSharedLink,
                    },
                    { getUser: jest.fn() },
                ),
            );
        });

        test('should call share() from onAddLink() and set a new shared link', async () => {
            convertItemResponse.mockReturnValue(MOCK_CONVERTED_ITEM_DATA_WITHOUT_SHARED_LINK);

            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ itemType: TYPE_FOLDER });
            });
            wrapper.update();

            const usm = wrapper.find(UnifiedShareModal);
            expect(usm.prop('sharedLink')).toEqual(MOCK_NULL_SHARED_LINK);

            convertItemResponse.mockReset();
            convertItemResponse.mockReturnValue(MOCK_CONVERTED_ITEM_DATA);

            await act(async () => {
                usm.invoke('onAddLink')();
            });
            wrapper.update();
            expect(share).toHaveBeenCalledWith(
                { id: MOCK_ITEM_ID, permissions: {} },
                ACCESS_COLLAB,
                expect.anything(),
                expect.anything(),
                CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
            );
            expect(wrapper.find(UnifiedShareModal).prop('sharedLink')).toEqual(MOCK_SHARED_LINK);
        });

        test('should call share() from onRemoveLink() and remove the existing shared link', async () => {
            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ itemType: TYPE_FILE });
            });
            wrapper.update();

            const usm = wrapper.find(UnifiedShareModal);
            expect(usm.prop('sharedLink')).toEqual(MOCK_SHARED_LINK);

            convertItemResponse.mockReset();
            convertItemResponse.mockReturnValue(MOCK_CONVERTED_ITEM_DATA_WITHOUT_SHARED_LINK);

            await act(async () => {
                usm.invoke('onRemoveLink')();
            });
            wrapper.update();
            expect(share).toHaveBeenCalledWith(
                { id: MOCK_ITEM_ID, permissions: {} },
                ACCESS_NONE,
                expect.anything(),
                expect.anything(),
                CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
            );
            expect(wrapper.find(UnifiedShareModal).prop('sharedLink')).toEqual(MOCK_NULL_SHARED_LINK);
        });

        test.each`
            accessLevelFromUSM   | accessLevelForAPI
            ${ANYONE_IN_COMPANY} | ${ACCESS_COMPANY}
            ${ANYONE_WITH_LINK}  | ${ACCESS_OPEN}
            ${PEOPLE_IN_ITEM}    | ${ACCESS_COLLAB}
        `(
            'should call share() from changeSharedLinkAccessLevel() when given $accessLevelFromUSM access',
            async ({ accessLevelFromUSM, accessLevelForAPI }) => {
                let wrapper;
                await act(async () => {
                    wrapper = getWrapper({ itemType: TYPE_FOLDER });
                });
                wrapper.update();

                const usm = wrapper.find(UnifiedShareModal);
                expect(usm.prop('sharedLink')).toEqual(MOCK_SHARED_LINK);

                const expectedItemData = createMockItemData(accessLevelFromUSM);
                convertItemResponse.mockReset();
                convertItemResponse.mockReturnValue(expectedItemData);

                await act(async () => {
                    usm.invoke('changeSharedLinkAccessLevel')(accessLevelFromUSM);
                });
                wrapper.update();
                expect(share).toHaveBeenCalledWith(
                    { id: MOCK_ITEM_ID, permissions: {} },
                    accessLevelForAPI,
                    expect.anything(),
                    expect.anything(),
                    CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
                );
                expect(wrapper.find(UnifiedShareModal).prop('sharedLink')).toEqual(expectedItemData.sharedLink);
            },
        );

        test.each`
            permissionLevelFromUSM | permissionLevelObjectForAPI
            ${CAN_VIEW_DOWNLOAD}   | ${{ [PERMISSION_CAN_DOWNLOAD]: true, [PERMISSION_CAN_PREVIEW]: false }}
            ${CAN_VIEW_ONLY}       | ${{ [PERMISSION_CAN_DOWNLOAD]: false, [PERMISSION_CAN_PREVIEW]: true }}
        `(
            'should call updateSharedLink() from changeSharedLinkPermissionLevel() when given $permissionLevelFromUSM permission',
            async ({ permissionLevelFromUSM, permissionLevelObjectForAPI }) => {
                convertSharedLinkPermissions.mockReturnValue(permissionLevelObjectForAPI);
                let wrapper;
                await act(async () => {
                    wrapper = getWrapper({ itemType: TYPE_FILE });
                });
                wrapper.update();

                const usm = wrapper.find(UnifiedShareModal);
                expect(usm.prop('sharedLink')).toEqual(MOCK_SHARED_LINK);

                const expectedItemData = createMockItemData(undefined, permissionLevelFromUSM);
                convertItemResponse.mockReset();
                convertItemResponse.mockReturnValue(expectedItemData);

                await act(async () => {
                    usm.invoke('changeSharedLinkPermissionLevel')(permissionLevelFromUSM);
                });
                wrapper.update();
                expect(updateSharedLink).toHaveBeenCalledWith(
                    { id: MOCK_ITEM_ID, permissions: {} },
                    { permissions: permissionLevelObjectForAPI },
                    expect.anything(),
                    expect.anything(),
                    CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
                );
                expect(wrapper.find(UnifiedShareModal).prop('sharedLink')).toEqual(expectedItemData.sharedLink);
            },
        );
    });

    describe('with successful GET requests to the enterprise users API', () => {
        let getUsersInEnterprise;
        beforeAll(() => {
            getUsersInEnterprise = jest.fn().mockImplementation((itemID, successFn) => {
                return Promise.resolve(MOCK_CONTACTS_API_RESPONSE).then(response => {
                    return successFn(response);
                });
            });
            API.mockImplementation(
                createAPIMock(
                    { getFile: jest.fn().mockImplementation(createSuccessMock(MOCK_ITEM_API_RESPONSE)) },
                    null,
                    {
                        getUser: jest.fn().mockImplementation(createSuccessMock(MOCK_USER_API_RESPONSE)),
                        getUsersInEnterprise,
                    },
                ),
            );
            convertContactsResponse.mockReturnValue(MOCK_CONTACTS_CONVERTED_RESPONSE);
        });

        test('should call getUsersInEnterprise() from getCollaboratorContacts() and return a converted response', async () => {
            const MOCK_FILTER = 'content';

            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ itemType: TYPE_FILE });
            });
            wrapper.update();

            const usm = wrapper.find(UnifiedShareModal);
            let response;
            await act(async () => {
                response = usm.invoke('getCollaboratorContacts')(MOCK_FILTER);
            });
            wrapper.update();

            expect(getUsersInEnterprise).toHaveBeenCalledWith(
                MOCK_ITEM_ID,
                expect.anything(),
                expect.anything(),
                MOCK_FILTER,
            );
            expect(response).resolves.toEqual(MOCK_CONTACTS_CONVERTED_RESPONSE);
        });
    });

    describe('with failed notification-level API requests', () => {
        let share;
        let updateSharedLink;
        let getUsersInEnterprise;
        const createShareFailureMock = () =>
            jest.fn().mockImplementation((dataForAPI, accessType, successFn, failureFn) => {
                return Promise.reject(new Error({ status: '400' })).catch(response => {
                    failureFn(response);
                });
            });
        beforeAll(() => {
            share = createShareFailureMock();
            updateSharedLink = createShareFailureMock();
            getUsersInEnterprise = jest.fn().mockImplementation((itemID, successFn, failureFn) => {
                return Promise.reject(new Error({ status: '400' })).catch(response => {
                    failureFn(response);
                });
            });
            API.mockImplementation(
                createAPIMock(
                    {
                        getFile: createSuccessMock(MOCK_ITEM_API_RESPONSE_WITHOUT_SHARED_LINK),
                        share,
                        updateSharedLink,
                    },
                    {
                        getFolderFields: createSuccessMock(MOCK_ITEM_API_RESPONSE_WITHOUT_SHARED_LINK),
                        share,
                        updateSharedLink,
                    },
                    { getUser: jest.fn(), getUsersInEnterprise },
                ),
            );
        });

        test.each([
            'onAddLink',
            'onRemoveLink',
            'changeSharedLinkAccessLevel',
            'changeSharedLinkPermissionLevel',
            'getCollaboratorContacts',
        ])('should show an error notification if %s() fails', async sharedLinkUpdateFn => {
            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ itemType: TYPE_FOLDER });
            });
            wrapper.update();
            expect(wrapper.exists(Notification)).toBe(false);

            const usm = wrapper.find(UnifiedShareModal);
            await act(async () => {
                usm.invoke(`${sharedLinkUpdateFn}`)();
            });
            wrapper.update();
            expect(wrapper.exists(Notification)).toBe(true);
        });
    });
});
