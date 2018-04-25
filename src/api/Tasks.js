/**
 * @flow
 * @file Helper for the box versions API
 * @author Box
 */

import Base from './Base';
import File from './File';
import type { Tasks as TasksType } from '../flowTypes';

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
     * Gets the versions for a box task
     *
     * @param {string} id - a box file id
     * @param {Function} successCallback - Function to call with results
     * @param {Function} errorCallback - Function to call with errors
     * @return {Promise}
     */
    async tasks(id: string, successCallback: Function, errorCallback: Function): Promise<void> {
        if (this.isDestroyed()) {
            return Promise.reject();
        }

        // Make the XHR request
        try {
            const { data }: { data: TasksType } = await this.xhr.get({
                id: File.getTypedFileId(id),
                url: this.getUrl(id)
            });

            if (!this.isDestroyed()) {
                successCallback(data);
            }
        } catch (error) {
            if (!this.isDestroyed()) {
                errorCallback(error);
            }
        }

        return Promise.resolve();
    }
}

export default Tasks;
