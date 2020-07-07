import React from 'react';
import { mount } from 'enzyme';
import SharingNotification from '../SharingNotification';
import { TYPE_FOLDER } from '../../../constants';
import {
    MOCK_ITEM_API_RESPONSE,
    MOCK_ITEM_ID,
    MOCK_ITEM_PERMISSIONS,
} from '../../../features/unified-share-modal/utils/__mocks__/USMMocks';
import NotificationsWrapper from '../../../components/notification/NotificationsWrapper';

jest.mock('../../../api');
jest.mock('../../../features/unified-share-modal/utils/convertData');

describe('elements/content-sharing/SharingNotification', () => {
    const setItemStub = jest.fn();
    const setOnAddLinkStub = jest.fn();
    const setOnRemoveLinkStub = jest.fn();
    const setSharedLinkStub = jest.fn();
    const share = jest.fn().mockImplementation((dataForAPI, accessType, successFn) => {
        return Promise.resolve(MOCK_ITEM_API_RESPONSE).then(response => {
            successFn(response);
        });
    });
    const apiInstance = {
        getFolderAPI: jest.fn().mockReturnValue({
            share,
        }),
    };
    const getWrapper = props =>
        mount(
            <SharingNotification
                api={apiInstance}
                itemID={MOCK_ITEM_ID}
                itemPermissions={MOCK_ITEM_PERMISSIONS}
                itemType={TYPE_FOLDER}
                setItem={setItemStub}
                setOnAddLink={setOnAddLinkStub}
                setOnRemoveLink={setOnRemoveLinkStub}
                setOnSharedLink={setSharedLinkStub}
                {...props}
            />,
        );

    test('should call setOnAddLink() and setOnRemoveLink()', async () => {
        getWrapper();
        expect(setOnAddLinkStub).toHaveBeenCalled();
        expect(setOnRemoveLinkStub).toHaveBeenCalled();
    });

    test('should not call setOnAddLink() or setOnRemoveLink() if itemPermissions is null', () => {
        getWrapper({ itemPermissions: null });
        expect(setOnAddLinkStub).not.toHaveBeenCalled();
        expect(setOnRemoveLinkStub).not.toHaveBeenCalled();
    });

    test('should render a NotificationsWrapper', async () => {
        const wrapper = getWrapper();
        expect(wrapper.exists(NotificationsWrapper)).toBe(true);
    });
});
