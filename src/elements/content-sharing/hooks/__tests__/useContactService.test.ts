import { renderHook } from '@testing-library/react';

import { convertGroupContactsResponse, convertUserContactsResponse } from '../../utils';
import { useContactService } from '../useContactService';
import useContacts from '../useContacts';

jest.mock('../useContacts');
jest.mock('../../utils');

describe('elements/content-sharing/hooks/useContactService', () => {
    const mockApi = {
        getMarkerBasedUsersAPI: jest.fn(),
        getMarkerBasedGroupsAPI: jest.fn(),
    };
    const mockItemID = '123456789';
    const mockCurrentUserID = '123';
    const mockGetContacts = jest.fn();

    beforeEach(() => {
        (useContacts as jest.Mock).mockReturnValue(mockGetContacts);
        (convertGroupContactsResponse as jest.Mock).mockReturnValue([]);
        (convertUserContactsResponse as jest.Mock).mockReturnValue([]);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return null contactService when currentUserID is null or undefined', () => {
        [null, undefined].forEach(currentUserID => {
            const { result } = renderHook(() => useContactService(mockApi, mockItemID, currentUserID));

            expect(result.current.contactService).toBeNull();
        });
    });

    test('should return contactService with getContacts function', () => {
        const { result } = renderHook(() => useContactService(mockApi, mockItemID, mockCurrentUserID));

        expect(useContacts).toHaveBeenCalledWith(mockApi, mockItemID, {
            transformUsers: expect.any(Function),
            transformGroups: expect.any(Function),
        });
        expect(result.current.contactService).toEqual({
            getContacts: mockGetContacts,
        });
    });

    test('should pass transform functions that call correct conversion functions with params', () => {
        const mockTransformedUsers = [{ id: 'user1', email: 'user1@test.com' }];
        const mockTransformedGroups = [{ id: 'group1', name: 'Test Group' }];
        const mockUserData = { entries: mockTransformedUsers };
        const mockGroupData = { entries: mockTransformedGroups };

        (convertUserContactsResponse as jest.Mock).mockReturnValue(mockTransformedUsers);
        (convertGroupContactsResponse as jest.Mock).mockReturnValue(mockTransformedGroups);

        renderHook(() => useContactService(mockApi, mockItemID, mockCurrentUserID));

        // Get the transform functions that were passed to useContacts
        const transformUsersFn = useContacts.mock.calls[0][2].transformUsers;
        const transformGroupsFn = useContacts.mock.calls[0][2].transformGroups;
        const resultUsers = transformUsersFn(mockUserData);
        const resultGroups = transformGroupsFn(mockGroupData);

        expect(convertUserContactsResponse as jest.Mock).toHaveBeenCalledWith(mockUserData, mockCurrentUserID);
        expect(convertGroupContactsResponse as jest.Mock).toHaveBeenCalledWith(mockGroupData);
        expect(resultUsers).toBe(mockTransformedUsers);
        expect(resultGroups).toBe(mockTransformedGroups);
    });
});
