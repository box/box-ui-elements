import type { SelectorItem, GroupMini, UserMini } from '../../../../common/types/core';
import type { ElementsXhrError } from '../../../../common/types/api';
import type {
    TaskCollabAssignee,
    TaskCompletionRule,
    TaskType,
    TaskUpdatePayload,
} from '../../../../common/types/tasks';

// Widens TaskCollab.target to admit groups, which the collaborators endpoint returns at runtime.
export type AssigneeTarget = UserMini | GroupMini;

export type TaskAssignee = Omit<TaskCollabAssignee, 'target'> & { target: AssigneeTarget };

export type CreateTaskCallback = (
    text: string,
    approvers: SelectorItem<UserMini | GroupMini>[],
    taskType: TaskType,
    dueDate: string | null,
    completionRule: TaskCompletionRule,
    onSuccess: () => void,
    onError: (error: ElementsXhrError) => void,
) => void;

export type EditTaskCallback = (
    payload: TaskUpdatePayload,
    onSuccess: () => void,
    onError: (error: ElementsXhrError) => void,
) => void;

export type TaskFormV2SubmitPayload = {
    assignees: TaskAssignee[];
    completionRule: TaskCompletionRule;
    dueDate: Date | null;
    message: string;
};
