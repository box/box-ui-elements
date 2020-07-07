/**
 * @flow
 * @file Helper for the Box Item (File/Folder) Collaborations API
 * @author Box
 */

import MarkerBasedAPI from './MarkerBasedAPI';
import { DEFAULT_MAX_COLLABORATORS } from '../constants';
import type { ElementsErrorCallback } from '../common/types/api';
import type { Collaboration, Collaborations } from '../common/types/core';

class ItemCollaborations extends MarkerBasedAPI {
    /**
     * API URL for collaborations
     *
     * @param {string} id - Item id
     * @protected
     * @return {string} Base url for collaborations
     */
    getUrl(id: string): string {
        return `getUrl(${id}) should be overriden`;
    }

    /**
     * API for fetching collaborations on a folder
     *
     * @param {string} id - the folder id
     * @param {Function} successCallback - the success callback
     * @param {Function} errorCallback - the error callback
     * @param {Object} requestData - any additional request data
     * @param {number} limit - the max number of collaborations to return
     * @returns {void}
     */
    getCollaborations = (
        id: string,
        successCallback: ({ entries: Array<Collaboration>, next_marker: ?string }) => void,
        errorCallback: ElementsErrorCallback,
        requestData: Object = {},
        limit: number = DEFAULT_MAX_COLLABORATORS,
    ): void => {
        this.markerGet({
            id,
            limit,
            successCallback,
            errorCallback,
            requestData,
        });
    };

    /**
     * Used by the MarkerBasedAPI after a successful call
     *
     * @param {Object} data the response data
     */
    successHandler = (data: Collaborations): void => {
        if (this.isDestroyed() || typeof this.successCallback !== 'function') {
            return;
        }

        this.successCallback(data);
    };
}

export default ItemCollaborations;
