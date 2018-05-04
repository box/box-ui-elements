/**
 * @flow
 * @file Helper for the box Tasks API
 * @author Box
 */

import { getTasksFields } from '../util/fields';
import Base from './Base';

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
        return `${this.getBaseApiUrl()}/files/${id}/tasks?fields=${getTasksFields()}`;
    }
}

export default Tasks;
