/**
 * @flow
 * @file Helper for the box versions API
 * @author Box
 */

import getProp from 'lodash/get';
import { FILE_VERSIONS_FIELDS_TO_FETCH } from '../utils/fields';
import OffsetBasedAPI from './OffsetBasedAPI';
import {
    DEFAULT_FETCH_END,
    DEFAULT_FETCH_START,
    ERROR_CODE_DELETE_VERSION,
    ERROR_CODE_FETCH_VERSIONS,
    ERROR_CODE_PROMOTE_VERSION,
    PERMISSION_CAN_DELETE,
    PERMISSION_CAN_UPLOAD,
    VERSION_DELETE_ACTION,
    VERSION_RESTORE_ACTION,
    VERSION_UPLOAD_ACTION,
} from '../constants';

class Versions extends OffsetBasedAPI {
    /**
     * API URL for file versions
     *
     * @param {string} id - a box file id
     * @return {string} base url for file versions
     */
    getUrl(id: string): string {
        if (!id) {
            throw new Error('Missing file id!');
        }

        return `${this.getBaseApiUrl()}/files/${id}/versions`;
    }

    /**
     * API URL for version info endpoint
     *
     * @param {string} id - a box file id
     * @param {string} versionId - a box file version id
     * @return {string} url for version info
     */
    getVersionUrl(id: string, versionId: string): string {
        if (!versionId) {
            throw new Error('Missing version id!');
        }

        return `${this.getUrl(id)}/${versionId}`;
    }

    /**
     * Formats version data for use in components.
     *
     * @param {BoxItemVersion} version - An individual version entry from the API
     * @return {BoxItemVersion} A version
     */
    format = (version: BoxItemVersion) => {
        let action = VERSION_UPLOAD_ACTION;

        if (version.trashed_at) {
            action = VERSION_DELETE_ACTION;
        }

        if (version.version_restored) {
            action = VERSION_RESTORE_ACTION;
        }

        return {
            ...version,
            action,
        };
    };

    /**
     * Formats the versions api response to usable data
     * @param {Object} data the api response data
     */
    successHandler = (data: FileVersions): void => {
        if (this.isDestroyed() || typeof this.successCallback !== 'function') {
            return;
        }

        // There is no response data when deleting/promoting a version
        if (!data) {
            this.successCallback();
            return;
        }

        // We don't have entries when creating/updating a version
        if (!data.entries) {
            this.successCallback(this.format(data));
            return;
        }

        this.successCallback({ ...data, entries: data.entries.map(this.format) });
    };

    /**
     * Adds the current version from the file object, which may be a restore
     *
     * @param {FileVersions} versions - API returned file versions for this file
     * @param {BoxItem} file - The parent file object
     * @return {FileVersions} modified versions array including the current/restored version
     */
    addCurrentVersion(versions: ?FileVersions, file: BoxItem): ?FileVersions {
        const { file_version } = file;

        if (!file_version || !versions) {
            return versions;
        }

        const { entries, total_count } = versions;
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
        const restoredFromId = getProp(file, 'restored_from.id');
        const restoredVersion =
            restoredFromId && entries.find((version: BoxItemVersion) => version.id === restoredFromId);

        if (restoredVersion) {
            currentVersion.action = VERSION_RESTORE_ACTION;
            currentVersion.version_restored = restoredVersion.version_number;
        }

        return {
            entries: [...entries, currentVersion],
            total_count: total_count + 1,
        };
    }

    /**
     * API for deleting a version of a file
     *
     * @param {Object} options - the request options
     * @param {string} options.fileId - a box file id
     * @param {string} options.versionId - a box file version id
     * @param {BoxItemPermission} options.permissions - the permissions for the file
     * @param {Function} options.successCallback - the success callback
     * @param {Function} options.errorCallback - the error callback
     * @returns {void}
     */
    deleteVersion({
        errorCallback,
        fileId,
        permissions,
        successCallback,
        versionId,
    }: {
        errorCallback: ElementsErrorCallback,
        fileId: string,
        permissions: BoxItemPermission,
        successCallback: null => any,
        versionId: string,
    }): void {
        this.errorCode = ERROR_CODE_DELETE_VERSION;

        try {
            this.checkApiCallValidity(PERMISSION_CAN_DELETE, permissions, fileId);
        } catch (e) {
            errorCallback(e, this.errorCode);
            return;
        }

        this.delete({
            id: fileId,
            url: this.getVersionUrl(fileId, versionId),
            successCallback,
            errorCallback,
        });
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
        successCallback: FileVersions => any,
        errorCallback: ElementsErrorCallback,
        offset: number = DEFAULT_FETCH_START,
        limit: number = DEFAULT_FETCH_END,
        fields: Array<string> = FILE_VERSIONS_FIELDS_TO_FETCH,
        shouldFetchAll: boolean = true,
    ): void {
        this.errorCode = ERROR_CODE_FETCH_VERSIONS;
        this.offsetGet(fileId, successCallback, errorCallback, offset, limit, fields, shouldFetchAll);
    }

    /**
     * API for promoting a version of a file to current
     *
     * @param {Object} options - the request options
     * @param {string} options.fileId - a box file id
     * @param {string} options.versionId - a box file version id
     * @param {BoxItemPermission} options.permissions - the permissions for the file
     * @param {Function} options.successCallback - the success callback
     * @param {Function} options.errorCallback - the error callback
     * @returns {void}
     */
    promoteVersion({
        errorCallback,
        fileId,
        permissions,
        successCallback,
        versionId,
    }: {
        errorCallback: ElementsErrorCallback,
        fileId: string,
        permissions: BoxItemPermission,
        successCallback: BoxItemVersion => any,
        versionId: string,
    }): void {
        this.errorCode = ERROR_CODE_PROMOTE_VERSION;

        try {
            this.checkApiCallValidity(PERMISSION_CAN_UPLOAD, permissions, fileId);
        } catch (e) {
            errorCallback(e, this.errorCode);
            return;
        }

        this.post({
            id: fileId,
            data: {
                data: {
                    id: versionId,
                    type: 'file_version',
                },
            },
            url: this.getVersionUrl(fileId, 'current'),
            successCallback,
            errorCallback,
        });
    }
}

export default Versions;
