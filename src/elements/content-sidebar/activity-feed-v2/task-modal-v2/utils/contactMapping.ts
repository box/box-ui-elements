import type { UserContactType } from '@box/user-selector';

import type { GroupMini, SelectorItem, UserMini } from '../../../../../common/types/core';
import type { TaskCollabAssignee } from '../../../../../common/types/tasks';

type AssigneeTarget = UserMini | GroupMini;

// Widens TaskCollab.target to admit groups, which the collaborators endpoint returns at runtime.
export type RuntimeAssignee = Omit<TaskCollabAssignee, 'target'> & { target: AssigneeTarget };

// Non-numeric ids collapse to 0; the raw string is preserved in UserContactType.value.
const toDisplayId = (rawId: string): number => {
    if (rawId.trim() === '') {
        return 0;
    }
    const parsed = Number(rawId);
    return Number.isFinite(parsed) ? parsed : 0;
};

export const mapCollaboratorToUserContact = (collab: SelectorItem<UserMini | GroupMini>): UserContactType => {
    const { item } = collab;
    if (!item) {
        throw new Error('mapCollaboratorToUserContact: SelectorItem.item is required');
    }
    const email = item.type === 'user' ? item.email ?? '' : '';

    return {
        email,
        id: toDisplayId(item.id),
        name: item.name,
        type: item.type,
        value: item.id,
    };
};

export const mapUserContactToAssignee = (contact: UserContactType): RuntimeAssignee => {
    const target: AssigneeTarget =
        contact.type === 'group'
            ? { id: contact.value, name: contact.name, type: 'group' }
            : { email: contact.email, id: contact.value, name: contact.name, type: 'user' };

    return {
        id: '',
        permissions: { can_delete: false, can_update: false },
        role: 'ASSIGNEE',
        status: 'NOT_STARTED',
        target,
        type: 'task_collaborator',
    };
};

export const mapAssigneeToUserContact = (assignee: RuntimeAssignee): UserContactType => {
    const { target } = assignee;
    const email = target.type === 'user' ? target.email ?? '' : '';

    return {
        email,
        id: toDisplayId(target.id),
        name: target.name,
        type: target.type,
        value: target.id,
    };
};
