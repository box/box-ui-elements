/**
 * @flow
 * @file Helper for the box Tasks API
 * @author Box
 */

import Base from './Base';

class Tasks extends Base {
    fields = 'task_assignment_collection,is_completed,created_by,created_at';

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
        return `${this.getBaseApiUrl()}/files/${id}/tasks?fields=${this.fields}`;
    }
}

export default Tasks;
