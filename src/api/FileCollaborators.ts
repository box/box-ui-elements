import MarkerBasedAPI from './MarkerBasedAPI';
import { DEFAULT_MAX_COLLABORATORS } from '../constants';
import type { ElementsErrorCallback } from '../common/types/api';
import type { SelectorItem, SelectorItems, UserMini, GroupMini } from '../common/types/core';

type CollaboratorsAPIResponse = {
    entries: Array<GroupMini | UserMini>;
    next_marker: string | null | undefined;
};

type CollaboratorsSuccessCallback = (data: {
    entries: Array<SelectorItem<UserMini | GroupMini>>;
    next_marker: string | null | undefined;
}) => void;

/** Helper for the Box File Collaborators API. */
class FileCollaborators extends MarkerBasedAPI {
    /** API URL for collaborators on the Box file `id`; throws when `id` is missing. */
    getUrl(id: string): string {
        if (!id) {
            throw new Error('Missing file id!');
        }

        return `${this.getBaseApiUrl()}/files/${id}/collaborators`;
    }

    /** Transforms the API response entries into mention selector items. */
    successHandler = (data: CollaboratorsAPIResponse): void => {
        if (this.isDestroyed() || typeof this.successCallback !== 'function') {
            return;
        }

        // Transform into "mention selector" format:
        const collaboratorSelectorItems: SelectorItems<UserMini | GroupMini> = data.entries.map(
            (collab: UserMini | GroupMini) => {
                let item;
                if (collab.type === 'group') {
                    item = collab;
                } else {
                    item = collab; // assigned after narrowing so `item` is typed as UserMini
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

    /** Fetches collaborators on a file, merging `requestData` into the query params and requesting up to `limit` collaborators per page. */
    getFileCollaborators(
        id: string,
        successCallback: CollaboratorsSuccessCallback,
        errorCallback: ElementsErrorCallback,
        requestData: object = {},
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
     * Fetches file @mention's filtered by `searchStr`; does nothing when `searchStr` is empty or blank.
     * `includeGroups` also returns groups; `respectHiddenCollabs` is sent as `respect_hidden_collabs`.
     */
    getCollaboratorsWithQuery = (
        fileId: string,
        successCallback: CollaboratorsSuccessCallback,
        errorCallback: ElementsErrorCallback,
        searchStr: string,
        {
            includeGroups = false,
            respectHiddenCollabs = false,
        }: { includeGroups?: boolean; respectHiddenCollabs?: boolean } = {},
    ): void => {
        // Do not fetch without filter
        if (!searchStr || searchStr.trim() === '') {
            return;
        }

        this.getFileCollaborators(fileId, successCallback, errorCallback, {
            filter_term: searchStr,
            include_groups: includeGroups,
            include_uploader_collabs: false,
            respect_hidden_collabs: respectHiddenCollabs,
        });
    };
}

export default FileCollaborators;
