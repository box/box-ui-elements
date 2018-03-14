/**
 * @flow
 * @file Helper for the box versions API
 * @author Box
 */

import Item from './Item';
import type { FileVersions } from '../flowTypes';

class Versions extends Item {
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
        return `${this.getBaseApiUrl()}/files/${id}/versions`;
    }

    /**
     * Gets the versions for a box file
     *
     * @param {string} id - a box file id
     * @param {Function} successCallback - Function to call with results
     * @param {Function} errorCallback - Function to call with errors
     * @return {Promise}
     */
    versions(id: string, successCallback: Function, errorCallback: Function): Promise<void> {
        if (this.isDestroyed()) {
            return Promise.reject();
        }

        // Make the XHR request
        // We only need the total_count for now
        return this.xhr
            .get({
                id: this.getTypedFileId(id),
                url: this.getUrl(id)
            })
            .then(({ data }: { data: FileVersions }) => {
                successCallback(data);
            })
            .catch(errorCallback);
    }
}

export default Versions;
