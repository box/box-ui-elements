import { Collaborator } from '@box/unified-share-modal';

import { STATUS_ACCEPTED } from '../../../constants';

import type { Collaboration, Collaborations } from '../../../common/types/core';
import type { AvatarURLMap } from '../types';

export interface ConvertCollabProps {
    collab: Collaboration;
    currentUserID: number;
    ownerEmail: string;
    avatarURLMap?: AvatarURLMap;
}

export const convertCollab = ({
    collab,
    currentUserID,
    ownerEmail,
    avatarURLMap,
}: ConvertCollabProps): Collaborator | null => {
    if (!collab || collab.status !== STATUS_ACCEPTED) return null;

    const {
        accessible_by: { id: collabId, login: collabEmail, name: collabName },
        id,
        expires_at: executeAt,
        role,
    } = collab;

    const isCurrentUser = collabId === currentUserID;
    const ownerEmailDomain = ownerEmail && /@/.test(ownerEmail) ? ownerEmail.split('@')[1] : null;
    const isExternal =
        !isCurrentUser && collabEmail && ownerEmailDomain && collabEmail.split('@')[1] !== ownerEmailDomain;
    const avatarUrl = avatarURLMap ? avatarURLMap[collabId] : undefined;

    return {
        avatarUrl,
        email: collabEmail,
        expiresAt: executeAt,
        hasCustomAvatar: !!avatarUrl,
        hasCustomRole: !!role,
        id: id.toString(),
        isCurrentUser,
        isExternal,
        isPending: false,
        name: collabName,
        role: `${role[0].toUpperCase()}${role.slice(1)}`,
        userId: collabId.toString(),
    };
};

export const convertCollabsResponse = (collabsAPIData: Collaborations, avatarURLMap?: AvatarURLMap): Collaborator[] => {
    const { entries = [] } = collabsAPIData;
    if (!entries.length) return [];

    const {
        created_by: { id: currentUserID, login: ownerEmail },
    } = entries[0];
    return entries.flatMap(collab => {
        const converted = convertCollab({ collab, currentUserID, ownerEmail, avatarURLMap });
        return converted ? [converted] : [];
    });
};
