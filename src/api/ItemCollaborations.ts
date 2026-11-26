import MarkerBasedAPI from './MarkerBasedAPI';
import { DEFAULT_MAX_COLLABORATORS } from '../constants';
import type { ElementsErrorCallback } from '../common/types/api';
import type { Collaboration, Collaborations } from '../common/types/core';

/**
 * Base helper for the Box Item (File/Folder) Collaborations API.
 * Subclasses override `getUrl()` with the file or folder endpoint.
 */
class ItemCollaborations extends MarkerBasedAPI {
    /** API URL for collaborations on item `id`; subclasses must override. */
    getUrl(id: string): string {
        return `getUrl(${id}) should be overridden`;
    }

    /** Fetches all collaborations on a Box item, merging `requestData` into the query params and requesting up to `limit` collaborations per page. */
    getCollaborations = (
        id: string,
        successCallback: (data: { entries: Array<Collaboration>; next_marker: string | null | undefined }) => void,
        errorCallback: ElementsErrorCallback,
        requestData: object = {},
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

    /** Used by the MarkerBasedAPI after a successful call. */
    successHandler = (data: Collaborations): void => {
        if (this.isDestroyed() || typeof this.successCallback !== 'function') {
            return;
        }

        this.successCallback(data); // defined in this.markerGet()
    };
}

export default ItemCollaborations;
