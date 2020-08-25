// @flow

import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import useAvatars from '../hooks/useAvatars';
import {
    MOCK_AVATAR_URL_MAP,
    MOCK_AVATAR_URL_MAP_FOR_INCOMPLETE_ENTRIES,
    MOCK_COLLABS_API_RESPONSE,
    MOCK_COLLABS_API_RESPONSE_WITH_INCOMPLETE_ENTRIES,
    MOCK_ITEM_ID,
    MOCK_USER_IDS,
} from '../../../features/unified-share-modal/utils/__mocks__/USMMocks';
import { Collaborations } from '../../../common/types/core';

const getAvatarUrlWithAccessToken = jest.fn(
    userID => `https://api.box.com/2.0/users/${userID}/avatar?access_token=foo&pic_type=large`,
);
const mockAPI = {
    getUsersAPI: jest.fn().mockReturnValue({
        getAvatarUrlWithAccessToken,
    }),
};

function FakeComponent({ collaboratorsList }: { collaboratorsList: Collaborations }) {
    const [avatarURLMap, setAvatarURLMap] = React.useState(null);

    const retrievedAvatarURLMap = useAvatars(mockAPI, MOCK_ITEM_ID, collaboratorsList);

    if (retrievedAvatarURLMap && !avatarURLMap) {
        setAvatarURLMap(JSON.stringify(retrievedAvatarURLMap));
    }

    return avatarURLMap && <div>{avatarURLMap}</div>;
}

describe('elements/content-sharing/hooks/useCollaborators', () => {
    test.each`
        collaboratorsList                                    | avatarURLMap                                                  | description
        ${MOCK_COLLABS_API_RESPONSE_WITH_INCOMPLETE_ENTRIES} | ${JSON.stringify(MOCK_AVATAR_URL_MAP_FOR_INCOMPLETE_ENTRIES)} | ${'contains some incomplete entries'}
        ${MOCK_COLLABS_API_RESPONSE}                         | ${JSON.stringify(MOCK_AVATAR_URL_MAP)}                        | ${'contains complete entries only'}
    `(
        'should return the expected avatar URL map when collaborators list $description',
        async ({ collaboratorsList, avatarURLMap }) => {
            let fakeComponent;

            await act(async () => {
                fakeComponent = mount(<FakeComponent collaboratorsList={collaboratorsList} />);
            });
            fakeComponent.update();

            expect(getAvatarUrlWithAccessToken).toHaveBeenCalled();
            expect(fakeComponent.find('div').text()).toBe(avatarURLMap);
        },
    );

    test('should call getAvatarUrlWithAccessToken() with each user ID', async () => {
        let fakeComponent;

        await act(async () => {
            fakeComponent = mount(<FakeComponent collaboratorsList={MOCK_COLLABS_API_RESPONSE} />);
        });
        fakeComponent.update();

        MOCK_USER_IDS.forEach(userID => expect(getAvatarUrlWithAccessToken).toHaveBeenCalledWith(userID, MOCK_ITEM_ID));
    });

    test.each`
        collaboratorsList | description
        ${null}           | ${'is null'}
        ${undefined}      | ${'is undefined'}
        ${{}}             | ${'is an empty object'}
        ${{ foo: 'bar' }} | ${'does not have entries'}
    `('should not generate avatar URLs when collaborators list $description', ({ collaboratorsList }) => {
        let fakeComponent;

        act(() => {
            fakeComponent = mount(<FakeComponent collaboratorsList={collaboratorsList} />);
        });
        fakeComponent.update();

        expect(getAvatarUrlWithAccessToken).not.toHaveBeenCalled();
    });

    test.each`
        collaboratorsList                     | description
        ${{ entries: [] }}                    | ${'has an empty entries array'}
        ${{ entries: [null, undefined, ''] }} | ${'contains incomplete entries only'}
    `('should return an empty object when collaborators list $description', async ({ collaboratorsList }) => {
        let fakeComponent;

        await act(async () => {
            fakeComponent = mount(<FakeComponent collaboratorsList={collaboratorsList} />);
        });
        fakeComponent.update();

        expect(getAvatarUrlWithAccessToken).not.toHaveBeenCalled();
        expect(fakeComponent.find('div').text()).toBe('{}');
    });
});
