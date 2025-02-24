import React, { act } from 'react';
import { mount } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import LoadingIndicator from '../../../components/loading-indicator/LoadingIndicator';
import SharingModal from '../SharingModal';
import Notification from '../../../components/notification/Notification';
import { DURATION_SHORT, TYPE_ERROR, TYPE_INFO } from '../../../components/notification/constants';
import SharedLinkSettingsModal from '../../../features/shared-link-settings-modal';
import UnifiedShareModal from '../../../features/unified-share-modal/UnifiedShareModal';
import {
    ACCESS_COLLAB,
    ACCESS_COMPANY,
    ACCESS_NONE,
    ACCESS_OPEN,
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
    INVITEE_PERMISSIONS_FILE,
    INVITEE_PERMISSIONS_FOLDER,
} from '../../../features/unified-share-modal/constants';
import {
    convertCollabsRequest,
    convertGroupContactsResponse,
    convertItemResponse,
    convertUserResponse,
    convertSharedLinkPermissions,
    convertSharedLinkSettings,
    convertUserContactsResponse,
    convertUserContactsByEmailResponse,
} from '../../../features/unified-share-modal/utils/convertData';
import {
    MOCK_COLLABS_REQUEST_USERS_AND_GROUPS,
    MOCK_COLLABS_CONVERTED_GROUPS,
    MOCK_COLLABS_CONVERTED_REQUEST,
    MOCK_COLLABS_CONVERTED_USERS,
    MOCK_CONTACTS_API_RESPONSE,
    MOCK_CONTACTS_BY_EMAIL_CONVERTED_RESPONSE,
    MOCK_CONTACTS_CONVERTED_RESPONSE,
    MOCK_CONVERTED_ENTERPRISE_USER_DATA,
    MOCK_CONVERTED_ITEM_DATA,
    MOCK_CONVERTED_ITEM_DATA_WITHOUT_SHARED_LINK,
    MOCK_CONVERTED_SETTINGS,
    MOCK_CONVERTED_USER_DATA,
    MOCK_GROUP_CONTACTS_API_RESPONSE,
    MOCK_GROUP_CONTACTS_CONVERTED_RESPONSE,
    MOCK_ITEM,
    MOCK_ITEM_API_RESPONSE,
    MOCK_ITEM_API_RESPONSE_WITHOUT_SHARED_LINK,
    MOCK_ITEM_ID,
    MOCK_NORMALIZED_SHARED_LINK_DATA,
    MOCK_NORMALIZED_SHARED_LINK_DATA_FOR_USM,
    MOCK_NULL_SHARED_LINK,
    MOCK_SETTINGS_WITH_ALL_FEATURES,
    MOCK_SHARED_LINK,
    MOCK_TIMESTAMP_MILLISECONDS,
    MOCK_TIMESTAMP_SECONDS,
    MOCK_USER_API_RESPONSE,
} from '../../../features/unified-share-modal/utils/__mocks__/USMMocks';
import SharingNotification from '../SharingNotification';

jest.mock('../../../api');
jest.mock('../../../features/unified-share-modal/utils/convertData');

// Stub the queryCommandSupported function, which is used in the Shared Link Settings Modal
global.document.queryCommandSupported = jest.fn();

const createAPIMock = (fileAPI, folderAPI, usersAPI, collaborationsAPI, markerBasedGroupsAPI, markerBasedUsersAPI) => ({
    getFileAPI: jest.fn().mockReturnValue(fileAPI),
    getFileCollaborationsAPI: jest.fn().mockReturnValue({
        getCollaborations: jest.fn(),
    }),
    getFolderAPI: jest.fn().mockReturnValue(folderAPI),
    getFolderCollaborationsAPI: jest.fn().mockReturnValue({
        getCollaborations: jest.fn(),
    }),
    getUsersAPI: jest.fn().mockReturnValue({ getAvatarUrlWithAccessToken: jest.fn(), ...usersAPI }),
    getCollaborationsAPI: jest.fn().mockReturnValue(collaborationsAPI),
    getMarkerBasedGroupsAPI: jest.fn().mockReturnValue(markerBasedGroupsAPI),
    getMarkerBasedUsersAPI: jest.fn().mockReturnValue(markerBasedUsersAPI),
});

