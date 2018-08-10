/**
 * @flow
 * @file Helper for the box versions API
 * @author Box
 */

import OffsetBasedAPI from './OffsetBasedAPI';

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
    successHandler = (data: any): void => {
        if (this.isDestroyed() || typeof this.successCallback !== 'function') {
            return;
        }

        const { entries } = data;
        const versions = entries.map((version: BoxItemVersion) => ({
            ...version,
            action: version.trashed_at ? ACTION.delete : ACTION.upload,
        }));

        this.successCallback({ ...data, entries: versions });
    };
}

export default Versions;
