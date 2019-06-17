// @flow
import type { TaskCollabAssignee, TaskType } from '../elements/content-sidebar/activity-feed/task-new/flowTypes';

type TaskPayload = {
    description: string,
    due_at?: ?string,
    task_type: TaskType,
};

type TaskUpdatePayload = {
    addedAssignees: SelectorItems,
    description: string,
    due_at?: ?string,
    id: string,
    removedAssignees: Array<TaskCollabAssignee>,
};

export type { TaskPayload, TaskUpdatePayload };