describe('elements/content-sharing/SharingModal', () => {
    // The visibility of the modal is set in the ContentSharing parent element, so we can only test whether the function for closing the modal was called
    const setIsVisibleMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });
    const getWrapper = props =>
        mount(<SharingModal isVisible itemID={MOCK_ITEM_ID} language="" setIsVisible={setIsVisibleMock} {...props} />);

    const createSuccessMock = responseFromAPI => (id, successFn) => {
        return Promise.resolve(responseFromAPI).then(response => {
            successFn(response);
        });
    };

    const createMockItemData = (accessLevel = PEOPLE_IN_ITEM, permissionLevel = CAN_VIEW_DOWNLOAD) => {
        return {
            item: MOCK_ITEM,
            sharedLink: {
                ...MOCK_NORMALIZED_SHARED_LINK_DATA,
                accessLevel,
                permissionLevel,
            },
        };
    };

    beforeEach(() => {
        convertItemResponse.mockReturnValue(MOCK_CONVERTED_ITEM_DATA);
        convertUserResponse.mockReturnValue(MOCK_CONVERTED_USER_DATA);
        convertCollabsRequest.mockReturnValue(MOCK_COLLABS_CONVERTED_REQUEST);
    });

    afterEach(() => {
        jest.resetModules();
        jest.restoreAllMocks();
    });

    describe('loading states', () => {
        test.each([null, undefined, '', {}])('should show the LoadingIndicator if the api prop is %p', async api => {
            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ api, itemType: TYPE_FILE });
            });
            wrapper.update();
            expect(wrapper.exists(LoadingIndicator)).toBe(true);
            expect(wrapper.exists(UnifiedShareModal)).toBe(false);
            expect(wrapper.exists(SharedLinkSettingsModal)).toBe(false);
        });

        test('should show nothing if isVisible is false', async () => {
            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ api: {}, isVisible: false, itemType: TYPE_FILE });
            });
            wrapper.update();
            expect(wrapper.exists(LoadingIndicator)).toBe(false);
            expect(wrapper.exists(UnifiedShareModal)).toBe(false);
            expect(wrapper.exists(SharedLinkSettingsModal)).toBe(false);
        });
    });

    describe('with successful GET requests to the Item and Users API', () => {
        let getUser;
        let getFile;
        let getFolderFields;

        beforeEach(() => {
            getUser = jest.fn().mockImplementation(createSuccessMock(MOCK_USER_API_RESPONSE));
            getFile = jest.fn().mockImplementation(createSuccessMock(MOCK_ITEM_API_RESPONSE));
            getFolderFields = jest.fn().mockImplementation(createSuccessMock(MOCK_ITEM_API_RESPONSE));
        });

        test('should call getFileAPI().getFile() if itemType is "file"', async () => {
            const api = createAPIMock({ getFile }, null, { getUser });

            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ api, itemType: TYPE_FILE });
            });

            wrapper.update();
            const usm = wrapper.find(UnifiedShareModal);

            expect(getFile).toHaveBeenCalled();
            expect(convertItemResponse).toHaveBeenCalledWith(MOCK_ITEM_API_RESPONSE);
            expect(usm.prop('item')).toEqual(MOCK_ITEM);
            expect(usm.prop('sharedLink')).toEqual(MOCK_NORMALIZED_SHARED_LINK_DATA_FOR_USM);
            expect(usm.prop('inviteePermissions')).toEqual(INVITEE_PERMISSIONS_FILE);
            expect(wrapper.exists(SharingNotification)).toBe(true);
        });

        test('should call getFolderAPI().getFolderFields() if itemType is "folder"', async () => {
            const api = createAPIMock(null, { getFolderFields }, { getUser });

            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ api, itemType: TYPE_FOLDER });
            });
            wrapper.update();
            const usm = wrapper.find(UnifiedShareModal);
            expect(getFolderFields).toHaveBeenCalled();
            expect(convertItemResponse).toHaveBeenCalledWith(MOCK_ITEM_API_RESPONSE);
            expect(usm.prop('item')).toEqual(MOCK_ITEM);
            expect(usm.prop('sharedLink')).toEqual(MOCK_NORMALIZED_SHARED_LINK_DATA_FOR_USM);
            expect(usm.prop('inviteePermissions')).toEqual(INVITEE_PERMISSIONS_FOLDER);
            expect(wrapper.exists(SharingNotification)).toBe(true);
        });

        test('should call getUsersAPI().getUser() if item and sharedLink are defined, but currentUserID is not', async () => {
            const api = createAPIMock({ getFile }, null, { getUser });

            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ api, itemType: TYPE_FILE });
            });
            wrapper.update();
            const usm = wrapper.find(UnifiedShareModal);
            expect(getFile).toHaveBeenCalled();
            expect(getUser).toHaveBeenCalled();
            expect(convertUserResponse).toHaveBeenCalledWith(MOCK_USER_API_RESPONSE);
            expect(usm.prop('item')).toEqual(MOCK_ITEM);
            expect(usm.prop('sharedLink')).toEqual(MOCK_NORMALIZED_SHARED_LINK_DATA_FOR_USM);
            expect(wrapper.exists(SharingNotification)).toBe(true);
        });

        test('should toggle between the Unified Share Modal and the Shared Link Settings Modal', async () => {
            const api = createAPIMock({ getFile }, null, { getUser });

            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ api, itemType: TYPE_FILE });
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

        test('should disable shared link expiration for non-enterprise users', async () => {
            const api = createAPIMock({ getFile }, null, { getUser });

            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ api, itemType: TYPE_FILE });
            });
            wrapper.update();

            const usm = wrapper.find(UnifiedShareModal);
            await act(async () => {
                usm.invoke('onSettingsClick')();
            });
            wrapper.update();

            const settingsModal = wrapper.find(SharedLinkSettingsModal);
            expect(settingsModal.prop('canChangeExpiration')).toBe(false);
        });

        test('should enable shared link expiration for enterprise users', async () => {
            convertUserResponse.mockReturnValue(MOCK_CONVERTED_ENTERPRISE_USER_DATA);
            const api = createAPIMock({ getFile }, null, { getUser });

            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ api, itemType: TYPE_FILE });
            });
            wrapper.update();

            const usm = wrapper.find(UnifiedShareModal);
            await act(async () => {
                usm.invoke('onSettingsClick')();
            });
            wrapper.update();

            const settingsModal = wrapper.find(SharedLinkSettingsModal);
            expect(settingsModal.prop('canChangeExpiration')).toBe(true);
        });

        test('should show the LoadingIndicator while data is being retrieved', async () => {
            const mockApi = createAPIMock({ getFile: jest.fn().mockImplementation(() => Promise.resolve()) }, null);

            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ api: mockApi, itemType: TYPE_FILE });
            });

            wrapper.update();
            expect(wrapper.exists(LoadingIndicator)).toBe(true);
        });

        test('should call setIsVisible() when the X button is pressed', async () => {
            const api = createAPIMock({ getFile }, null, { getUser });

            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ api, displayInModal: true, itemType: TYPE_FILE });
            });
            wrapper.update();
            act(() => {
                wrapper.find(UnifiedShareModal).invoke('onRequestClose')();
            });
            wrapper.update();
            expect(setIsVisibleMock).toHaveBeenCalledWith(false);
        });

        test.each`
            expirationTimestampInSLSM      | expirationTimestampInUSM  | description
            ${MOCK_TIMESTAMP_MILLISECONDS} | ${MOCK_TIMESTAMP_SECONDS} | ${'defined'}
            ${null}                        | ${null}                   | ${'null'}
        `(
            'should set the correct timestamp props when sharedLink.expirationTimestamp is $description',
            async ({ expirationTimestampInSLSM, expirationTimestampInUSM }) => {
                const sharedLink = { ...MOCK_SHARED_LINK, expirationTimestamp: expirationTimestampInSLSM };
                convertItemResponse.mockReturnValue({ ...MOCK_CONVERTED_ITEM_DATA, sharedLink });

                const api = createAPIMock({ getFile }, null, { getUser });

                let wrapper;
                await act(async () => {
                    wrapper = getWrapper({ api, itemType: TYPE_FILE });
                });
                wrapper.update();

                const usm = wrapper.find(UnifiedShareModal);
                expect(usm.prop('sharedLink').expirationTimestamp).toBe(expirationTimestampInUSM);
                await act(async () => {
                    usm.invoke('onSettingsClick')();
                });
                wrapper.update();

                expect(wrapper.find(SharedLinkSettingsModal).prop('expirationTimestamp')).toBe(
                    expirationTimestampInSLSM,
                );
            },
        );
    });

    describe('with failed GET requests to the Item and/or Users API', () => {
        let api;
        let getFile;
        let getFolderFields;
        let getUser;
        beforeEach(() => {
            getFile = jest.fn().mockImplementation((id, successFn, failureFn) => {
                return Promise.reject(new Error({ status: '400' })).catch(response => {
                    failureFn(response);
                });
            });
            getFolderFields = jest.fn().mockImplementation((id, successFn, failureFn) => {
                return Promise.reject(new Error({ status: '400' })).catch(response => {
                    failureFn(response);
                });
            });
            getUser = jest.fn();
            api = createAPIMock({ getFile }, { getFolderFields }, { getUser });
        });

        beforeEach(() => {
            jest.clearAllMocks();
        });

        test('should show the initial data error notification and skip the call to getUser() if the call to getFile() fails', async () => {
            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ api, itemType: TYPE_FILE });
            });
            wrapper.update();
            expect(getFile).toHaveBeenCalled();
            expect(getUser).not.toHaveBeenCalled();
            expect(convertItemResponse).toHaveBeenCalledTimes(0);
            expect(wrapper.find(Notification).prop('type')).toBe(TYPE_ERROR);
            expect(wrapper.exists(UnifiedShareModal)).toBe(false);
            expect(wrapper.exists(SharingNotification)).toBe(false);
        });

        test('should show the initial data error notification and skip the call to getUser() if the call to getFolderFields() fails', async () => {
            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ api, itemType: TYPE_FOLDER });
            });
            wrapper.update();
            expect(getFolderFields).toHaveBeenCalled();
            expect(getUser).not.toHaveBeenCalled();
            expect(convertItemResponse).toHaveBeenCalledTimes(0);
            expect(wrapper.find(Notification).prop('type')).toBe(TYPE_ERROR);
            expect(wrapper.exists(UnifiedShareModal)).toBe(false);
            expect(wrapper.exists(SharingNotification)).toBe(false);
        });

        test('should show the LoadingIndicator while data is being retrieved', async () => {
            const mockApi = createAPIMock(null, {
                getFolderFields: jest.fn().mockImplementation(() => Promise.resolve()),
            });
            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ api: mockApi, itemType: TYPE_FOLDER });
            });

            wrapper.update();
            expect(wrapper.exists(LoadingIndicator)).toBe(true);
        });

        test('should close the initial data error notification when onClose() is called', async () => {
            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ api, itemType: TYPE_FILE });
            });
            wrapper.update();
            await act(async () => {
                wrapper.find(Notification).invoke('onClose')();
            });
            wrapper.update();
            expect(wrapper.exists(Notification)).toBe(false);
        });
    });

    describe('with successful item API calls, but an unsuccessful users API call', () => {
        let api;
        let getFile;
        let getFolderFields;
        let getUser;
        beforeEach(() => {
            getFile = jest.fn().mockImplementation(createSuccessMock(MOCK_ITEM_API_RESPONSE));
            getFolderFields = jest.fn().mockImplementation(createSuccessMock(MOCK_ITEM_API_RESPONSE));
            getUser = jest.fn().mockImplementation((id, successFn, failureFn) => {
                return Promise.reject(new Error({ status: '400' })).catch(response => {
                    failureFn(response);
                });
            });
            api = createAPIMock({ getFile }, { getFolderFields }, { getUser });
        });

        test('should show the initial data error notification if the call to getFile() succeeds, but the call to getUser() fails', async () => {
            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ api, itemType: TYPE_FILE });
            });
            wrapper.update();
            expect(getFile).toHaveBeenCalled();
            expect(convertItemResponse).toHaveBeenCalledWith(MOCK_ITEM_API_RESPONSE);
            expect(getUser).toHaveBeenCalled();
            expect(convertUserResponse).toHaveBeenCalledTimes(0);
            expect(wrapper.find(Notification).prop('type')).toBe(TYPE_ERROR);
            expect(wrapper.exists(UnifiedShareModal)).toBe(false);
            expect(wrapper.exists(SharingNotification)).toBe(false);
        });

        test('should show the initial data error notification if the call to getFolderFields() succeeds, but the call to getUser() fails', async () => {
            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ api, itemType: TYPE_FOLDER });
            });
            wrapper.update();
            expect(getFolderFields).toHaveBeenCalled();
            expect(convertItemResponse).toHaveBeenCalledWith(MOCK_ITEM_API_RESPONSE);
            expect(getUser).toHaveBeenCalled();
            expect(convertUserResponse).toHaveBeenCalledTimes(0);
            expect(wrapper.find(Notification).prop('type')).toBe(TYPE_ERROR);
            expect(wrapper.exists(UnifiedShareModal)).toBe(false);
            expect(wrapper.exists(SharingNotification)).toBe(false);
        });

        test('should show the LoadingIndicator while data is being retrieved', async () => {
            const mockApi = createAPIMock(null, {
                getFolderFields: jest.fn().mockImplementation(() => Promise.resolve()),
            });
            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ api: mockApi, itemType: TYPE_FOLDER });
            });

            wrapper.update();
            expect(wrapper.exists(LoadingIndicator)).toBe(true);
        });
    });

    describe('with specific initial data errors', () => {
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
                const api = createAPIMock(null, { getFolderFields }, { getUser });

                let wrapper;
                await act(async () => {
                    wrapper = getWrapper({ api, itemType: TYPE_FOLDER });
                });
                wrapper.update();
                expect(getFolderFields).toHaveBeenCalled();
                const initialDataErrorNotification = wrapper.find(Notification);
                expect(initialDataErrorNotification.prop('type')).toBe(TYPE_ERROR);
                expect(initialDataErrorNotification.find(FormattedMessage).prop('id')).toBe(
                    `be.contentSharing.${expectedErrorName}`,
                );
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
                const api = createAPIMock(null, { getFolderFields }, { getUser });

                let wrapper;
                await act(async () => {
                    wrapper = getWrapper({ api, itemType: TYPE_FOLDER });
                });
                wrapper.update();
                expect(getFolderFields).toHaveBeenCalled();
                const initialDataErrorNotification = wrapper.find(Notification);
                expect(initialDataErrorNotification.prop('type')).toBe(TYPE_ERROR);
                expect(initialDataErrorNotification.find(FormattedMessage).prop('id')).toBe(
                    `be.contentSharing.${expectedErrorName}`,
                );
            },
        );

        test('should show the default error message when a call fails and the response is unparseable', async () => {
            const getFolderFields = jest.fn().mockImplementation((id, successFn, failureFn) => {
                return Promise.reject(new Error()).catch(() => {
                    failureFn({ response: undefined });
                });
            });
            const getUser = jest.fn();
            const api = createAPIMock(null, { getFolderFields }, { getUser });

            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ api, itemType: TYPE_FOLDER });
            });
            wrapper.update();
            expect(getFolderFields).toHaveBeenCalled();
            const initialDataErrorNotification = wrapper.find(Notification);
            expect(initialDataErrorNotification.prop('type')).toBe(TYPE_ERROR);
            expect(initialDataErrorNotification.find(FormattedMessage).prop('id')).toBe(
                `be.contentSharing.loadingError`,
            );
        });
    });

    describe('with successful PUT requests to the Item API', () => {
        let api;
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
            api = createAPIMock(
                {
                    getFile: jest
                        .fn()
                        .mockImplementation(createSuccessMock(MOCK_ITEM_API_RESPONSE_WITHOUT_SHARED_LINK)),
                    share,
                    updateSharedLink,
                },
                {
                    getFolderFields: jest
                        .fn()
                        .mockImplementation(createSuccessMock(MOCK_ITEM_API_RESPONSE_WITHOUT_SHARED_LINK)),
                    share,
                    updateSharedLink,
                },
                { getUser: jest.fn().mockImplementation(createSuccessMock(MOCK_USER_API_RESPONSE)) },
            );
        });

        test('should call share() from onAddLink() and set a new shared link', async () => {
            convertItemResponse.mockReturnValue(MOCK_CONVERTED_ITEM_DATA_WITHOUT_SHARED_LINK);

            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ api, itemType: TYPE_FOLDER });
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
                undefined,
                expect.anything(),
                expect.anything(),
                CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
            );
            expect(wrapper.find(UnifiedShareModal).prop('sharedLink')).toEqual(
                MOCK_NORMALIZED_SHARED_LINK_DATA_FOR_USM,
            );
        });

        test.each`
            displayInModal | description
            ${true}        | ${'USM instances'}
            ${false}       | ${'USF-only instances'}
        `(
            'should call share() from onRemoveLink() and remove the existing shared link for $description',
            async ({ displayInModal }) => {
                let wrapper;
                await act(async () => {
                    wrapper = getWrapper({ api, displayInModal, itemType: TYPE_FILE });
                });
                wrapper.update();

                const usm = wrapper.find(UnifiedShareModal);
                expect(usm.prop('sharedLink')).toEqual(MOCK_NORMALIZED_SHARED_LINK_DATA_FOR_USM);

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

                if (displayInModal) {
                    expect(setIsVisibleMock).toHaveBeenCalledWith(false);
                } else {
                    expect(wrapper.find(UnifiedShareModal).prop('sharedLink')).toEqual(MOCK_NULL_SHARED_LINK);
                }
            },
        );

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
                    wrapper = getWrapper({ api, itemType: TYPE_FOLDER });
                });
                wrapper.update();

                const usm = wrapper.find(UnifiedShareModal);
                expect(usm.prop('sharedLink')).toEqual(MOCK_NORMALIZED_SHARED_LINK_DATA_FOR_USM);

                convertItemResponse.mockReset();
                convertItemResponse.mockReturnValue(createMockItemData(accessLevelFromUSM));

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
                expect(wrapper.find(UnifiedShareModal).prop('sharedLink')).toEqual({
                    ...MOCK_NORMALIZED_SHARED_LINK_DATA_FOR_USM,
                    accessLevel: accessLevelFromUSM,
                });
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
                    wrapper = getWrapper({ api, itemType: TYPE_FILE });
                });
                wrapper.update();

                const usm = wrapper.find(UnifiedShareModal);
                expect(usm.prop('sharedLink')).toEqual(MOCK_NORMALIZED_SHARED_LINK_DATA_FOR_USM);

                convertItemResponse.mockReset();
                convertItemResponse.mockReturnValue(createMockItemData(undefined, permissionLevelFromUSM));

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
                expect(wrapper.find(UnifiedShareModal).prop('sharedLink')).toEqual({
                    ...MOCK_NORMALIZED_SHARED_LINK_DATA_FOR_USM,
                    permissionLevel: permissionLevelFromUSM,
                });
            },
        );

        test('should call updateSharedLink() from onSubmitSettings()', async () => {
            convertSharedLinkSettings.mockReturnValue(MOCK_CONVERTED_SETTINGS);
            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ api, itemType: TYPE_FILE });
            });
            wrapper.update();

            const usm = wrapper.find(UnifiedShareModal);
            expect(usm.prop('sharedLink')).toEqual(MOCK_NORMALIZED_SHARED_LINK_DATA_FOR_USM);

            await act(async () => {
                usm.invoke('onSettingsClick')();
            });
            wrapper.update();

            convertItemResponse.mockReset();
            convertItemResponse.mockReturnValue({
                item: MOCK_ITEM,
                sharedLink: {
                    ...MOCK_NORMALIZED_SHARED_LINK_DATA,
                    ...MOCK_CONVERTED_SETTINGS,
                },
            });

            await act(async () => {
                wrapper.find(SharedLinkSettingsModal).invoke('onSubmit')(MOCK_SETTINGS_WITH_ALL_FEATURES);
            });
            wrapper.update();
            expect(updateSharedLink).toHaveBeenCalledWith(
                { id: MOCK_ITEM_ID, permissions: {} },
                MOCK_CONVERTED_SETTINGS,
                expect.anything(),
                expect.anything(),
                CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
            );
            expect(wrapper.find(UnifiedShareModal).prop('sharedLink')).toEqual({
                ...MOCK_NORMALIZED_SHARED_LINK_DATA_FOR_USM,
                ...MOCK_CONVERTED_SETTINGS,
            });
        });
    });

    describe('with successful GET requests to the enterprise users and groups APIs', () => {
        let api;
        let getGroupsInEnterprise;
        let getUsersInEnterprise;
        beforeAll(() => {
            getGroupsInEnterprise = jest.fn().mockImplementation((itemID, successFn) => {
                return Promise.resolve(MOCK_GROUP_CONTACTS_API_RESPONSE).then(response => {
                    return successFn(response);
                });
            });
            getUsersInEnterprise = jest.fn().mockImplementation((itemID, successFn) => {
                return Promise.resolve(MOCK_CONTACTS_API_RESPONSE).then(response => {
                    return successFn(response);
                });
            });
            api = createAPIMock(
                { getFile: jest.fn().mockImplementation(createSuccessMock(MOCK_ITEM_API_RESPONSE)) },
                null,
                {
                    getUser: jest.fn().mockImplementation(createSuccessMock(MOCK_USER_API_RESPONSE)),
                },
                null,
                {
                    getGroupsInEnterprise,
                },
                {
                    getUsersInEnterprise,
                },
            );
            convertGroupContactsResponse.mockReturnValue(MOCK_GROUP_CONTACTS_CONVERTED_RESPONSE);
            convertUserContactsResponse.mockReturnValue(MOCK_CONTACTS_CONVERTED_RESPONSE);
            convertUserContactsByEmailResponse.mockReturnValue(MOCK_CONTACTS_BY_EMAIL_CONVERTED_RESPONSE);
        });

        test('should call getUsersInEnterprise() and getGroupsInEnterprise() from getCollaboratorContacts() and return a converted response', async () => {
            const MOCK_FILTER = 'content';

            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ api, itemType: TYPE_FILE });
            });
            wrapper.update();

            const usm = wrapper.find(UnifiedShareModal);
            const response = usm.invoke('getCollaboratorContacts')(MOCK_FILTER);

            wrapper.update();

            expect(getUsersInEnterprise).toHaveBeenCalledWith(MOCK_ITEM_ID, expect.anything(), expect.anything(), {
                filter_term: MOCK_FILTER,
            });
            expect(getGroupsInEnterprise).toHaveBeenCalledWith(
                MOCK_ITEM_ID,
                expect.anything(Function),
                expect.anything(Function),
                { fields: 'name,permissions', filter_term: MOCK_FILTER },
            );
            expect(response).resolves.toEqual([
                ...MOCK_CONTACTS_CONVERTED_RESPONSE,
                ...MOCK_GROUP_CONTACTS_CONVERTED_RESPONSE,
            ]);
        });

        test('should call getUsersInEnterprise() from getContactsByEmail() and return a converted response', async () => {
            const MOCK_EMAIL = 'contentsharing@box.com';

            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ api, itemType: TYPE_FILE });
            });
            wrapper.update();

            const usm = wrapper.find(UnifiedShareModal);
            const response = usm.invoke('getContactsByEmail')({ emails: [MOCK_EMAIL] });

            wrapper.update();

            expect(getUsersInEnterprise).toHaveBeenCalledWith(MOCK_ITEM_ID, expect.anything(), expect.anything(), {
                filter_term: MOCK_EMAIL,
            });
            expect(response).resolves.toEqual(MOCK_CONTACTS_BY_EMAIL_CONVERTED_RESPONSE);
        });
    });

    describe('with successful POST requests to the Collaborations API', () => {
        test.each`
            displayInModal | description
            ${true}        | ${'USM instances'}
            ${false}       | ${'USF-only instances'}
        `(
            'should call addCollaboration() from sendInvites() and show a success notification for $description',
            async ({ displayInModal }) => {
                const itemData = { id: MOCK_ITEM_ID, type: TYPE_FOLDER };
                const addCollaboration = jest.fn().mockImplementation((item, collab, successFn) => {
                    return Promise.resolve().then(() => {
                        return successFn();
                    });
                });
                const api = createAPIMock(
                    null,
                    { getFolderFields: jest.fn().mockImplementation(createSuccessMock(MOCK_ITEM_API_RESPONSE)) },
                    { getUser: jest.fn().mockImplementation(createSuccessMock(MOCK_USER_API_RESPONSE)) },
                    { addCollaboration },
                    null,
                    {
                        getUsersInEnterprise: jest
                            .fn()
                            .mockImplementation(createSuccessMock(MOCK_CONTACTS_API_RESPONSE)),
                    },
                );

                let wrapper;
                await act(async () => {
                    wrapper = getWrapper({ api, displayInModal, itemType: TYPE_FOLDER });
                });
                wrapper.update();

                await act(async () => {
                    wrapper.find(UnifiedShareModal).invoke('sendInvites')(MOCK_COLLABS_REQUEST_USERS_AND_GROUPS);
                });
                wrapper.update();

                MOCK_COLLABS_CONVERTED_USERS.forEach(user => {
                    expect(addCollaboration).toHaveBeenCalledWith(
                        itemData,
                        user,
                        expect.anything(Function),
                        expect.anything(Function),
                    );
                });
                MOCK_COLLABS_CONVERTED_GROUPS.forEach(group => {
                    expect(addCollaboration).toHaveBeenCalledWith(
                        itemData,
                        group,
                        expect.anything(Function),
                        expect.anything(Function),
                    );
                });

                expect(wrapper.find(Notification).prop('type')).toBe(TYPE_INFO);

                if (displayInModal) {
                    expect(setIsVisibleMock).toHaveBeenCalledWith(false);
                }
            },
        );
    });

    describe('with non-blocking failed API requests', () => {
        let api;
        let share;
        let updateSharedLink;
        let getGroupsInEnterprise;
        let getUsersInEnterprise;
        let addCollaboration;
        const createShareFailureMock = () =>
            jest.fn().mockImplementation((itemData, otherRequestData, successFn, failureFn) => {
                return Promise.reject(new Error({ status: '400' })).catch(response => {
                    failureFn(response);
                });
            });
        beforeAll(() => {
            share = createShareFailureMock();
            updateSharedLink = createShareFailureMock();
            addCollaboration = createShareFailureMock();
            getGroupsInEnterprise = jest.fn().mockImplementation((itemID, successFn, failureFn) => {
                return Promise.reject(new Error({ status: '400' })).catch(response => {
                    failureFn(response);
                });
            });
            getUsersInEnterprise = jest.fn().mockImplementation((itemID, successFn, failureFn) => {
                return Promise.reject(new Error({ status: '400' })).catch(response => {
                    failureFn(response);
                });
            });
            api = createAPIMock(
                {
                    getFile: jest
                        .fn()
                        .mockImplementation(createSuccessMock(MOCK_ITEM_API_RESPONSE_WITHOUT_SHARED_LINK)),
                    share,
                    updateSharedLink,
                },
                {
                    getFolderFields: jest
                        .fn()
                        .mockImplementation(createSuccessMock(MOCK_ITEM_API_RESPONSE_WITHOUT_SHARED_LINK)),
                    share,
                    updateSharedLink,
                },
                {
                    getUser: jest.fn().mockImplementation(createSuccessMock(MOCK_USER_API_RESPONSE)),
                },
                {
                    addCollaboration,
                },
                {
                    getGroupsInEnterprise,
                },
                {
                    getUsersInEnterprise,
                },
            );
        });

        test.each([
            'changeSharedLinkAccessLevel',
            'changeSharedLinkPermissionLevel',
            'getCollaboratorContacts',
            'onAddLink',
        ])('should show an error notification if %s() fails', async usmFn => {
            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ api, itemType: TYPE_FOLDER });
            });
            wrapper.update();
            expect(wrapper.exists(Notification)).toBe(false);

            await act(async () => {
                wrapper.find(UnifiedShareModal).invoke(`${usmFn}`)();
            });
            wrapper.update();
            const notification = wrapper.find(Notification);
            expect(notification.prop('type')).toBe(TYPE_ERROR);
            expect(notification.prop('duration')).toBe(DURATION_SHORT);
        });

        test.each(['onRemoveLink', 'sendInvites'])(
            'should call setIsVisible() and show a notification after %s() fails',
            async usmFn => {
                let wrapper;
                await act(async () => {
                    wrapper = getWrapper({ api, displayInModal: true, itemType: TYPE_FOLDER });
                });
                wrapper.update();

                await act(async () => {
                    wrapper.find(UnifiedShareModal).invoke(`${usmFn}`)();
                });
                wrapper.update();
                expect(setIsVisibleMock).toHaveBeenCalledWith(false);
                const notification = wrapper.find(Notification);
                expect(notification.prop('type')).toBe(TYPE_ERROR);
                expect(notification.prop('duration')).toBe(DURATION_SHORT);
            },
        );

        test('should show an error notification if onSubmitSettings() fails', async () => {
            convertSharedLinkSettings.mockReturnValue(MOCK_CONVERTED_SETTINGS);
            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ api, itemType: TYPE_FILE });
            });
            wrapper.update();

            await act(async () => {
                wrapper.find(UnifiedShareModal).invoke('onSettingsClick')();
            });
            wrapper.update();
            expect(wrapper.exists(Notification)).toBe(false);

            await act(async () => {
                wrapper.find(SharedLinkSettingsModal).invoke('onSubmit')(MOCK_SETTINGS_WITH_ALL_FEATURES);
            });
            wrapper.update();
            const notification = wrapper.find(Notification);
            expect(notification.prop('type')).toBe(TYPE_ERROR);
            expect(notification.prop('duration')).toBe(DURATION_SHORT);
        });

        test('should do nothing if getContactsByEmail() fails', async () => {
            const MOCK_EMAIL = 'contentsharing@box.com';

            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ api, itemType: TYPE_FILE });
            });
            wrapper.update();

            const usm = wrapper.find(UnifiedShareModal);
            let response;
            await act(async () => {
                response = usm.invoke('getContactsByEmail')({ emails: [MOCK_EMAIL] });
            });
            wrapper.update();

            expect(getUsersInEnterprise).toHaveBeenCalledWith(MOCK_ITEM_ID, expect.anything(), expect.anything(), {
                filter_term: MOCK_EMAIL,
            });
            expect(response).resolves.toBeFalsy();
            expect(wrapper.exists(Notification)).toBeFalsy();
        });
    });
});
