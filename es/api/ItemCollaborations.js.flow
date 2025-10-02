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
     * @param {string} id - Item ID
     * @protected
     * @return {string} Base URL for collaborations
     */
    getUrl(id: string): string {
        return `getUrl(${id}) should be overridden`;
    }

    /**
     * API for fetching collaborations on a Box item
     *
     * @param {string} id - Item ID
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @param {Object} [requestData] - Optional additional request data
     * @param {number} [limit] - Max number of collaborations to return
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
     * @param {Object} data - Response data
     */
    successHandler = (data: Collaborations): void => {
        if (this.isDestroyed() || typeof this.successCallback !== 'function') {
            return;
        }

        this.successCallback(data); // defined in this.markerGet()
    };
}

export default ItemCollaborations;
