/**
 * @flow
 * @file Helper for the box collaborators API
 * @author Box
 */

import MarkerBasedAPI from './MarkerBasedAPI';
import { DEFAULT_MAX_COLLABORATORS } from '../constants';
import type { ElementsErrorCallback } from '../common/types/api';
import type { SelectorItem, SelectorItems, UserMini, GroupMini } from '../common/types/core';

type CollaboratorsAPIResponse = {
    entries: Array<GroupMini | UserMini>,
    next_marker: ?string,
};

class FileCollaborators extends MarkerBasedAPI {
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

        return `${this.getBaseApiUrl()}/files/${id}/collaborators`;
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
     * API for fetching collaborators on a file
     *
     * @param {string} id - the file id
     * @param {Function} successCallback - the success callback
     * @param {Function} errorCallback - the error callback
     * @param {Object} requestData - any additional request data
     * @param {number} limit - the max number of collaborators to return
     * @returns {void}
     */
    getFileCollaborators(
        id: string,
        successCallback: ({ entries: Array<SelectorItem<UserMini | GroupMini>>, next_marker: ?string }) => void,
        errorCallback: ElementsErrorCallback,
        requestData: Object = {},
        limit: number = DEFAULT_MAX_COLLABORATORS,
    ): void {
        // NOTE: successCallback is called with the result
        // of this.successHandler, not the API response!
        this.markerGet({
            id,
            limit,
            successCallback,
            errorCallback,
            requestData,
        });
    }

    /**
     * Fetches file @mention's
     *
     * @oaram {string} fileId
     * @param {Function} successCallback
     * @param {Function} errorCallback
     * @param {string} searchStr - Search string to filter file collaborators by
     * @param {Object} [options]
     * @param {boolean} [options.includeGroups] - return groups as well as users
     * @return {void}
     */
    getCollaboratorsWithQuery = (
        fileId: string,
        successCallback: ({ entries: Array<SelectorItem<UserMini | GroupMini>>, next_marker: ?string }) => void,
        errorCallback: ElementsErrorCallback,
        searchStr: string,
        { includeGroups = false }: { includeGroups: boolean } = {},
    ) => {
        // Do not fetch without filter
        if (!searchStr || searchStr.trim() === '') {
            return;
        }

        this.getFileCollaborators(fileId, successCallback, errorCallback, {
            filter_term: searchStr,
            include_groups: includeGroups,
            include_uploader_collabs: false,
        });
    };
}

export default FileCollaborators;
