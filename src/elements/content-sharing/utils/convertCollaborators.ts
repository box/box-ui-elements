import { Collaborator } from '@box/unified-share-modal';

import { INVITEE_ROLE_OWNER, STATUS_ACCEPTED } from '../../../constants';
import { COLLAB_USER_TYPE, COLLAB_GROUP_TYPE } from '../constants';

import type { Collaboration, Collaborations } from '../../../common/types/core';
import type { AvatarURLMap } from '../types';

export interface ConvertCollabProps {
    collab: Collaboration;
    currentUserId: string;
    isCurrentUserOwner: boolean;
    ownerEmailDomain: string;
    avatarUrlMap?: AvatarURLMap;
}

export const convertCollab = ({
    collab,
    currentUserId,
    isCurrentUserOwner,
    ownerEmailDomain,
    avatarUrlMap,
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
    const avatarUrl = avatarUrlMap ? avatarUrlMap[collabId] : undefined;

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
    collabsApiData: Collaborations,
    currentUserId: string,
    owner: { id: string; email: string; name: string },
    avatarUrlMap?: AvatarURLMap,
): Collaborator[] => {
    const { entries = [] } = collabsApiData;
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

    return [itemOwner, ...entries].flatMap(collab => {
        const converted = convertCollab({ collab, currentUserId, isCurrentUserOwner, ownerEmailDomain, avatarUrlMap });
        return converted ? [converted] : [];
    });
};

export const convertCollabsRequest = (collabRequest, existingCollaboratorsList) => {
    const existingCollab = [];
    if (existingCollaboratorsList && existingCollaboratorsList.length > 0) {
        existingCollaboratorsList.forEach(collab => {
            existingCollab.push(collab.userId);
        });
    }

    const groups = [];
    const users = [];
    const { role } = collabRequest;
    collabRequest.contacts.forEach(contact => {
        if (existingCollab.includes(contact.id)) {
            return;
        }

        if (contact.type === COLLAB_USER_TYPE) {
            users.push({
                accessible_by: {
                    login: contact.email,
                    type: COLLAB_USER_TYPE,
                },
                role,
            });
        }

        if (contact.type === COLLAB_GROUP_TYPE) {
            groups.push({
                accessible_by: {
                    id: contact.id,
                    type: COLLAB_GROUP_TYPE,
                },
                role,
            });
        }
    });

    return { groups, users };
};
