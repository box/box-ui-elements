import type { AvatarURLMap, FetchCollaboratorsProps } from '../types';

export const fetchAvatars = async ({ api, itemID, collaborators }: FetchCollaboratorsProps): Promise<AvatarURLMap> => {
    const usersAPI = api.getUsersAPI(false);
    const avatarURLMap: AvatarURLMap = {};

    const avatarPromises = collaborators.map(async collab => {
        if (!collab?.accessible_by) return;
        const {
            accessible_by: { id: userID },
        } = collab;
        try {
            const url = await usersAPI.getAvatarUrlWithAccessToken(userID.toString(), itemID);
            avatarURLMap[userID] = url;
        } catch {
            avatarURLMap[userID] = null;
        }
    });

    await Promise.all(avatarPromises);
    return avatarURLMap;
};
