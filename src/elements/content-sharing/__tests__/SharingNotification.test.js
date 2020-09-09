import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import SharingNotification from '../SharingNotification';
import { TYPE_FILE, TYPE_FOLDER } from '../../../constants';
import {
    MOCK_AVATAR_URL_MAP,
    MOCK_COLLABS_API_RESPONSE,
    MOCK_COLLABS_CONVERTED_RESPONSE,
    MOCK_ITEM_ID,
    MOCK_ITEM_PERMISSIONS,
    MOCK_OWNER_EMAIL,
    MOCK_OWNER_ID,
    MOCK_SHARED_LINK,
} from '../../../features/unified-share-modal/utils/__mocks__/USMMocks';
import Notification from '../../../components/notification/Notification';
import NotificationsWrapper from '../../../components/notification/NotificationsWrapper';
import { convertCollabsResponse } from '../../../features/unified-share-modal/utils/convertData';

jest.mock('../../../api');
jest.mock('../../../features/unified-share-modal/utils/convertData');

describe('elements/content-sharing/SharingNotification', () => {
    const setChangeSharedLinkAccessLevelStub = jest.fn();
    const setChangeSharedLinkPermissionLevelStub = jest.fn();
    const setGetContactsStub = jest.fn();
    const setItemStub = jest.fn();
    const setOnAddLinkStub = jest.fn();
    const setOnRemoveLinkStub = jest.fn();
    const setSharedLinkStub = jest.fn();
    const setCollaboratorsListStub = jest.fn();
    const setOnSubmitSettingsStub = jest.fn();
    const setSendInvitesStub = jest.fn();
    const getAvatarUrlWithAccessTokenStub = jest.fn(
        userID => `https://api.box.com/2.0/users/${userID}/avatar?access_token=foo&pic_type=large`,
    );
    const createAPIInstance = getCollabStub => ({
        getCollaborationsAPI: jest.fn().mockReturnValue({
            addCollaboration: jest.fn(),
        }),
        getFileAPI: jest.fn().mockReturnValue({
            share: jest.fn(),
            updateSharedLink: jest.fn(),
        }),
        getFileCollaborationsAPI: jest.fn().mockReturnValue({
            getCollaborations: getCollabStub,
        }),
        getFolderAPI: jest.fn().mockReturnValue({
            share: jest.fn(),
            updateSharedLink: jest.fn(),
        }),
        getFolderCollaborationsAPI: jest.fn().mockReturnValue({
            getCollaborations: getCollabStub,
        }),
        getUsersAPI: jest.fn().mockReturnValue({
            getAvatarUrlWithAccessToken: getAvatarUrlWithAccessTokenStub,
        }),
    });

    const getWrapper = props =>
        mount(
            <SharingNotification
                collaboratorsList={null}
                currentUserID={MOCK_OWNER_ID}
                getContacts={null}
                itemID={MOCK_ITEM_ID}
                itemType={TYPE_FOLDER}
                ownerEmail={MOCK_OWNER_EMAIL}
                ownerID={MOCK_OWNER_ID}
                permissions={MOCK_ITEM_PERMISSIONS}
                sendInvites={null}
                setChangeSharedLinkAccessLevel={setChangeSharedLinkAccessLevelStub}
                setChangeSharedLinkPermissionLevel={setChangeSharedLinkPermissionLevelStub}
                setCollaboratorsList={setCollaboratorsListStub}
                setGetContacts={setGetContactsStub}
                setItem={setItemStub}
                setOnAddLink={setOnAddLinkStub}
                setOnRemoveLink={setOnRemoveLinkStub}
                setOnSharedLink={setSharedLinkStub}
                setOnSubmitSettings={setOnSubmitSettingsStub}
                setSendInvites={setSendInvitesStub}
                sharedLink={MOCK_SHARED_LINK}
                {...props}
            />,
        );

    let apiInstance;
    let getCollaborations;

    describe('component rendering', () => {
        beforeAll(() => {
            getCollaborations = jest.fn();
            apiInstance = createAPIInstance(getCollaborations);
        });

        test('should call state setting functions', async () => {
            getWrapper({ api: apiInstance });
            expect(setOnAddLinkStub).toHaveBeenCalled();
            expect(setOnRemoveLinkStub).toHaveBeenCalled();
            expect(setChangeSharedLinkAccessLevelStub).toHaveBeenCalled();
            expect(setChangeSharedLinkPermissionLevelStub).toHaveBeenCalled();
            expect(setGetContactsStub).toHaveBeenCalled();
            expect(setOnSubmitSettingsStub).toHaveBeenCalled();
            expect(setSendInvitesStub).toHaveBeenCalled();
        });

        test('should render a NotificationsWrapper', async () => {
            const wrapper = getWrapper({ api: apiInstance });
            expect(wrapper.exists(NotificationsWrapper)).toBe(true);
        });
    });

    describe('with successful GET requests to the Collaborations API', () => {
        beforeAll(() => {
            getCollaborations = jest.fn().mockImplementation((id, successFn) => {
                return Promise.resolve(MOCK_COLLABS_API_RESPONSE).then(response => {
                    successFn(response);
                });
            });
            apiInstance = createAPIInstance(getCollaborations);
            convertCollabsResponse.mockReturnValue(MOCK_COLLABS_CONVERTED_RESPONSE);
        });

        test.each`
            apiName                         | itemType
            ${'getFileCollaborationsAPI'}   | ${TYPE_FILE}
            ${'getFolderCollaborationsAPI'} | ${TYPE_FOLDER}
        `('should call $apiName().getCollaborations() if itemType is $itemType', async ({ itemType }) => {
            let wrapper;
            await act(async () => {
                wrapper = getWrapper({ api: apiInstance, itemType });
            });
            wrapper.update();
            expect(getCollaborations).toHaveBeenCalledWith(MOCK_ITEM_ID, expect.anything(), expect.anything());
            expect(convertCollabsResponse).toHaveBeenCalledWith(
                MOCK_COLLABS_API_RESPONSE,
                MOCK_AVATAR_URL_MAP,
                MOCK_OWNER_EMAIL,
                true,
            );
            expect(setCollaboratorsListStub).toHaveBeenCalledWith(MOCK_COLLABS_CONVERTED_RESPONSE);
            expect(getAvatarUrlWithAccessTokenStub).toHaveBeenCalled();
            expect(wrapper.exists(Notification)).toBe(false);
        });
    });

    describe('with failed GET requests to the Collaborations API', () => {
        beforeAll(() => {
            getCollaborations = jest.fn().mockImplementation((id, successFn, failureFn) => {
                return Promise.reject(new Error({ status: '400' })).catch(response => {
                    failureFn(response);
                });
            });
            apiInstance = createAPIInstance(getCollaborations);
            convertCollabsResponse.mockReturnValue({ collaborators: [] });
        });

        test.each`
            apiName                         | itemType
            ${'getFileCollaborationsAPI'}   | ${TYPE_FILE}
            ${'getFolderCollaborationsAPI'} | ${TYPE_FOLDER}
        `('should call $apiName().getCollaborations() if itemType is $itemType', async ({ itemType }) => {
            let wrapper;

            await act(async () => {
                wrapper = getWrapper({ api: apiInstance, itemType });
            });
            wrapper.update();
            expect(getCollaborations).toHaveBeenCalledWith(MOCK_ITEM_ID, expect.anything(), expect.anything());
            expect(setCollaboratorsListStub).toHaveBeenCalledWith({
                collaborators: [],
            });
            const notification = wrapper.find(Notification);
            expect(
                notification
                    .find(FormattedMessage)
                    .at(0)
                    .prop('id'),
            ).toBe('be.contentSharing.collaboratorsLoadingError');
        });
    });
});
