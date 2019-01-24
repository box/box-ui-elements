/**
 * @flow
 * @file Helper for the box versions API
 * @author Box
 */

import { VERSIONS_FIELDS_TO_FETCH } from 'utils/fields';
import OffsetBasedAPI from './OffsetBasedAPI';
import { ERROR_CODE_FETCH_VERSIONS, DEFAULT_FETCH_START, DEFAULT_FETCH_END } from '../constants';

const ACTION = {
    upload: 'upload',
    delete: 'delete',
    restore: 'restore',
};

class Versions extends OffsetBasedAPI {
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
     * Formats the versions api response to usable data
     * @param {Object} data the api response data
     */
    successHandler = (data: FileVersions): void => {
        if (this.isDestroyed() || typeof this.successCallback !== 'function') {
            return;
        }

        const { entries } = data;
        const versions = entries.map((version: BoxItemVersion) => {
            return {
                ...version,
                action: version.trashed_at ? ACTION.delete : ACTION.upload,
            };
        });

        this.successCallback({ ...data, entries: versions });
    };

    /**
     * API for fetching versions on a file
     *
     * @param {string} fileId - a box file id
     * @param {Function} successCallback - the success callback
     * @param {Function} errorCallback - the error callback
     * @param {number} offset - the offset of the starting version index
     * @param {number} limit - the max number of versions to fetch
     * @param {Array} fields - the fields to fetch
     * @param {boolean} shouldFetchAll - true if all versions should be fetched
     * @returns {void}
     */
    getVersions(
        fileId: string,
        successCallback: Function,
        errorCallback: ElementsErrorCallback,
        offset: number = DEFAULT_FETCH_START,
        limit: number = DEFAULT_FETCH_END,
        fields: Array<string> = VERSIONS_FIELDS_TO_FETCH,
        shouldFetchAll: boolean = true,
    ): void {
        this.errorCode = ERROR_CODE_FETCH_VERSIONS;
        this.offsetGet(fileId, successCallback, errorCallback, offset, limit, fields, shouldFetchAll);
    }
}

export default Versions;
