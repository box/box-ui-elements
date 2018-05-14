/**
 * @flow
 * @file Helper for the box versions API
 * @author Box
 */

import OffsetBasedAPI from './OffsetBasedAPI';
import type { BoxItemVersion } from '../flowTypes';

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
     * @param {Object} data the api response data
     */
    successHandler = (data: any): void => {
        const { entries } = data;

        const versions = entries.reverse().map((version: BoxItemVersion, index) => ({
            id: version.id,
            type: version.type,
            action: version.trashed_at ? ACTION.delete : ACTION.upload,
            modifiedBy: version.modified_by,
            modifiedAt: version.modified_at,
            trashedAt: version.trashed_at,
            versionNumber: index + 1 // adjust for offset
        }));

        this.successCallback({
            ...data,
            entries: versions
        });
    };
}

export default Versions;
