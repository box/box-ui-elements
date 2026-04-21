import { STATUS_ACCEPTED, STATUS_PENDING, STATUS_REJECTED } from '../../../../constants';
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
            status: STATUS_PENDING,
            expires_at: '2024-12-31T23:59:59Z',
            accessible_by: collabUser3,
            created_by: ownerFromApi,
        },
        {
            id: '126',
            role: 'editor',
            status: STATUS_PENDING,
            expires_at: '2024-12-31T23:59:59Z',
            created_by: ownerFromApi,
            invite_email: 'bbear@external.example.com',
        },
        {
            id: '127',
            role: 'editor',
            status: STATUS_REJECTED,
            expires_at: '2024-12-31T23:59:59Z',
            created_by: ownerFromApi,
            invite_email: 'rrobot@external.example.com',
        },
    ],
};

const mockCollaborations = [itemOwner, ...mockCollaborationsFromApi.entries];

describe('convertCollaborators', () => {
    describe('convertCollab', () => {
        test('should convert a valid collaboration to Collaborator format', () => {
            const result = convertCollab({
                avatarUrlMap: mockAvatarUrlMap,
                collab: mockCollaborations[1],
                currentUserId: mockOwnerId,
                isCurrentUserOwner: false,
                ownerEmailDomain,
            });

            expect(result).toEqual({
                avatarUrl: 'https://example.com/avatar.jpg',
                email: 'dparrot@example.com',
                expiresAt: '2024-12-31T23:59:59Z',
                hasCustomAvatar: true,
                id: '123',
                isCurrentUser: false,
                isExternal: false,
                isPending: false,
                name: 'Detective Parrot',
                role: 'editor',
                userId: '456',
            });
        });

        test('should convert pending collaboration with invite_email to a pending collaborator', () => {
            const pendingInviteCollab = mockCollaborations[4];

            const result = convertCollab({
                avatarUrlMap: mockAvatarUrlMap,
                collab: pendingInviteCollab,
                currentUserId: mockOwnerId,
                isCurrentUserOwner: false,
                ownerEmailDomain,
            });

            expect(result).toEqual({
                email: 'bbear@external.example.com',
                expiresAt: '2024-12-31T23:59:59Z',
                hasCustomAvatar: false,
                id: '126',
                isCurrentUser: false,
                isExternal: true,
                isPending: true,
                name: 'bbear@external.example.com',
                role: 'editor',
            });
        });

        test.each([undefined, null])('should return null for %s collaboration', collab => {
            const result = convertCollab({
                avatarUrlMap: mockAvatarUrlMap,
                collab,
                currentUserId: mockOwnerId,
                isCurrentUserOwner: false,
                ownerEmailDomain,
            });

            expect(result).toBeNull();
        });

        test('should return null for pending collab without invite_email', () => {
            const result = convertCollab({
                avatarUrlMap: mockAvatarUrlMap,
                collab: mockCollaborations[3],
                currentUserId: mockOwnerId,
                isCurrentUserOwner: false,
                ownerEmailDomain,
            });

            expect(result).toBeNull();
        });

        test('should return null for rejected collab', () => {
            const result = convertCollab({
                avatarUrlMap: mockAvatarUrlMap,
                collab: mockCollaborations[5],
                currentUserId: mockOwnerId,
                isCurrentUserOwner: false,
                ownerEmailDomain,
            });

            expect(result).toBeNull();
        });

        test('should identify current user correctly', () => {
            const result = convertCollab({
                avatarUrlMap: mockAvatarUrlMap,
                collab: mockCollaborations[0],
                currentUserId: mockOwnerId,
                isCurrentUserOwner: true,
                ownerEmailDomain,
            });

            expect(result).toEqual({
                avatarUrl: undefined,
                email: 'aotter@example.com',
                hasCustomAvatar: false,
                id: 'aotter@example.com',
                isCurrentUser: true,
                isExternal: false,
                isPending: false,
                name: 'Astronaut Otter',
                role: 'owner',
                userId: '789',
            });
        });

        test('should identify external user correctly', () => {
            const result = convertCollab({
                avatarUrlMap: mockAvatarUrlMap,
                collab: mockCollaborations[2],
                currentUserId: mockOwnerId,
                isCurrentUserOwner: false,
                ownerEmailDomain,
            });

            expect(result.isExternal).toBe(true);
        });

        test.each([null, undefined, {}, { 999: 'https://example.com/different-user-avatar.jpg' }])(
            'should handle %s avatar URL map',
            avatarUrlMap => {
                const result = convertCollab({
                    avatarUrlMap,
                    collab: mockCollaborations[1],
                    currentUserId: mockOwnerId,
                    isCurrentUserOwner: false,
                    ownerEmailDomain,
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
                avatarUrlMap: mockAvatarUrlMap,
                collab: collabWithoutExpiration,
                currentUserId: mockOwnerId,
                isCurrentUserOwner: false,
                ownerEmailDomain,
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

            expect(result).toHaveLength(4); // Owner + accepted & pending collaborators
            expect(result).toEqual([
                {
                    avatarUrl: undefined,
                    email: 'aotter@example.com',
                    expiresAt: undefined,
                    hasCustomAvatar: false,
                    id: 'aotter@example.com',
                    isCurrentUser: true,
                    isExternal: false,
                    isPending: false,
                    name: 'Astronaut Otter',
                    role: 'owner',
                    userId: '789',
                },
                {
                    avatarUrl: 'https://example.com/avatar.jpg',
                    email: 'dparrot@example.com',
                    expiresAt: '2024-12-31T23:59:59Z',
                    hasCustomAvatar: true,
                    id: '123',
                    isCurrentUser: false,
                    isExternal: false,
                    isPending: false,
                    name: 'Detective Parrot',
                    role: 'editor',
                    userId: '456',
                },
                {
                    avatarUrl: undefined, // does not exist in the avatar URL map
                    email: 'rqueen@external.example.com',
                    expiresAt: null,
                    hasCustomAvatar: false,
                    id: '124',
                    isCurrentUser: false,
                    isExternal: false,
                    isPending: false,
                    name: 'Raccoon Queen',
                    role: 'viewer',
                    userId: '457',
                },
                {
                    email: 'bbear@external.example.com',
                    expiresAt: '2024-12-31T23:59:59Z',
                    hasCustomAvatar: false,
                    id: '126',
                    isCurrentUser: false,
                    isExternal: false,
                    isPending: true,
                    name: 'bbear@external.example.com',
                    role: 'editor',
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

        test('should convert collab request with users without a type', () => {
            const mockCollabRequest = {
                role: 'editor',
                contacts: [
                    {
                        id: 'user1',
                        email: 'user1@test.com',
                        type: 'user',
                    },
                    {
                        id: 'user2',
                        email: 'external@test.com',
                    },
                ],
            };

            const result = convertCollabsRequest(mockCollabRequest, null);

            expect(result).toEqual({
                groups: [],
                users: [
                    {
                        accessible_by: {
                            login: 'user1@test.com',
                            type: 'user',
                        },
                        role: 'editor',
                    },
                    {
                        accessible_by: {
                            login: 'external@test.com',
                            type: 'user',
                        },
                        role: 'editor',
                    },
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
