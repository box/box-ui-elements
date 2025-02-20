// @flow

import React, { act } from 'react';
import { mount } from 'enzyme';
import API from '../../../api';
import useCollaborators from '../hooks/useCollaborators';
import { TYPE_FILE, TYPE_FOLDER } from '../../../constants';
import {
    MOCK_COLLABS_CONVERTED_RESPONSE,
    MOCK_ITEM_ID,
} from '../../../features/unified-share-modal/utils/__mocks__/USMMocks';

const handleSuccess = jest.fn().mockReturnValue(MOCK_COLLABS_CONVERTED_RESPONSE);
const handleError = jest.fn();

function FakeComponent({ api, itemType }: { api: API; itemType: string }) {
    const [collaboratorsList, setCollaboratorsList] = React.useState(null);

    const collabsResponse = useCollaborators(api, MOCK_ITEM_ID, itemType, { handleSuccess, handleError });

    if (collabsResponse && !collaboratorsList) {
        setCollaboratorsList(JSON.stringify(collabsResponse));
    }

    return collaboratorsList && <div>{collaboratorsList}</div>;
}

const STRINGIFIED_MOCK_RESPONSE = JSON.stringify(MOCK_COLLABS_CONVERTED_RESPONSE);

describe('elements/content-sharing/hooks/useCollaborators', () => {
    let getCollaborations;
    let mockAPI;

    describe('with successful API calls', () => {
        beforeAll(() => {
            getCollaborations = jest.fn().mockImplementation((itemID, getCollabsSuccess) => {
                getCollabsSuccess(MOCK_COLLABS_CONVERTED_RESPONSE);
            });
            mockAPI = {
                getFileCollaborationsAPI: jest.fn().mockReturnValue({
                    getCollaborations,
                }),
                getFolderCollaborationsAPI: jest.fn().mockReturnValue({
                    getCollaborations,
                }),
            };
        });

        test.each([TYPE_FILE, TYPE_FOLDER])('should return collaborators for %s', itemType => {
            let fakeComponent;

            act(() => {
                fakeComponent = mount(<FakeComponent api={mockAPI} itemType={itemType} />);
            });
            fakeComponent.update();
            expect(getCollaborations).toHaveBeenCalledWith(MOCK_ITEM_ID, expect.anything(), expect.anything());
            expect(handleSuccess).toHaveBeenCalled();
            expect(fakeComponent.find('div').text()).toBe(STRINGIFIED_MOCK_RESPONSE);
        });
    });

    describe('with failed API calls', () => {
        beforeAll(() => {
            getCollaborations = jest.fn().mockImplementation((itemID, getCollabsSuccess, getCollabsError) => {
                getCollabsError();
            });
            mockAPI = {
                getFileCollaborationsAPI: jest.fn().mockReturnValue({
                    getCollaborations,
                }),
                getFolderCollaborationsAPI: jest.fn().mockReturnValue({
                    getCollaborations,
                }),
            };
        });

        test.each([TYPE_FILE, TYPE_FOLDER])('should return collaborators for %s', itemType => {
            let fakeComponent;

            act(() => {
                fakeComponent = mount(<FakeComponent api={mockAPI} itemType={itemType} />);
            });
            fakeComponent.update();
            expect(getCollaborations).toHaveBeenCalledWith(MOCK_ITEM_ID, expect.anything(), expect.anything());
            expect(handleError).toHaveBeenCalled();
            expect(fakeComponent.find('div').text()).toBe(JSON.stringify({ entries: [], next_marker: null }));
        });
    });
});
