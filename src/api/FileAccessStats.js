/**
 * @flow
 * @file Helper for the box versions API
 * @author Box
 */

import Base from './Base';

class FileAccessStats extends Base {
    /**
     * API URL for access stats
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
}

export default FileAccessStats;
