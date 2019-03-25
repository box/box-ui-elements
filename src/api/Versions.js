/**
 * @flow
 * @file Helper for the box versions API
 * @author Box
 */

import { VERSIONS_FIELDS_TO_FETCH } from '../utils/fields';
import OffsetBasedAPI from './OffsetBasedAPI';
import {
    DEFAULT_FETCH_START,
    DEFAULT_FETCH_END,
    ERROR_CODE_FETCH_VERSIONS,
    VERSION_UPLOAD_ACTION,
    VERSION_DELETE_ACTION,
    VERSION_RESTORE_ACTION,
} from '../constants';

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
                action: version.trashed_at ? VERSION_DELETE_ACTION : VERSION_UPLOAD_ACTION,
            };
        });

        this.successCallback({ ...data, entries: versions });
    };

    /**
     * Adds the current version from the file object, which may be a restore
     *
     * @param {FileVersions} versions - API returned file versions for this file
     * @param {BoxItem} file - The parent file object
     * @return {FileVersions} modified versions array including the current/restored version
     */
    addCurrentVersion(versions: ?FileVersions, file: BoxItem): ?FileVersions {
        const { restored_from, file_version } = file;

        if (!file_version || !versions) {
            return versions;
        }

        const { modified_at, modified_by, size, version_number } = file;
        const currentVersion: BoxItemVersion = {
            ...file_version,
            action: VERSION_UPLOAD_ACTION,
            created_at: modified_at,
            modified_at,
            modified_by,
            size,
            version_number,
        };

        if (restored_from) {
            const { id: restoredFromId } = restored_from;
            const restoredVersion = versions.entries.find((version: BoxItemVersion) => version.id === restoredFromId);

            if (restoredVersion) {
                currentVersion.action = VERSION_RESTORE_ACTION;
                currentVersion.version_restored = restoredVersion.version_number;
            }
        }

        return {
            entries: [...versions.entries, currentVersion],
            total_count: versions.total_count + 1,
        };
    }

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
