import { renderHook } from '@testing-library/react';

import {
    convertGroupContactsResponse,
    convertUserContactByEmailResponse,
    convertUserContactsResponse,
} from '../../utils';
import { useContactService } from '../useContactService';
import useContacts from '../useContacts';
import useContactsByEmail from '../useContactsByEmail';

jest.mock('../useContacts');
jest.mock('../useContactsByEmail');
jest.mock('../../utils');

const mockApi = {
    getMarkerBasedUsersAPI: jest.fn(),
    getMarkerBasedGroupsAPI: jest.fn(),
};
const mockItemId = '123456789';
const mockCurrentUserId = '123';
const mockGetContacts = jest.fn();
const mockGetContactByEmail = jest.fn();

describe('elements/content-sharing/hooks/useContactService', () => {
    beforeEach(() => {
        (useContacts as jest.Mock).mockReturnValue(mockGetContacts);
        (useContactsByEmail as jest.Mock).mockReturnValue(mockGetContactByEmail);
        (convertGroupContactsResponse as jest.Mock).mockReturnValue([]);
        (convertUserContactsResponse as jest.Mock).mockReturnValue([]);
        (convertUserContactByEmailResponse as jest.Mock).mockReturnValue([]);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return contactService with getContactByEmail and getContacts functions', () => {
        const { result } = renderHook(() => useContactService(mockApi, mockItemId, mockCurrentUserId));

        expect(useContacts).toHaveBeenCalledWith(mockApi, mockItemId, {
            currentUserId: mockCurrentUserId,
            isContentSharingV2Enabled: true,
            transformUsers: expect.any(Function),
            transformGroups: expect.any(Function),
        });
        expect(useContactsByEmail).toHaveBeenCalledWith(mockApi, mockItemId, {
            isContentSharingV2Enabled: true,
            transformUsers: expect.any(Function),
        });
        expect(result.current.contactService).toEqual({
            getContactByEmail: mockGetContactByEmail,
            getContacts: mockGetContacts,
        });
    });

    test('should pass transform functions that call correct conversion functions with params', () => {
        const mockTransformedUsers = [{ id: 'user1', email: 'user1@test.com' }];
        const mockTransformedGroups = [{ id: 'group1', name: 'Test Group' }];
        const mockTransformedContactByEmail = [{ id: 'user2', email: 'user2@test.com' }];
        const mockUserData = { entries: mockTransformedUsers };
        const mockGroupData = { entries: mockTransformedGroups };
        const mockContactByEmailData = { entries: mockTransformedContactByEmail };

        (convertUserContactsResponse as jest.Mock).mockReturnValue(mockTransformedUsers);
        (convertGroupContactsResponse as jest.Mock).mockReturnValue(mockTransformedGroups);
        (convertUserContactByEmailResponse as jest.Mock).mockReturnValue(mockTransformedContactByEmail);

        renderHook(() => useContactService(mockApi, mockItemId, mockCurrentUserId));

        // Get the transform functions that were passed to useContacts
        const transformUsersFn = useContacts.mock.calls[0][2].transformUsers;
        const transformGroupsFn = useContacts.mock.calls[0][2].transformGroups;
        const resultUsers = transformUsersFn(mockUserData);
        const resultGroups = transformGroupsFn(mockGroupData);

        expect(convertUserContactsResponse as jest.Mock).toHaveBeenCalledWith(mockUserData, mockCurrentUserId);
        expect(convertGroupContactsResponse as jest.Mock).toHaveBeenCalledWith(mockGroupData);
        expect(resultUsers).toBe(mockTransformedUsers);
        expect(resultGroups).toBe(mockTransformedGroups);

        // Get the transform function that was passed to useContactsByEmail
        const transformContactByEmailFn = useContactsByEmail.mock.calls[0][2].transformUsers;
        const resultContactByEmail = transformContactByEmailFn(mockContactByEmailData);
        expect(convertUserContactByEmailResponse as jest.Mock).toHaveBeenCalledWith(mockContactByEmailData);
        expect(resultContactByEmail).toBe(mockTransformedContactByEmail);
    });
});
