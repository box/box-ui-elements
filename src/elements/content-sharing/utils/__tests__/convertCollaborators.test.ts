import { STATUS_ACCEPTED } from '../../../../constants';
import { convertCollab, convertCollabsResponse } from '../convertCollaborators';
import {
    collabUser1,
    collabUser2,
    collabUser3,
    mockAvatarURLMap,
    mockCurrentUserID,
    mockOwnerEmail,
} from '../__mocks__/ContentSharingV2Mocks';

import type { Collaboration, Collaborations } from '../../../../common/types/core';

describe('convertCollaborators', () => {
    describe('convertCollab', () => {
        const mockCollab: Collaboration = {
            id: '123', // collab record id
            role: 'editor',
            status: STATUS_ACCEPTED,
            expires_at: '2024-12-31T23:59:59Z',
            accessible_by: collabUser1,
        };

        test('should convert a valid collaboration to Collaborator format', () => {
            const result = convertCollab({
                collab: mockCollab,
                avatarURLMap: mockAvatarURLMap,
                ownerEmail: mockOwnerEmail,
                currentUserID: mockCurrentUserID,
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
            const pendingCollab = {
                ...mockCollab,
                status: 'pending',
            };

            const result = convertCollab({
                collab: pendingCollab,
                avatarURLMap: mockAvatarURLMap,
                ownerEmail: mockOwnerEmail,
                currentUserID: mockCurrentUserID,
            });

            expect(result).toBeNull();
        });

        test.each([undefined, null])('should return null for %s collaboration', collab => {
            const result = convertCollab({
                collab,
                avatarURLMap: mockAvatarURLMap,
                ownerEmail: mockOwnerEmail,
                currentUserID: mockCurrentUserID,
            });

            expect(result).toBeNull();
        });

        test('should identify current user correctly', () => {
            const currentUserCollab = {
                ...mockCollab,
                role: 'owner',
                accessible_by: {
                    ...mockCollab.accessible_by,
                    id: mockCurrentUserID,
                    login: mockOwnerEmail,
                    name: 'Astronaut Otter',
                },
            };

            const result = convertCollab({
                collab: currentUserCollab,
                avatarURLMap: mockAvatarURLMap,
                ownerEmail: mockOwnerEmail,
                currentUserID: mockCurrentUserID,
            });

            expect(result).toEqual({
                avatarUrl: undefined,
                email: 'aotter@example.com',
                expiresAt: '2024-12-31T23:59:59Z',
                hasCustomAvatar: false,
                hasCustomRole: true,
                id: '123',
                isCurrentUser: true,
                isExternal: false,
                isPending: false,
                name: 'Astronaut Otter',
                role: 'Owner',
                userId: '789',
            });
        });

        test('should identify external user correctly', () => {
            const externalCollab = {
                ...mockCollab,
                accessible_by: {
                    ...mockCollab.accessible_by,
                    login: 'external@differentdomain.com',
                },
            };

            const result = convertCollab({
                collab: externalCollab,
                avatarURLMap: mockAvatarURLMap,
                ownerEmail: mockOwnerEmail,
                currentUserID: mockCurrentUserID,
            });

            expect(result.isExternal).toBe(true);
        });

        test.each([null, undefined, {}, { 999: 'https://example.com/different-user-avatar.jpg' }])(
            'should handle %s avatar URL map',
            avatarURLMap => {
                const result = convertCollab({
                    collab: mockCollab,
                    avatarURLMap,
                    ownerEmail: mockOwnerEmail,
                    currentUserID: mockCurrentUserID,
                });

                expect(result.avatarUrl).toBeUndefined();
                expect(result.hasCustomAvatar).toBe(false);
            },
        );

        test('should handle missing expiration date', () => {
            const collabWithoutExpiration = {
                ...mockCollab,
                expires_at: null,
            };

            const result = convertCollab({
                collab: collabWithoutExpiration,
                avatarURLMap: mockAvatarURLMap,
                ownerEmail: mockOwnerEmail,
                currentUserID: mockCurrentUserID,
            });

            expect(result.expiresAt).toBeNull();
        });
    });

    describe('convertCollabsResponse', () => {
        const created_by = {
            id: mockCurrentUserID,
            login: mockOwnerEmail,
        };
        const mockCollaborations: Collaborations = {
            entries: [
                {
                    id: '123',
                    role: 'editor',
                    status: STATUS_ACCEPTED,
                    expires_at: '2024-12-31T23:59:59Z',
                    accessible_by: collabUser1,
                    created_by,
                },
                {
                    id: '124',
                    role: 'viewer',
                    status: STATUS_ACCEPTED,
                    expires_at: null,
                    accessible_by: collabUser2,
                    created_by,
                },
                {
                    id: '125',
                    role: 'editor',
                    status: 'pending',
                    expires_at: '2024-12-31T23:59:59Z',
                    accessible_by: collabUser3,
                    created_by,
                },
            ],
        };

        test('should convert valid collaborations data to Collaborator array', () => {
            const result = convertCollabsResponse(mockCollaborations, mockAvatarURLMap);

            expect(result).toHaveLength(2); // Only accepted collaborations
            expect(result).toEqual([
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
                    email: 'rqueen@example.com',
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
            const result = convertCollabsResponse(emptyCollaborations, mockAvatarURLMap);

            expect(result).toEqual([]);
        });

        test('should handle null avatar URL map', () => {
            const result = convertCollabsResponse(mockCollaborations, null);

            expect(result).toHaveLength(2);
            expect(result[0].avatarUrl).toBeUndefined();
            expect(result[0].hasCustomAvatar).toBe(false);
            expect(result[1].avatarUrl).toBeUndefined();
            expect(result[1].hasCustomAvatar).toBe(false);
        });
    });
});
