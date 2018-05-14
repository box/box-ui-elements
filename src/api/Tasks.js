/**
 * @flow
 * @file Helper for the box Tasks API
 * @author Box
 */

import Base from './Base';
import type { Task, BoxTask } from '../flowTypes';

class Tasks extends Base {
    /**
     * API URL for tasks
     *
     * @param {string} [id] - a box file id
     * @return {string} base url for files
     */
    getUrl(id: string): string {
        if (!id) {
            throw new Error('Missing file id!');
        }
        return `${this.getBaseApiUrl()}/files/${id}/tasks`;
    }

    /**
     * Formats the tasks api response to usable data
     * @param {Object} response the api response data
     * @return {Object} the formatted api response data
     */
    formatResponse(response: Object): Object {
        const formattedEntries = response.entries.map((task: BoxTask): Array<Task> => ({
            id: task.id,
            type: task.type,
            createdAt: task.created_at,
            createdBy: task.created_by,
            dueAt: task.due_at,
            message: task.message,
            assignees: task.task_assignment_collection.entries
        }));

        return {
            ...response,
            entries: formattedEntries
        };
    }
}

export default Tasks;
