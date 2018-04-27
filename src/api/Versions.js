/**
 * @flow
 * @file Helper for the box versions API
 * @author Box
 */

import OffsetBasedAPI from './OffsetBasedAPI';

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
}

export default Versions;
