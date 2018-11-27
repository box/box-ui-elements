/**
 * @flow
 * @file Helper for the box versions API
 * @author Box
 */

import Base from './Base';
import { ERROR_CODE_FETCH_ACCESS_STATS } from '../constants';

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

    /**
     * API for fetching access stats on a file
     *
     * @param {string} id - a box file id
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @return {void>}
     */
    getFileAccessStats(id: string, successCallback: Function, errorCallback: Function): void {
        this.get({
            id,
            errorCode: ERROR_CODE_FETCH_ACCESS_STATS,
            successCallback,
            errorCallback,
        });
    }
}

export default FileAccessStats;
