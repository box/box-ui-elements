/**
 * @flow
 * @file Helper for the box Tasks API
 * @author Box
 */

import TasksBase from './TasksBase';
import {
    ERROR_CODE_CREATE_TASK,
    ERROR_CODE_UPDATE_TASK,
    ERROR_CODE_DELETE_TASK,
    ERROR_CODE_FETCH_TASKS,
    API_PAGE_LIMIT,
} from '../../constants';
import type { TaskUpdatePayload } from '../../common/types/tasks';
import type { ElementsXhrError, ElementsErrorCallback } from '../../common/types/api';
import type { SelectorItems, SelectorItem, UserMini, GroupMini, BoxItem } from '../../common/types/core';

class TasksNew extends TasksBase {
    getUrlForFileTasks(id: string): string {
        return `${this.getBaseApiUrl()}/undoc/files/${id}/linked_tasks?limit=${API_PAGE_LIMIT}`;
    }

    getUrlForTaskCreateWithDeps(): string {
        return `${this.getBaseApiUrl()}/undoc/tasks/with_dependencies`;
    }

    getUrlForTask(id: string): string {
        return `${this.getBaseApiUrl()}/undoc/tasks/${id}`;
    }

    updateTask({
        errorCallback,
        file,
        successCallback,
        task,
    }: {
        errorCallback: ElementsErrorCallback,
        file: BoxItem,
        successCallback: Function,
        task: TaskUpdatePayload,
    }): void {
        this.errorCode = ERROR_CODE_UPDATE_TASK;

        this.put({
            id: file.id,
            url: this.getUrlForTask(task.id),
            data: { data: { ...task } },
            successCallback,
            errorCallback,
        });
    }

    deleteTask({
        errorCallback,
        file,
        successCallback,
        task,
    }: {
        errorCallback: ElementsErrorCallback,
        file: BoxItem,
        successCallback: Function,
        task: { id: string },
    }): void {
        this.errorCode = ERROR_CODE_DELETE_TASK;

        this.delete({
            id: file.id,
            url: this.getUrlForTask(task.id),
            successCallback,
            errorCallback,
        });
    }

    getTasksForFile({
        errorCallback,
        file,
        successCallback,
    }: {
        errorCallback: ElementsErrorCallback,
        file: { id: string },
        successCallback: Function,
    }): void {
        this.errorCode = ERROR_CODE_FETCH_TASKS;
        this.get({
            id: file.id,
            url: this.getUrlForFileTasks(file.id),
            successCallback,
            errorCallback,
        });
    }

    getTask({
        errorCallback,
        file,
        id,
        successCallback,
    }: {
        errorCallback: ElementsErrorCallback,
        file: { id: string },
        id: string,
        successCallback: Function,
    }): void {
        this.errorCode = ERROR_CODE_FETCH_TASKS;
        this.get({
            id: file.id,
            url: this.getUrlForTask(id),
            successCallback,
            errorCallback,
        });
    }

    createTaskWithDeps({
        errorCallback,
        file,
        successCallback,
        task,
        assignees,
    }: {
        assignees: SelectorItems<UserMini | GroupMini>,
        errorCallback: (e: ElementsXhrError, code: string) => void,
        file: BoxItem,
        successCallback: Function,
        task: {}, // Partial task object
    }): void {
        this.errorCode = ERROR_CODE_CREATE_TASK;

        const createTaskCollabsPayload = assignees.map((assignee: SelectorItem<UserMini | GroupMini>) => {
            return {
                target: {
                    type: assignee.item && assignee.item.type === 'group' ? 'group' : 'user',
                    id: assignee.id,
                },
            };
        });

        const createTaskLinksPayload = [
            {
                target: {
                    id: file.id,
                    type: 'file',
                },
            },
        ];

        const createTaskWithDepsPayload = {
            task: { ...task },
            assigned_to: createTaskCollabsPayload,
            task_links: createTaskLinksPayload,
        };

        this.post({
            id: file.id,
            url: this.getUrlForTaskCreateWithDeps(),
            data: { data: { ...createTaskWithDepsPayload } },
            successCallback,
            errorCallback,
        });
    }
}

export default TasksNew;
