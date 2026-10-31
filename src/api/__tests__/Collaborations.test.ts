import Collaborations from '../Collaborations';
import type { APIOptions } from '../../common/types/api';
import type { BoxItem, Collaboration } from '../../common/types/core';

const MOCK_URL = 'https://api.box.com/2.0/collaborations';

let collaborations: Collaborations;

describe('api/Collaborations', () => {
    beforeEach(() => {
        collaborations = new Collaborations({} as APIOptions);
    });

    describe('getUrl()', () => {
        test('should return the correct collaborations API URL', () => {
            expect(collaborations.getUrl()).toBe(MOCK_URL);
        });
    });

    describe('addCollaboration()', () => {
        test('should call post() with the provided item and collaboration', () => {
            const MOCK_ITEM_ID = '542809';
            const MOCK_ITEM: BoxItem = {
                id: MOCK_ITEM_ID,
                type: 'folder',
            };
            const MOCK_COLLABORATION = {
                accessible_by: {
                    login: 'turtle@box.com',
                    type: 'user',
                },
                role: 'editor',
            } as Partial<Collaboration>;

            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            const postSpy = jest.spyOn(collaborations, 'post');
            jest.spyOn(collaborations, 'getUrl').mockReturnValue(MOCK_URL);

            collaborations.addCollaboration(MOCK_ITEM, MOCK_COLLABORATION, successCallback, errorCallback);
            expect(postSpy).toHaveBeenCalledWith({
                id: MOCK_ITEM_ID,
                data: {
                    data: {
                        item: MOCK_ITEM,
                        accessible_by: {
                            login: 'turtle@box.com',
                            type: 'user',
                        },
                        role: 'editor',
                    },
                },
                errorCallback,
                successCallback,
                url: MOCK_URL,
            });
        });
    });
});
