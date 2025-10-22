import { STATUS_ACCEPTED } from '../../../../constants';
import { convertCollab, convertCollabsResponse, convertCollabsRequest } from '../convertCollaborators';
import {
    collabUser1,
    collabUser2,
    collabUser3,
    mockAvatarUrlMap,
    mockOwnerId,
    mockOwnerEmail,
    mockOwnerName,
} from '../__mocks__/ContentSharingV2Mocks';

import type { Collaborations } from '../../../../common/types/core';

const ownerEmailDomain = 'example.com';
const ownerFromApi = {
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

const mockCollaborationsFromApi: Collaborations = {
    entries: [
        {
            id: '123',
            role: 'editor',
            status: STATUS_ACCEPTED,
            expires_at: '2024-12-31T23:59:59Z',
            accessible_by: collabUser1,
            created_by: ownerFromApi,
        },
        {
            id: '124',
            role: 'viewer',
            status: STATUS_ACCEPTED,
            expires_at: null,
            accessible_by: collabUser2,
            created_by: ownerFromApi,
        },
        {
            id: '125',
            role: 'editor',
            status: 'pending',
            expires_at: '2024-12-31T23:59:59Z',
            accessible_by: collabUser3,
            created_by: ownerFromApi,
        },
    ],
};

const mockCollaborations = [itemOwner, ...mockCollaborationsFromApi.entries];

describe('convertCollaborators', () => {
    describe('convertCollab', () => {
        test('should convert a valid collaboration to Collaborator format', () => {
            const result = convertCollab({
                collab: mockCollaborations[1],
                currentUserId: mockOwnerId,
                isCurrentUserOwner: false,
                ownerEmailDomain,
                avatarUrlMap: mockAvatarUrlMap,
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
                avatarUrlMap: mockAvatarUrlMap,
            });

            expect(result).toBeNull();
        });

        test.each([undefined, null])('should return null for %s collaboration', collab => {
            const result = convertCollab({
                collab,
                currentUserId: mockOwnerId,
                isCurrentUserOwner: false,
                ownerEmailDomain,
                avatarUrlMap: mockAvatarUrlMap,
            });

            expect(result).toBeNull();
        });

        test('should identify current user correctly', () => {
            const result = convertCollab({
                collab: mockCollaborations[0],
                currentUserId: mockOwnerId,
                isCurrentUserOwner: true,
                ownerEmailDomain,
                avatarUrlMap: mockAvatarUrlMap,
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
                avatarUrlMap: mockAvatarUrlMap,
            });

            expect(result.isExternal).toBe(true);
        });

        test.each([null, undefined, {}, { 999: 'https://example.com/different-user-avatar.jpg' }])(
            'should handle %s avatar URL map',
            avatarUrlMap => {
                const result = convertCollab({
                    collab: mockCollaborations[1],
                    currentUserId: mockOwnerId,
                    isCurrentUserOwner: false,
                    ownerEmailDomain,
                    avatarUrlMap,
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
                avatarUrlMap: mockAvatarUrlMap,
            });

            expect(result.expiresAt).toBeNull();
        });
    });

    describe('convertCollabsResponse', () => {
        test('should convert valid collaborations data to Collaborator array', () => {
            const result = convertCollabsResponse(
                mockCollaborationsFromApi,
                mockOwnerId,
                ownerFromApi,
                mockAvatarUrlMap,
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
            const result = convertCollabsResponse(emptyCollaborations, mockOwnerId, ownerFromApi, mockAvatarUrlMap);

            expect(result).toEqual([]);
        });

        test('should handle null avatar URL map', () => {
            const collabs = convertCollabsResponse(mockCollaborationsFromApi, mockOwnerId, ownerFromApi, null);

            collabs.map(collab => {
                expect(collab.avatarUrl).toBeUndefined();
                expect(collab.hasCustomAvatar).toBeFalsy();
                return collab.avatarUrl;
            });
        });
    });

    describe('convertCollabsRequest', () => {
        test('should convert collab request with users and groups correctly', () => {
            const mockCollabRequest = {
                role: 'editor',
                contacts: [
                    {
                        id: 'user1',
                        email: 'user1@test.com',
                        type: 'user',
                    },
                    {
                        id: 'group1',
                        email: 'Group',
                        type: 'group',
                    },
                    {
                        id: 'user2',
                        email: 'existing@test.com',
                        type: 'user',
                    },
                ],
            };

            const mockExistingCollaboratorsList = [{ userId: 'user2' }, { userId: 'group2' }];

            const result = convertCollabsRequest(mockCollabRequest, mockExistingCollaboratorsList);

            expect(result).toEqual({
                groups: [
                    {
                        accessible_by: {
                            id: 'group1',
                            type: 'group',
                        },
                        role: 'editor',
                    },
                ],
                users: [
                    {
                        accessible_by: {
                            login: 'user1@test.com',
                            type: 'user',
                        },
                        role: 'editor',
                    },
                    // The existing collaborator is filtered out
                ],
            });
        });

        test('should handle empty contacts array', () => {
            const emptyCollabRequest = {
                role: 'editor',
                contacts: [],
            };

            const result = convertCollabsRequest(emptyCollabRequest, null);
            expect(result).toEqual({
                groups: [],
                users: [],
            });
        });
    });
});
