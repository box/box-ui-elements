import { Collaborator } from '@box/unified-share-modal';

import { INVITEE_ROLE_OWNER, STATUS_ACCEPTED, STATUS_PENDING, STATUS_REJECTED } from '../../../constants';
import {
    API_TO_USM_COLLAB_ROLE_MAP,
    COLLAB_USER_TYPE,
    COLLAB_GROUP_TYPE,
    USM_TO_API_COLLAB_ROLE_MAP,
} from '../constants';

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
    avatarUrlMap,
    collab,
    currentUserId,
    isCurrentUserOwner,
    ownerEmailDomain,
}: ConvertCollabProps): Collaborator | null => {
    if (!collab || collab.status === STATUS_REJECTED) {
        return null;
    }

    const { accessible_by: accessibleBy, id, invite_email: inviteEmail, expires_at: expiresAt, role, status } = collab;

    let collabId;
    let collabEmail = inviteEmail;
    let collabName = inviteEmail;

    if (accessibleBy?.name) {
        const { id: userId, login, name } = accessibleBy;

        collabId = userId;
        collabEmail = login;
        collabName = name;
    }

    if (!collabName) {
        return null;
    }

    const isExternal =
        !isCurrentUserOwner && !!collabEmail && !!ownerEmailDomain && collabEmail.split('@')[1] !== ownerEmailDomain;
    const avatarUrl = avatarUrlMap ? avatarUrlMap[collabId] : undefined;

    return {
        avatarUrl,
        email: collabEmail,
        expiresAt,
        hasCustomAvatar: !!avatarUrl,
        id: `${id}`,
        isCurrentUser: collabId != null && collabId === currentUserId,
        isExternal,
        isPending: status === STATUS_PENDING,
        name: collabName,
        role: API_TO_USM_COLLAB_ROLE_MAP[role],
        ...(collabId != null ? { userId: `${collabId}` } : {}),
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
        const converted = convertCollab({ avatarUrlMap, collab, currentUserId, isCurrentUserOwner, ownerEmailDomain });
        return converted ? [converted] : [];
    });
};

export const convertCollabsRequest = (request, currentCollabs) => {
    const currentCollabIds = new Set();

    if (currentCollabs) {
        currentCollabs.forEach(collab => {
            currentCollabIds.add(collab.userId);
        });
    }
    const { contacts, role: usmRole } = request;

    const role = USM_TO_API_COLLAB_ROLE_MAP[usmRole];

    const groups = [];
    const users = [];

    contacts.forEach(contact => {
        if (currentCollabIds.has(contact.id)) {
            return;
        }

        if (contact.type === COLLAB_GROUP_TYPE) {
            groups.push({
                accessible_by: {
                    id: contact.id,
                    type: COLLAB_GROUP_TYPE,
                },
                role,
            });
        } else {
            users.push({
                accessible_by: {
                    login: contact.email,
                    type: COLLAB_USER_TYPE,
                },
                role,
            });
        }
    });

    return { groups, users };
};
