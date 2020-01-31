// @flow
import type {
    FileMini,
    FolderMini,
    ISODate,
    UserMini,
    GroupMini,
    MarkerPaginatedCollection,
    SelectorItems,
} from './core';

type ID = string;

type TaskCollabStatus = 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'NOT_STARTED';

type TaskStatus = TaskCollabStatus | 'IN_PROGRESS';

type TaskCompletionRule = 'ALL_ASSIGNEES' | 'ANY_ASSIGNEE';

type TaskMini = {|
    created_at: ISODate,
    id: ID,
    modified_at: ISODate,
    status: TaskStatus,
    type: 'task',
|};

type TaskCollab<R> = {|
    completed_at?: ?ISODate,
    id: ID,
    role: R,
    status: TaskCollabStatus,
    target: UserMini,
    task?: TaskMini,
    type: 'task_collaborator',
|};

type TaskCollabCreator = TaskCollab<'CREATOR'>;

type TaskCollabAssignee = {|
    ...TaskCollab<'ASSIGNEE'>,
    permissions: {|
        can_delete: boolean,
        can_update: boolean,
    |},
|};

type TaskLink = {|
    description?: string,
    id: ID,
    permissions: {|
        can_delete: boolean,
        can_update: boolean,
    |},
    target?: ?FileMini | ?FolderMini | ?UserMini,
    task?: TaskMini,
    type: 'task_link',
|};

type TaskAssigneeCollection = MarkerPaginatedCollection<TaskCollabAssignee>;

type TaskLinkCollection = MarkerPaginatedCollection<TaskLink>;

type TaskType = 'GENERAL' | 'APPROVAL';
type TaskEditMode = 'CREATE' | 'EDIT';

type TaskNew = {|
    assigned_to: TaskAssigneeCollection,
    completed_at?: ?ISODate,
    completion_rule: TaskCompletionRule,
    created_at: ISODate,
    created_by: TaskCollabCreator,
    description: string,
    due_at?: ?ISODate,
    id: ID,
    modified_at?: ISODate,
    permissions: {|
        can_create_task_collaborator: boolean,
        can_create_task_link: boolean,
        can_delete: boolean,
        can_update: boolean,
    |},
    progress_at?: ?ISODate,
    status: TaskStatus,
    task_links: TaskLinkCollection,
    task_type: TaskType,
    type: 'task',
|};

type TaskPayload = {
    description: string,
    due_at?: ?string,
    task_type: TaskType,
};

type TaskUpdatePayload = {
    addedAssignees: SelectorItems<UserMini | GroupMini>,
    completion_rule: TaskCompletionRule,
    description: string,
    due_at?: ?string,
    id: string,
    removedAssignees: Array<TaskCollabAssignee>,
};

export type {
    TaskCollabStatus,
    TaskCompletionRule,
    TaskStatus,
    TaskCollabAssignee,
    TaskLink,
    TaskAssigneeCollection,
    TaskType,
    TaskEditMode,
    TaskNew,
    TaskPayload,
    TaskUpdatePayload,
};
