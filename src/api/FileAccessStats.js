/**
 * @flow
 * @file Helper for the box versions API
 * @author Box
 */

import Base from './Base';
import File from './File';
import type { FileAccessStats as FileAccessStatsType } from '../flowTypes';

class FileAccessStats extends Base {
    /**
     * API URL for versions
     *
     * @param {string} [id] - a box file id
     * @return {string} base url for files
     */
    getUrl(id: string): string {
        if (!id) {
            throw new Error('Missing file id!');
        }
        return `${this.getBaseApiUrl()}/file_access_stats/${id}`;
    }

    /**
     * Gets the versions for a box file
     *
     * @param {string} id - a box file id
     * @param {Function} successCallback - Function to call with results
     * @param {Function} errorCallback - Function to call with errors
     * @return {Promise}
     */
    accessStats(id: string, successCallback: Function, errorCallback: Function): Promise<void> {
        if (this.isDestroyed()) {
            return Promise.reject();
        }

        // Make the XHR request
        return this.xhr
            .get({
                id: File.getTypedFileId(id),
                url: this.getUrl(id)
            })
            .then(({ data }: { data: FileAccessStatsType }) => {
                successCallback(data);
            })
            .catch(errorCallback);
    }
}

export default FileAccessStats;
