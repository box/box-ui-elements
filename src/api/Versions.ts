import getProp from 'lodash/get';
import { FILE_VERSIONS_FIELDS_TO_FETCH } from '../utils/fields';
import OffsetBasedAPI from './OffsetBasedAPI';
import {
    DEFAULT_FETCH_END,
    DEFAULT_FETCH_START,
    ERROR_CODE_DELETE_VERSION,
    ERROR_CODE_FETCH_VERSION,
    ERROR_CODE_FETCH_VERSIONS,
    ERROR_CODE_PROMOTE_VERSION,
    ERROR_CODE_RESTORE_VERSION,
    PERMISSION_CAN_DELETE,
    PERMISSION_CAN_UPLOAD,
} from '../constants';
import type { ElementsErrorCallback } from '../common/types/api';
import type { BoxItem, FileVersions, BoxItemVersionPermission, BoxItemVersion } from '../common/types/core';

class Versions extends OffsetBasedAPI {
    /** Base URL for the versions of file `id`. Throws when `id` is missing. */
    getUrl(id: string): string {
        if (!id) {
            throw new Error('Missing file id!');
        }

        return `${this.getBaseApiUrl()}/files/${id}/versions`;
    }

    /** URL for version `versionId` of file `id`. Throws when either id is missing. */
    getVersionUrl(id: string, versionId: string): string {
        if (!versionId) {
            throw new Error('Missing version id!');
        }

        return `${this.getUrl(id)}/${versionId}`;
    }

    /** Calls `successCallback` with the versions response data when the instance is not destroyed. */
    successHandler = (data: FileVersions): void => {
        if (this.isDestroyed() || typeof this.successCallback !== 'function') {
            return;
        }

        this.successCallback(data);
    };

    /**
     * Adds the parent file's `can_upload` permission to each version, without overriding
     * permissions already on the version. Returns `versions` as-is when it is null or undefined.
     */
    addPermissions(versions: FileVersions | null | undefined, file: BoxItem): FileVersions | null | undefined {
        if (!versions) {
            return versions;
        }

        // Versions defer to the parent file for upload (promote) permissions
        const { entries, total_count } = versions;
        const can_upload = getProp(file, ['permissions', PERMISSION_CAN_UPLOAD], false);

        return {
            entries: entries.map(({ permissions, ...version }) => ({
                ...version,
                permissions: { can_upload, ...permissions },
            })),
            total_count,
        };
    }

    /** Deletes version `versionId` of file `fileId`. Calls `errorCallback` without a request unless `can_delete` is set. */
    deleteVersion({
        errorCallback,
        fileId,
        permissions,
        successCallback,
        versionId,
    }: {
        errorCallback: ElementsErrorCallback;
        fileId: string;
        permissions: BoxItemVersionPermission;
        successCallback: (data: null) => unknown;
        versionId: string;
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
     * Fetches versions of file `fileId` starting at `offset`. When `shouldFetchAll` is true,
     * keeps fetching pages of `limit` versions until all are loaded.
     */
    getVersions(
        fileId: string,
        successCallback: (versions: FileVersions) => unknown,
        errorCallback: ElementsErrorCallback,
        offset: number = DEFAULT_FETCH_START,
        limit: number = DEFAULT_FETCH_END,
        fields: Array<string> = FILE_VERSIONS_FIELDS_TO_FETCH,
        shouldFetchAll: boolean = true,
    ): void {
        this.errorCode = ERROR_CODE_FETCH_VERSIONS;
        this.offsetGet(fileId, successCallback, errorCallback, offset, limit, fields, shouldFetchAll);
    }

    /** Fetches version `fileVersionId` of file `fileId`. */
    getVersion(
        fileId: string,
        fileVersionId: string,
        successCallback: (version: BoxItemVersion) => void,
        errorCallback: ElementsErrorCallback,
    ): void {
        this.errorCode = ERROR_CODE_FETCH_VERSION;

        this.get({
            id: fileId,
            successCallback,
            errorCallback,
            url: this.getVersionUrl(fileId, fileVersionId),
            requestData: {
                params: {
                    fields: FILE_VERSIONS_FIELDS_TO_FETCH.toString(),
                },
            },
        });
    }

    /**
     * Appends `currentVersion` to `versions`, setting its `version_promoted` when the file was
     * restored from one of those versions. Mutates `currentVersion`.
     */
    addCurrentVersion(
        currentVersion: BoxItemVersion | null | undefined,
        versions: FileVersions | null | undefined,
        file: BoxItem,
    ): FileVersions {
        if (!currentVersion) {
            return versions || { entries: [], total_count: 0 };
        }

        if (!versions) {
            return { entries: [currentVersion], total_count: 1 };
        }

        const promotedFromId = getProp(file, 'restored_from.id');
        const promotedVersion = versions.entries.find(version => version.id === promotedFromId);

        if (promotedVersion) {
            currentVersion.version_promoted = promotedVersion.version_number;
        }

        return { entries: [...versions.entries, currentVersion], total_count: versions.total_count + 1 };
    }

    /** Promotes version `versionId` to the current version of file `fileId`. Calls `errorCallback` unless `can_upload` is set. */
    promoteVersion({
        errorCallback,
        fileId,
        permissions,
        successCallback,
        versionId,
    }: {
        errorCallback: ElementsErrorCallback;
        fileId: string;
        permissions: BoxItemVersionPermission;
        successCallback: (version: BoxItemVersion) => unknown;
        versionId: string;
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

    /** Restores deleted version `versionId` of file `fileId` by clearing `trashed_at`. Calls `errorCallback` unless `can_delete` is set. */
    restoreVersion({
        errorCallback,
        fileId,
        permissions,
        successCallback,
        versionId,
    }: {
        errorCallback: ElementsErrorCallback;
        fileId: string;
        permissions: BoxItemVersionPermission;
        successCallback: (version: BoxItemVersion) => unknown;
        versionId: string;
    }): void {
        this.errorCode = ERROR_CODE_RESTORE_VERSION;

        try {
            this.checkApiCallValidity(PERMISSION_CAN_DELETE, permissions, fileId);
        } catch (e) {
            errorCallback(e, this.errorCode);
            return;
        }

        this.put({
            id: fileId,
            data: {
                data: {
                    trashed_at: null,
                },
            },
            url: this.getVersionUrl(fileId, versionId),
            successCallback,
            errorCallback,
        });
    }
}

export default Versions;
