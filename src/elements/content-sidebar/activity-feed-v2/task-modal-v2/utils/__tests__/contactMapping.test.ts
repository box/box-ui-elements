import type { GroupMini, SelectorItem, UserMini } from '../../../../../../common/types/core';

import {
    mapAssigneeToUserContact,
    mapCollaboratorToUserContact,
    mapUserContactToAssignee,
    type RuntimeAssignee,
} from '../contactMapping';

const userItem: UserMini = {
    email: 'alice@example.com',
    id: '12345',
    name: 'Alice Anderson',
    type: 'user',
};

const groupItem: GroupMini = {
    id: '99',
    name: 'Engineering',
    type: 'group',
};

const userCollaborator: SelectorItem<UserMini | GroupMini> = {
    id: '12345',
    item: userItem,
    name: 'Alice Anderson',
};

const groupCollaborator: SelectorItem<UserMini | GroupMini> = {
    id: '99',
    item: groupItem,
    name: 'Engineering',
};

const makeAssignee = (target: UserMini | GroupMini): RuntimeAssignee => ({
    id: 'task_collab_1',
    permissions: { can_delete: true, can_update: true },
    role: 'ASSIGNEE',
    status: 'NOT_STARTED',
    target,
    type: 'task_collaborator',
});

describe('contactMapping', () => {
    describe('mapCollaboratorToUserContact', () => {
        test('maps a user collaborator with email, numeric display id, and raw-id value', () => {
            expect(mapCollaboratorToUserContact(userCollaborator)).toEqual({
                email: 'alice@example.com',
                id: 12345,
                name: 'Alice Anderson',
                type: 'user',
                value: '12345',
            });
        });

        test('maps a group collaborator with empty email and group type', () => {
            expect(mapCollaboratorToUserContact(groupCollaborator)).toEqual({
                email: '',
                id: 99,
                name: 'Engineering',
                type: 'group',
                value: '99',
            });
        });

        test('falls back to display id 0 but preserves the raw id in value when id is non-numeric', () => {
            const nonNumericGroup: SelectorItem<UserMini | GroupMini> = {
                id: 'group_abc',
                item: { id: 'group_abc', name: 'Beta Group', type: 'group' },
                name: 'Beta Group',
            };
            const contact = mapCollaboratorToUserContact(nonNumericGroup);
            expect(contact.id).toBe(0);
            expect(contact.value).toBe('group_abc');
        });

        test('returns display id 0 for empty and whitespace-only ids', () => {
            const emptyIdGroup: SelectorItem<UserMini | GroupMini> = {
                id: '',
                item: { id: '', name: 'Empty', type: 'group' },
                name: 'Empty',
            };
            const whitespaceIdGroup: SelectorItem<UserMini | GroupMini> = {
                id: '   ',
                item: { id: '   ', name: 'Whitespace', type: 'group' },
                name: 'Whitespace',
            };

            expect(mapCollaboratorToUserContact(emptyIdGroup).id).toBe(0);
            expect(mapCollaboratorToUserContact(emptyIdGroup).value).toBe('');
            expect(mapCollaboratorToUserContact(whitespaceIdGroup).id).toBe(0);
            expect(mapCollaboratorToUserContact(whitespaceIdGroup).value).toBe('   ');
        });

        test('throws when SelectorItem.item is missing', () => {
            const orphan: SelectorItem<UserMini | GroupMini> = {
                id: '12345',
                name: 'Orphan',
            };
            expect(() => mapCollaboratorToUserContact(orphan)).toThrow(/SelectorItem\.item is required/);
        });
    });

    describe('mapUserContactToAssignee', () => {
        test('produces a user assignee whose target.id is the raw value, not the display id', () => {
            const contact = mapCollaboratorToUserContact(userCollaborator);
            const assignee = mapUserContactToAssignee(contact);

            expect(assignee).toEqual({
                id: '',
                permissions: { can_delete: false, can_update: false },
                role: 'ASSIGNEE',
                status: 'NOT_STARTED',
                target: { email: 'alice@example.com', id: '12345', name: 'Alice Anderson', type: 'user' },
                type: 'task_collaborator',
            });
        });

        test('produces a group assignee with target.type = group and raw id', () => {
            const contact = mapCollaboratorToUserContact(groupCollaborator);
            const assignee = mapUserContactToAssignee(contact);

            expect(assignee.target).toEqual({ id: '99', name: 'Engineering', type: 'group' });
        });
    });

    describe('mapAssigneeToUserContact', () => {
        test('seeds a user contact from an existing user assignee', () => {
            expect(mapAssigneeToUserContact(makeAssignee(userItem))).toEqual({
                email: 'alice@example.com',
                id: 12345,
                name: 'Alice Anderson',
                type: 'user',
                value: '12345',
            });
        });

        test('seeds a group contact (no email) from an existing group assignee', () => {
            expect(mapAssigneeToUserContact(makeAssignee(groupItem))).toEqual({
                email: '',
                id: 99,
                name: 'Engineering',
                type: 'group',
                value: '99',
            });
        });

        test('treats a target missing email as empty string', () => {
            const target: UserMini = { id: '7', name: 'Charlie', type: 'user' };
            expect(mapAssigneeToUserContact(makeAssignee(target)).email).toBe('');
        });
    });

    describe('round-trip equivalence', () => {
        test('user with numeric id: SelectorItem -> UserContact -> assignee -> UserContact stays stable', () => {
            const contact = mapCollaboratorToUserContact(userCollaborator);
            const assignee = mapUserContactToAssignee(contact);
            const rebuilt = mapAssigneeToUserContact(assignee);
            expect(rebuilt).toEqual(contact);
        });

        test('group with numeric id: SelectorItem -> UserContact -> assignee -> UserContact stays stable', () => {
            const contact = mapCollaboratorToUserContact(groupCollaborator);
            const assignee = mapUserContactToAssignee(contact);
            const rebuilt = mapAssigneeToUserContact(assignee);
            expect(rebuilt).toEqual(contact);
        });

        test('non-numeric id is preserved end-to-end through the assignee payload', () => {
            const nonNumericGroup: SelectorItem<UserMini | GroupMini> = {
                id: 'group_abc',
                item: { id: 'group_abc', name: 'Beta Group', type: 'group' },
                name: 'Beta Group',
            };
            const contact = mapCollaboratorToUserContact(nonNumericGroup);
            const assignee = mapUserContactToAssignee(contact);
            const rebuilt = mapAssigneeToUserContact(assignee);

            expect(assignee.target.id).toBe('group_abc');
            expect(rebuilt.value).toBe('group_abc');
            expect(rebuilt).toEqual(contact);
        });

        test('two distinct non-numeric ids share display id 0 but stay distinguishable by value', () => {
            const groupA: SelectorItem<UserMini | GroupMini> = {
                id: 'group_abc',
                item: { id: 'group_abc', name: 'Alpha', type: 'group' },
                name: 'Alpha',
            };
            const groupB: SelectorItem<UserMini | GroupMini> = {
                id: 'group_xyz',
                item: { id: 'group_xyz', name: 'Bravo', type: 'group' },
                name: 'Bravo',
            };
            const contactA = mapCollaboratorToUserContact(groupA);
            const contactB = mapCollaboratorToUserContact(groupB);

            expect(contactA.id).toBe(contactB.id);
            expect(contactA.value).not.toBe(contactB.value);
        });
    });
});
