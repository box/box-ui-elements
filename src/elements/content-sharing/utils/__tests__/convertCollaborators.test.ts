import { STATUS_ACCEPTED } from '../../../../constants';
import { convertCollab, convertCollabsResponse } from '../convertCollaborators';
import {
    collabUser1,
    collabUser2,
    collabUser3,
    mockAvatarURLMap,
    mockOwnerId,
    mockOwnerEmail,
    mockOwnerName,
} from '../__mocks__/ContentSharingV2Mocks';

import type { Collaborations } from '../../../../common/types/core';

const ownerEmailDomain = 'example.com';
const ownerFromAPI = {
    id: mockOwnerId,
    email: mockOwnerEmail,
    name: mockOwnerName,
};
const itemOwner = {
    id: mockOwnerEmail,
    status: STATUS_ACCEPTED,
    role: 'owner',
    accessible_by: {
        id: mockOwnerId,
        login: mockOwnerEmail,
        name: mockOwnerName,
    },
};

const mockCollaborationsFromAPI: Collaborations = {
    entries: [
        {
            id: '123',
            role: 'editor',
            status: STATUS_ACCEPTED,
            expires_at: '2024-12-31T23:59:59Z',
            accessible_by: collabUser1,
            created_by: ownerFromAPI,
        },
        {
            id: '124',
            role: 'viewer',
            status: STATUS_ACCEPTED,
            expires_at: null,
            accessible_by: collabUser2,
            created_by: ownerFromAPI,
        },
        {
            id: '125',
            role: 'editor',
            status: 'pending',
            expires_at: '2024-12-31T23:59:59Z',
            accessible_by: collabUser3,
            created_by: ownerFromAPI,
        },
    ],
};

const mockCollaborations = [itemOwner, ...mockCollaborationsFromAPI.entries];

describe('convertCollaborators', () => {
    describe('convertCollab', () => {
        test('should convert a valid collaboration to Collaborator format', () => {
            const result = convertCollab({
                collab: mockCollaborations[1],
                currentUserId: mockOwnerId,
                isCurrentUserOwner: false,
                ownerEmailDomain,
                avatarURLMap: mockAvatarURLMap,
            });

            expect(result).toEqual({
                avatarUrl: 'https://example.com/avatar.jpg',
                email: 'dparrot@example.com',
                expiresAt: '2024-12-31T23:59:59Z',
                hasCustomAvatar: true,
                hasCustomRole: true,
                id: '123',
                isCurrentUser: false,
                isExternal: false,
                isPending: false,
                name: 'Detective Parrot',
                role: 'Editor',
                userId: '456',
            });
        });

        test('should return null for collaboration with non-accepted status', () => {
            const result = convertCollab({
                collab: mockCollaborations[3],
                currentUserId: mockOwnerId,
                isCurrentUserOwner: false,
                ownerEmailDomain,
                avatarURLMap: mockAvatarURLMap,
            });

            expect(result).toBeNull();
        });

        test.each([undefined, null])('should return null for %s collaboration', collab => {
            const result = convertCollab({
                collab,
                currentUserId: mockOwnerId,
                isCurrentUserOwner: false,
                ownerEmailDomain,
                avatarURLMap: mockAvatarURLMap,
            });

            expect(result).toBeNull();
        });

        test('should identify current user correctly', () => {
            const result = convertCollab({
                collab: mockCollaborations[0],
                currentUserId: mockOwnerId,
                isCurrentUserOwner: true,
                ownerEmailDomain,
                avatarURLMap: mockAvatarURLMap,
            });

            expect(result).toEqual({
                avatarUrl: undefined,
                email: 'aotter@example.com',
                hasCustomAvatar: false,
                hasCustomRole: true,
                id: 'aotter@example.com',
                isCurrentUser: true,
                isExternal: false,
                isPending: false,
                name: 'Astronaut Otter',
                role: 'Owner',
                userId: '789',
            });
        });

        test('should identify external user correctly', () => {
            const result = convertCollab({
                collab: mockCollaborations[2],
                currentUserId: mockOwnerId,
                isCurrentUserOwner: false,
                ownerEmailDomain,
                avatarURLMap: mockAvatarURLMap,
            });

            expect(result.isExternal).toBe(true);
        });

        test.each([null, undefined, {}, { 999: 'https://example.com/different-user-avatar.jpg' }])(
            'should handle %s avatar URL map',
            avatarURLMap => {
                const result = convertCollab({
                    collab: mockCollaborations[1],
                    currentUserId: mockOwnerId,
                    isCurrentUserOwner: false,
                    ownerEmailDomain,
                    avatarURLMap,
                });

                expect(result.avatarUrl).toBeUndefined();
                expect(result.hasCustomAvatar).toBe(false);
            },
        );

        test('should handle missing expiration date', () => {
            const collabWithoutExpiration = {
                ...mockCollaborations[1],
                expires_at: null,
            };

            const result = convertCollab({
                collab: collabWithoutExpiration,
                currentUserId: mockOwnerId,
                isCurrentUserOwner: false,
                ownerEmailDomain,
                avatarURLMap: mockAvatarURLMap,
            });

            expect(result.expiresAt).toBeNull();
        });
    });

    describe('convertCollabsResponse', () => {
        test('should convert valid collaborations data to Collaborator array', () => {
            const result = convertCollabsResponse(
                mockCollaborationsFromAPI,
                mockOwnerId,
                ownerFromAPI,
                mockAvatarURLMap,
            );

            expect(result).toHaveLength(3); // Only accepted collaborations
            expect(result).toEqual([
                {
                    avatarUrl: undefined,
                    email: 'aotter@example.com',
                    expiresAt: undefined,
                    hasCustomAvatar: false,
                    hasCustomRole: true,
                    id: 'aotter@example.com',
                    isCurrentUser: true,
                    isExternal: false,
                    isPending: false,
                    name: 'Astronaut Otter',
                    role: 'Owner',
                    userId: '789',
                },
                {
                    avatarUrl: 'https://example.com/avatar.jpg',
                    email: 'dparrot@example.com',
                    expiresAt: '2024-12-31T23:59:59Z',
                    hasCustomAvatar: true,
                    hasCustomRole: true,
                    id: '123',
                    isCurrentUser: false,
                    isExternal: false,
                    isPending: false,
                    name: 'Detective Parrot',
                    role: 'Editor',
                    userId: '456',
                },
                {
                    avatarUrl: undefined, // does not exist in the avatar URL map
                    email: 'rqueen@external.example.com',
                    expiresAt: null,
                    hasCustomAvatar: false,
                    hasCustomRole: true,
                    id: '124',
                    isCurrentUser: false,
                    isExternal: false,
                    isPending: false,
                    name: 'Raccoon Queen',
                    role: 'Viewer',
                    userId: '457',
                },
            ]);
        });

        test('should return empty array for empty entries', () => {
            const emptyCollaborations: Collaborations = { entries: [] };
            const result = convertCollabsResponse(emptyCollaborations, mockOwnerId, ownerFromAPI, mockAvatarURLMap);

            expect(result).toEqual([]);
        });

        test('should handle null avatar URL map', () => {
            const collabs = convertCollabsResponse(mockCollaborationsFromAPI, mockOwnerId, ownerFromAPI, null);

            collabs.map(collab => {
                expect(collab.avatarUrl).toBeUndefined();
                expect(collab.hasCustomAvatar).toBeFalsy();
                return collab.avatarUrl;
            });
        });
    });
});
