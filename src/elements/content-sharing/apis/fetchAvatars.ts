import type { AvatarURLMap, FetchCollaboratorsProps } from '../types';

export const fetchAvatars = async ({ api, itemId, collaborators }: FetchCollaboratorsProps): Promise<AvatarURLMap> => {
    const usersApi = api.getUsersAPI(false);
    const avatarUrlMap: AvatarURLMap = {};

    const avatarPromises = collaborators.map(async collab => {
        if (!collab?.accessible_by) return;
        const {
            accessible_by: { id: userId },
        } = collab;
        try {
            const url = await usersApi.getAvatarUrlWithAccessToken(userId.toString(), itemId);
            avatarUrlMap[userId] = url;
        } catch (error) {
            avatarUrlMap[userId] = null;
            throw error;
        }
    });

    await Promise.all(avatarPromises);
    return avatarUrlMap;
};
