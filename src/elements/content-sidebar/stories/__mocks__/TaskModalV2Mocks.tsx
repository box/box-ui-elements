import * as React from 'react';

import { BlueprintModernizationProvider, Button, TooltipProvider } from '@box/blueprint-web';
import type { FetchedAvatarUrls, UserContactType } from '@box/user-selector';

import TaskModalV2 from '../../activity-feed-v2/task-modal-v2';

import type { ElementsXhrError } from '../../../../common/types/api';
import type { TaskNew, TaskType } from '../../../../common/types/tasks';
import type { CreateTaskCallback, EditTaskCallback, TaskAssignee } from '../../activity-feed-v2/task-modal-v2/types';

import { TASK_COMPLETION_RULE_ALL, TASK_TYPE_APPROVAL } from '../../../../constants';

export const mockContacts: UserContactType[] = [
    { email: 'awong@example.com', id: 1, name: 'Alice Wong', type: 'user', value: '1' },
    { email: 'bsmith@example.com', id: 2, name: 'Bob Smith', type: 'user', value: '2' },
    { email: 'cnguyen@example.com', id: 3, name: 'Charlie Nguyen', type: 'user', value: '3' },
    { email: '', id: 100, name: 'Design Team', type: 'group', value: '100' },
    { email: '', id: 101, name: 'Engineering Team', type: 'group', value: '101' },
];

export const mockFetchUsers = (query: string): Promise<UserContactType[]> =>
    Promise.resolve(mockContacts.filter(contact => contact.name.toLowerCase().includes(query.toLowerCase())));

export const mockFetchAvatarUrls = (): Promise<FetchedAvatarUrls> => Promise.resolve({});

const buildUserAssignee = (collaboratorId: string, id: string, name: string, email: string): TaskAssignee => ({
    id: collaboratorId,
    permissions: { can_delete: false, can_update: false },
    role: 'ASSIGNEE',
    status: 'NOT_STARTED',
    target: { email, id, name, type: 'user' },
    type: 'task_collaborator',
});

const buildGroupAssignee = (collaboratorId: string, id: string, name: string): TaskAssignee => ({
    id: collaboratorId,
    permissions: { can_delete: false, can_update: false },
    role: 'ASSIGNEE',
    status: 'NOT_STARTED',
    target: { id, name, type: 'group' },
    type: 'task_collaborator',
});

export const mockSubmitError: ElementsXhrError = { status: 500 } as ElementsXhrError;

export const mockEditingAssignees: TaskAssignee[] = [
    buildUserAssignee('collab-1', '1', 'Alice Wong', 'awong@example.com'),
    buildGroupAssignee('collab-2', '101', 'Engineering Team'),
];

export const mockEditingTask: TaskNew = {
    assigned_to: { entries: mockEditingAssignees, limit: 25, next_marker: '' },
    completion_rule: TASK_COMPLETION_RULE_ALL,
    created_at: '2026-06-30T12:00:00Z',
    created_by: {
        id: 'creator',
        role: 'CREATOR',
        status: 'NOT_STARTED',
        target: { id: 'creator', name: 'Creator', type: 'user' },
        type: 'task_collaborator',
    },
    description: 'Review the updated launch checklist',
    // Midday UTC so the local calendar date stays July 15 in any test timezone
    due_at: '2026-07-15T12:00:00Z',
    id: 'task-1',
    modified_at: '2026-06-30T12:00:00Z',
    permissions: {
        can_create_task_collaborator: true,
        can_create_task_link: true,
        can_delete: true,
        can_update: true,
    },
    status: 'NOT_STARTED',
    task_links: { entries: [], limit: 25, next_marker: '' },
    task_type: TASK_TYPE_APPROVAL,
    type: 'task',
};

export type InteractiveTaskModalProps = {
    editingAssignees?: TaskAssignee[];
    editingTask?: TaskNew;
    initialError?: ElementsXhrError;
    shouldFailSubmit?: boolean;
    taskType: TaskType;
};

export const InteractiveTaskModal = ({
    editingAssignees = [],
    editingTask,
    initialError,
    shouldFailSubmit = false,
    taskType,
}: InteractiveTaskModalProps) => {
    const [error, setError] = React.useState<ElementsXhrError | undefined>(initialError);
    const [isOpen, setIsOpen] = React.useState(true);

    const handleClose = () => {
        setError(undefined);
        setIsOpen(false);
    };

    const finishSubmit = (onSuccess: () => void, onError: (submitError: ElementsXhrError) => void) => {
        setTimeout(() => {
            if (shouldFailSubmit) {
                onError(mockSubmitError);
                return;
            }
            onSuccess();
        }, 400);
    };

    const createTask: CreateTaskCallback = (text, approvers, type, dueDate, completionRule, onSuccess, onError) =>
        finishSubmit(onSuccess, onError);

    const editTask: EditTaskCallback = (payload, onSuccess, onError) => finishSubmit(onSuccess, onError);

    const sharedProps = {
        createTask,
        error,
        fetchAvatarUrls: mockFetchAvatarUrls,
        fetchUsers: mockFetchUsers,
        isOpen,
        onClose: handleClose,
        onSubmitError: setError,
        onSubmitSuccess: handleClose,
        taskType,
    };

    return (
        <BlueprintModernizationProvider enableModernizedComponents>
            <TooltipProvider>
                <Button onClick={() => setIsOpen(true)} variant="secondary">
                    Reopen task modal
                </Button>
                {editingTask ? (
                    <TaskModalV2
                        {...sharedProps}
                        editingAssignees={editingAssignees}
                        editingTask={editingTask}
                        editTask={editTask}
                        mode="edit"
                    />
                ) : (
                    <TaskModalV2 {...sharedProps} />
                )}
            </TooltipProvider>
        </BlueprintModernizationProvider>
    );
};
