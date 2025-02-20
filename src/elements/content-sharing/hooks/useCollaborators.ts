import * as React from 'react';
import noop from 'lodash/noop';
import API from '../../../api';
import { TYPE_FILE, TYPE_FOLDER } from '../../../constants';
import { Collaborations, ItemType } from '../../../common/types/core';
import { ContentSharingHooksOptions } from '../types';

/**
 * Get the item's collaborators
 *
 * A note on the wording: the USM uses the term "collaborators" internally,
 * so the state variable and state setting function also refer to "collaborators."
 * However, we are using the Collaborations API here, so the API-related functions
 * use the term "collaborations." For more details, see ./api/FileCollaborations.
 *
 * @param {API} api
 * @param {string} itemID
 * @param {ItemType} itemType
 * @param {ContentSharingHooksOptions} options
 * @returns {Collaborations | null}
 */
function useCollaborators(
    api: API,
    itemID: string,
    itemType: ItemType,
    options: ContentSharingHooksOptions,
): Collaborations | null {
    const [collaboratorsList, setCollaboratorsList] = React.useState<Collaborations | null>(null);
    const { handleSuccess = noop, handleError = noop } = options;

    React.useEffect(() => {
        if (collaboratorsList) return;

        const handleGetCollaborationsSuccess = (response: Collaborations): void => {
            setCollaboratorsList(response);
            handleSuccess(response);
        };

        const handleGetCollaborationsError = (): void => {
            setCollaboratorsList({ entries: [], next_marker: null });
            handleError();
        };

        interface CollabAPI {
            getCollaborations: (
                itemID: string,
                successCallback: (response: Collaborations) => void,
                errorCallback: () => void,
            ) => void;
        }
        let collabAPIInstance: CollabAPI | undefined;
        if (itemType === TYPE_FILE) {
            collabAPIInstance = api.getFileCollaborationsAPI(false);
        } else if (itemType === TYPE_FOLDER) {
            collabAPIInstance = api.getFolderCollaborationsAPI(false);
        }
        if (collabAPIInstance) {
            collabAPIInstance.getCollaborations(itemID, handleGetCollaborationsSuccess, handleGetCollaborationsError);
        }
    }, [api, collaboratorsList, handleError, handleSuccess, itemID, itemType]);

    return collaboratorsList;
}

export default useCollaborators;
