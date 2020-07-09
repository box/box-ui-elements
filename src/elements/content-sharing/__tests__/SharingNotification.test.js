import React from 'react';
import { mount } from 'enzyme';
import SharingNotification from '../SharingNotification';
import { TYPE_FOLDER } from '../../../constants';
import { MOCK_ITEM_ID, MOCK_ITEM_PERMISSIONS } from '../../../features/unified-share-modal/utils/__mocks__/USMMocks';
import NotificationsWrapper from '../../../components/notification/NotificationsWrapper';

jest.mock('../../../api');
jest.mock('../../../features/unified-share-modal/utils/convertData');

describe('elements/content-sharing/SharingNotification', () => {
    const setChangeSharedLinkAccessLevelStub = jest.fn();
    const setChangeSharedLinkPermissionLevelStub = jest.fn();
    const setItemStub = jest.fn();
    const setOnAddLinkStub = jest.fn();
    const setOnRemoveLinkStub = jest.fn();
    const setSharedLinkStub = jest.fn();
    const apiInstance = {
        getFolderAPI: jest.fn().mockReturnValue({
            share: jest.fn(),
            updateSharedLink: jest.fn(),
        }),
    };
    const getWrapper = props =>
        mount(
            <SharingNotification
                api={apiInstance}
                itemID={MOCK_ITEM_ID}
                itemPermissions={MOCK_ITEM_PERMISSIONS}
                itemType={TYPE_FOLDER}
                setChangeSharedLinkAccessLevel={setChangeSharedLinkAccessLevelStub}
                setChangeSharedLinkPermissionLevel={setChangeSharedLinkPermissionLevelStub}
                setItem={setItemStub}
                setOnAddLink={setOnAddLinkStub}
                setOnRemoveLink={setOnRemoveLinkStub}
                setOnSharedLink={setSharedLinkStub}
                {...props}
            />,
        );

    test('should call state setting functions', async () => {
        getWrapper();
        expect(setOnAddLinkStub).toHaveBeenCalled();
        expect(setOnRemoveLinkStub).toHaveBeenCalled();
        expect(setChangeSharedLinkAccessLevelStub).toHaveBeenCalled();
        expect(setChangeSharedLinkPermissionLevelStub).toHaveBeenCalled();
    });

    test('should not call state setting functions if itemPermissions is null', () => {
        getWrapper({ itemPermissions: null });
        expect(setOnAddLinkStub).not.toHaveBeenCalled();
        expect(setOnRemoveLinkStub).not.toHaveBeenCalled();
        expect(setChangeSharedLinkAccessLevelStub).not.toHaveBeenCalled();
        expect(setChangeSharedLinkPermissionLevelStub).not.toHaveBeenCalled();
    });

    test('should render a NotificationsWrapper', async () => {
        const wrapper = getWrapper();
        expect(wrapper.exists(NotificationsWrapper)).toBe(true);
    });
});
