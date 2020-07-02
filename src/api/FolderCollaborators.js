/**
 * @flow
 * @file Helper for the Box collaborators API
 * @author Box
 */

import MarkerBasedAPI from 'box-ui-elements/es/api/MarkerBasedAPI';
import { DEFAULT_MAX_COLLABORATORS } from 'box-ui-elements/es/constants';
import type { ElementsErrorCallback } from 'box-ui-elements/es/common/types/api';
import type { SelectorItem, SelectorItems, UserMini, GroupMini } from 'box-ui-elements/es/common/types/core';

type CollaboratorsAPIResponse = {
    entries: Array<GroupMini | UserMini>,
    next_marker: ?string,
};

class FolderCollaborators extends MarkerBasedAPI {
    /**
     * API URL for comments
     *
     * @param {string} [id] - a Box folder id
     * @return {string} base url for folders
     */
    getUrl(id: string): string {
        if (!id) {
            throw new Error('Missing folder id!');
        }

        return `${this.getBaseApiUrl()}/folders/${id}/collaborations`;
    }

    /**
     * Transform result of API response
     *
     * @param {Object} data the response data
     */
    successHandler = (data: CollaboratorsAPIResponse): void => {
        if (this.isDestroyed() || typeof this.successCallback !== 'function') {
            return;
        }

        // Transform into "mention selector" format:
        const collaboratorSelectorItems: SelectorItems<UserMini | GroupMini> = data.entries.map(
            (collab: UserMini | GroupMini) => {
                let item;
                if (collab.type === 'group') {
                    item = collab; // flow needs assignment to happen after type refinement
                } else {
                    item = collab;
                    item.email = item.login; // transform user object
                }
                return {
                    id: collab.id,
                    name: collab.name,
                    item,
                };
            },
        );

        this.successCallback({ ...data, entries: collaboratorSelectorItems });
    };

    /**
     * API for fetching collaborators on a folder
     *
     * @param {string} id - the folder id
     * @param {Function} successCallback - the success callback
     * @param {Function} errorCallback - the error callback
     * @param {Object} requestData - any additional request data
     * @param {number} limit - the max number of collaborators to return
     * @returns {void}
     */
    getFolderCollaborators = (
        id: string,
        successCallback: ({ entries: Array<SelectorItem<UserMini | GroupMini>>, next_marker: ?string }) => void,
        errorCallback: ElementsErrorCallback,
        requestData: Object = {},
        limit: number = DEFAULT_MAX_COLLABORATORS,
    ): void => {
        // NOTE: successCallback is called with the result
        // of this.successHandler, not the API response!
        this.markerGet({
            id,
            limit,
            successCallback,
            errorCallback,
            requestData,
        });
    };
}

export default FolderCollaborators;
