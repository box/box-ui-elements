// @flow

import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import API from '../../../api';
import useInvites from '../hooks/useInvites';
import { TYPE_FOLDER } from '../../../constants';
import {
    MOCK_COLLABS_API_RESPONSE,
    MOCK_COLLABS_CONVERTED_REQUEST,
    MOCK_COLLAB_REQUEST_USERS_AND_GROUPS,
    MOCK_COLLAB_REQUEST_GROUPS_ARRAY,
    MOCK_COLLAB_REQUEST_USERS_ARRAY,
    MOCK_ITEM_ID,
} from '../../../features/unified-share-modal/utils/__mocks__/USMMocks';

const itemData = { id: MOCK_ITEM_ID, type: TYPE_FOLDER };
const successfulAPIResponse = MOCK_COLLABS_API_RESPONSE.entries[0];
const handleSuccess = jest.fn();
const handleError = jest.fn();
const transformRequestSpy = jest.fn().mockReturnValue(MOCK_COLLABS_CONVERTED_REQUEST);
const transformResponseSpy = jest.fn().mockReturnValue(successfulAPIResponse);

function FakeComponent({
    api,
    transformRequest,
    transformResponse,
}: {
    api: API,
    transformRequest: Function,
    transformResponse: Function,
}) {
    const [sendInvites, setSendInvites] = React.useState<null | Function>(null);

    const updatedSendInvitesFn = useInvites(api, MOCK_ITEM_ID, TYPE_FOLDER, {
        handleSuccess,
        handleError,
        transformRequest,
        transformResponse,
    });

    if (updatedSendInvitesFn && !sendInvites) {
        setSendInvites(() => updatedSendInvitesFn);
    }

    return (
        sendInvites && (
            <button onClick={sendInvites} type="submit">
                &#9835; Box UI Elements &#9835;
            </button>
        )
    );
}

describe('elements/content-sharing/hooks/useInvites', () => {
    let addCollaboration;
    let mockAPI;

    describe('with successful API calls', () => {
        beforeAll(() => {
            addCollaboration = jest.fn().mockImplementation((itemID, collab, addCollaborationSuccess) => {
                addCollaborationSuccess(successfulAPIResponse);
            });
            mockAPI = {
                getCollaborationsAPI: jest.fn().mockReturnValue({
                    addCollaboration,
                }),
            };
        });

        test('should set the value of sendInvites() and send invites on invocation', () => {
            let fakeComponent;

            act(() => {
                fakeComponent = mount(
                    <FakeComponent
                        api={mockAPI}
                        transformRequest={transformRequestSpy}
                        transformResponse={transformResponseSpy}
                    />,
                );
            });
            fakeComponent.update();

            fakeComponent.find('button').invoke('onClick')(MOCK_COLLAB_REQUEST_USERS_AND_GROUPS);

            expect(transformRequestSpy).toHaveBeenCalledWith(MOCK_COLLAB_REQUEST_USERS_AND_GROUPS);
            MOCK_COLLAB_REQUEST_USERS_ARRAY.forEach(user => {
                expect(addCollaboration).toHaveBeenCalledWith(
                    itemData,
                    user,
                    expect.anything(Function),
                    expect.anything(Function),
                );
            });
            MOCK_COLLAB_REQUEST_GROUPS_ARRAY.forEach(group => {
                expect(addCollaboration).toHaveBeenCalledWith(
                    itemData,
                    group,
                    expect.anything(Function),
                    expect.anything(Function),
                );
            });
            expect(handleSuccess).toHaveBeenCalledWith(successfulAPIResponse);
            expect(transformResponseSpy).toHaveBeenCalledWith(successfulAPIResponse);
        });

        test('should do nothing without the request transformation function', async () => {
            let fakeComponent;

            act(() => {
                fakeComponent = mount(<FakeComponent api={mockAPI} />);
            });
            fakeComponent.update();

            await fakeComponent.find('button').invoke('onClick')(MOCK_COLLAB_REQUEST_USERS_AND_GROUPS);
            expect(addCollaboration).not.toHaveBeenCalled();
        });
    });

    describe('with failed API calls', () => {
        beforeAll(() => {
            addCollaboration = jest
                .fn()
                .mockImplementation((itemID, collab, addCollaborationSuccess, addCollaborationError) => {
                    addCollaborationError();
                });
            mockAPI = {
                getCollaborationsAPI: jest.fn().mockReturnValue({
                    addCollaboration,
                }),
            };
        });

        test('should set the value of getContacts() and call handleError() when invoked', () => {
            let fakeComponent;

            act(() => {
                fakeComponent = mount(
                    <FakeComponent
                        api={mockAPI}
                        transformRequest={transformRequestSpy}
                        transformResponse={transformResponseSpy}
                    />,
                );
            });
            fakeComponent.update();

            fakeComponent.find('button').invoke('onClick')(MOCK_COLLAB_REQUEST_USERS_AND_GROUPS);

            expect(transformRequestSpy).toHaveBeenCalledWith(MOCK_COLLAB_REQUEST_USERS_AND_GROUPS);
            MOCK_COLLAB_REQUEST_USERS_ARRAY.forEach(user => {
                expect(addCollaboration).toHaveBeenCalledWith(
                    itemData,
                    user,
                    expect.anything(Function),
                    expect.anything(Function),
                );
            });
            MOCK_COLLAB_REQUEST_GROUPS_ARRAY.forEach(group => {
                expect(addCollaboration).toHaveBeenCalledWith(
                    itemData,
                    group,
                    expect.anything(Function),
                    expect.anything(Function),
                );
            });
            expect(handleError).toHaveBeenCalled();
            expect(transformResponseSpy).not.toHaveBeenCalled();
        });
    });
});
