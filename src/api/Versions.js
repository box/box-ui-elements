/**
 * @flow
 * @file Helper for the box versions API
 * @author Box
 */

import OffsetBasedAPI from './OffsetBasedAPI';

const ACTION = {
    upload: 'upload',
    delete: 'delete',
    restore: 'restore'
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
     * @param {Object} response the api response data
     * @return {Object} the formatted api response data
     */
    formatResponse(response: Object): Object {
        const { entries } = response;

        const formattedEntries = entries.reverse().map((version, index) => {
            let action = ACTION.upload;
            if (version.trashed_at) {
                action = ACTION.delete;
            }

            return {
                versionNumber: index + 1, // adjust for offset
                action,
                modifiedBy: version.modified_by,
                modifiedAt: version.modified_at,
                trashedAt: version.trashed_at,
                ...version
            };
        });

        return {
            ...response,
            entries: formattedEntries
        };
    }
}

export default Versions;
