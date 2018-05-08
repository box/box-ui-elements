/**
 * @flow
 * @file Helper for the box metadata related API
 * @author Box
 */

import File from './File';
import { HEADER_CONTENT_TYPE } from '../constants';
import { getBadItemError, getBadPermissionsError } from '../util/error';
import { getTypedFileId } from '../util/file';
import type { BoxItem, JsonPatchData } from '../flowTypes';

class Metadata extends File {
    /**
     * API URL metadata
     *
     * @param {string} id - a box file id
     * @param {string} field - metadata field
     * @return {string} base url for files
     */
    getMetadataUrl(id: string, field: string): string {
        if (!field.startsWith('metadata')) {
            throw new Error('Metadata field should start with metadata');
        }
        return `${this.getUrl(id)}/${field.replace(/\./g, '/')}`;
    }

    /**
     * API for patching metadata on file
     *
     * @param {BoxItem} file - File object for which we are changing the description
     * @param {string} field - Metadata field to patch
     * @param {Array} operations - Array of JSON patch operations
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @return {Promise}
     */
    async patch(
        file: BoxItem,
        field: string,
        operations: JsonPatchData,
        successCallback: Function,
        errorCallback: Function
    ): Promise<void> {
        const { id, permissions } = file;
        if (!id || !permissions) {
            errorCallback(getBadItemError());
            return;
        }

        if (!permissions.can_upload) {
            errorCallback(getBadPermissionsError());
            return;
        }

        this.successCallback = successCallback;
        this.errorCallback = errorCallback;

        try {
            const metadata = await this.xhr.put({
                url: this.getMetadataUrl(id, field),
                headers: { [HEADER_CONTENT_TYPE]: 'application/json-patch+json' },
                id: getTypedFileId(id),
                data: operations
            });
            if (!this.isDestroyed()) {
                const updatedFile = this.merge(this.getCacheKey(id), field, metadata.data);
                this.successHandler(updatedFile);
            }
        } catch (e) {
            this.errorHandler(e);
        }
    }
}

export default Metadata;
