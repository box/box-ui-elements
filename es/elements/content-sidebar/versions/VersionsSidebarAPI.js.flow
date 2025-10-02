/**
 * @flow
 * @file Versions Sidebar API Helper
 * @author Box
 */
import API from '../../../api';
import { FILE_VERSION_FIELDS_TO_FETCH, FILE_VERSION_FIELDS_TO_FETCH_ARCHIVE } from '../../../utils/fields';
import type { BoxItem, FileVersions, BoxItemVersion } from '../../../common/types/core';

export type fetchPayload = [BoxItem, FileVersions];

export default class VersionsSidebarAPI {
    api: API;

    fileId: string;

    isArchiveFeatureEnabled: boolean;

    constructor({
        api,
        fileId,
        isArchiveFeatureEnabled,
    }: {
        api: API,
        fileId: string,
        isArchiveFeatureEnabled: boolean,
    }) {
        this.api = api;
        this.fileId = fileId;
        this.isArchiveFeatureEnabled = isArchiveFeatureEnabled;
    }

    fetchData = (): Promise<fetchPayload> => {
        return Promise.all([this.fetchFile(), this.fetchVersions()]).then(this.fetchVersionCurrent);
    };

    fetchDownloadUrl = (version: ?BoxItemVersion): Promise<string> => {
        return new Promise((resolve, reject) => {
            if (!version) {
                return reject(new Error('Could not find requested version'));
            }

            return this.api.getFileAPI().getDownloadUrl(this.fileId, version, resolve, reject);
        });
    };

    fetchFile = (): Promise<BoxItem> => {
        const fields = this.isArchiveFeatureEnabled
            ? FILE_VERSION_FIELDS_TO_FETCH_ARCHIVE
            : FILE_VERSION_FIELDS_TO_FETCH;

        return new Promise((resolve, reject) =>
            this.api.getFileAPI().getFile(this.fileId, resolve, reject, {
                fields,
                forceFetch: true,
            }),
        );
    };

    fetchVersions = (): Promise<FileVersions> => {
        return new Promise((resolve, reject) =>
            this.api.getVersionsAPI(false).getVersions(this.fileId, resolve, reject),
        );
    };

    fetchVersionCurrent = ([fileResponse, versionsResponse]: fetchPayload): Promise<fetchPayload> => {
        const { file_version = {} } = fileResponse;

        return new Promise((resolve, reject) =>
            this.api.getVersionsAPI(false).getVersion(
                this.fileId,
                file_version.id,
                (currentVersionResponse: BoxItemVersion) => {
                    resolve([
                        fileResponse,
                        this.api
                            .getVersionsAPI(false)
                            .addCurrentVersion(currentVersionResponse, versionsResponse, fileResponse),
                    ]);
                },
                reject,
            ),
        );
    };

    fetchVersion = (versionId: string): Promise<BoxItemVersion> => {
        return new Promise((resolve, reject) =>
            this.api.getVersionsAPI(false).getVersion(this.fileId, versionId, resolve, reject),
        );
    };

    deleteVersion = (version: ?BoxItemVersion): Promise<null> => {
        const { id: versionId, permissions = {} } = version || {};

        return new Promise((resolve, reject) =>
            this.api.getVersionsAPI(false).deleteVersion({
                fileId: this.fileId,
                permissions,
                successCallback: resolve,
                errorCallback: reject,
                versionId,
            }),
        );
    };

    promoteVersion = (version: ?BoxItemVersion): Promise<BoxItemVersion> => {
        const { id: versionId, permissions = {} } = version || {};

        return new Promise((resolve, reject) =>
            this.api.getVersionsAPI(false).promoteVersion({
                fileId: this.fileId,
                permissions,
                successCallback: resolve,
                errorCallback: reject,
                versionId,
            }),
        );
    };

    restoreVersion = (version: ?BoxItemVersion): Promise<any> => {
        const { id: versionId, permissions = {} } = version || {};

        return new Promise((resolve, reject) =>
            this.api.getVersionsAPI(false).restoreVersion({
                fileId: this.fileId,
                permissions,
                successCallback: resolve,
                errorCallback: reject,
                versionId,
            }),
        );
    };
}
