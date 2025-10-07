import { Collaborator } from '@box/unified-share-modal';

import { INVITEE_ROLE_OWNER, STATUS_ACCEPTED } from '../../../constants';

import type { Collaboration, Collaborations } from '../../../common/types/core';
import type { AvatarURLMap } from '../types';

export interface ConvertCollabProps {
    collab: Collaboration;
    currentUserId: string;
    isCurrentUserOwner: boolean;
    ownerEmailDomain: string;
    avatarURLMap?: AvatarURLMap;
}

export const convertCollab = ({
    collab,
    currentUserId,
    isCurrentUserOwner,
    ownerEmailDomain,
    avatarURLMap,
}: ConvertCollabProps): Collaborator | null => {
    if (!collab || collab.status !== STATUS_ACCEPTED) return null;

    const {
        accessible_by: { id: collabId, login: collabEmail, name: collabName },
        id,
        expires_at: executeAt,
        role,
    } = collab;

    const isCurrentUser = collabId === currentUserId;
    const isExternal =
        !isCurrentUserOwner && collabEmail && ownerEmailDomain && collabEmail.split('@')[1] !== ownerEmailDomain;
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
        role: role ? `${role[0].toUpperCase()}${role.slice(1)}` : '',
        userId: collabId.toString(),
    };
};

export const convertCollabsResponse = (
    collabsAPIData: Collaborations,
    currentUserId: string,
    owner: { id: string; email: string; name: string },
    avatarURLMap?: AvatarURLMap,
): Collaborator[] => {
    const { entries = [] } = collabsAPIData;
    if (!entries.length) return [];

    const { id: ownerId, email: ownerEmail, name: ownerName } = owner;
    const isCurrentUserOwner = currentUserId === ownerId;
    const ownerEmailDomain = ownerEmail && /@/.test(ownerEmail) ? ownerEmail.split('@')[1] : null;

    const itemOwner = {
        id: ownerEmail,
        status: STATUS_ACCEPTED,
        role: INVITEE_ROLE_OWNER,
        accessible_by: {
            id: ownerId,
            login: ownerEmail,
            name: ownerName,
        },
    };
    entries.unshift(itemOwner);

    return entries.flatMap(collab => {
        const converted = convertCollab({ collab, currentUserId, isCurrentUserOwner, ownerEmailDomain, avatarURLMap });
        return converted ? [converted] : [];
    });
};
