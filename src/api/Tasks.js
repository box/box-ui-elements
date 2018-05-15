/**
 * @flow
 * @file Helper for the box Tasks API
 * @author Box
 */

import Base from './Base';
import type { Task } from '../flowTypes';

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
     * @param {Object} data the api response data
     */
    successHandler = (data: any): void => {
        const tasks = data.entries.map((task: Task) => ({
            ...task,
            assignees: task.task_assignment_collection.entries || []
        }));

        if (!this.isDestroyed() && typeof this.successCallback === 'function') {
            this.successCallback({
                ...data,
                entries: tasks
            });
        }
    };
}

export default Tasks;
