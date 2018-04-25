/**
 * @flow
 * @file Helper for the box comments API
 * @author Box
 */

import OffsetBasedAPI from './OffsetBasedAPI';
import File from './File';
import type { Comments as CommentsType } from '../flowTypes';

class Comments extends OffsetBasedAPI {
    /**
     * API URL for comments
     *
     * @param {string} [id] - a box file id
     * @return {string} base url for files
     */
    getUrl(id: string): string {
        if (!id) {
            throw new Error('Missing file id!');
        }
        return `${this.getBaseApiUrl()}/files/${id}/comments`;
    }

    /**
     * Gets the versions for a box comment
     *
     * @param {string} id - a box file id
     * @param {Function} successCallback - Function to call with results
     * @param {Function} errorCallback - Function to call with errors
     * @return {Promise}
     */
    async comments(id: string, successCallback: Function, errorCallback: Function): Promise<void> {
        if (this.isDestroyed() || !this.hasMoreItems()) {
            return Promise.reject();
        }

        const params = this.getQueryParameters();

        this.offset += this.limit;

        try {
            const { data }: { data: CommentsType } = await this.xhr.get({
                id: File.getTypedFileId(id),
                url: this.getUrl(id),
                params
            });

            if (!this.isDestroyed()) {
                this.totalCount = data.total_count;
                successCallback(data);
            }
        } catch (error) {
            if (!this.isDestroyed()) {
                errorCallback(error);
            }
        }

        return Promise.resolve();
    }
}

export default Comments;
