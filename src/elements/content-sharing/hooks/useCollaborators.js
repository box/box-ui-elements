// @flow

import * as React from 'react';
import API from '../../../api';
import { convertCollabsResponse } from '../../../features/unified-share-modal/utils/convertData';
import { TYPE_FILE, TYPE_FOLDER } from '../../../constants';
import type { Collaborations, ItemType } from '../../../common/types/core';
import type { collaboratorsListType } from '../../../features/unified-share-modal/flowTypes';

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
 * @param {string} ownerEmail
 * @param {boolean} isCurrentUserOwner
 * @param {Function} [handleSuccess]
 * @param {Function} [handleError]
 * @returns {collaboratorsListType | null}
 */
function useCollaborators(
    api: API,
    itemID: string,
    itemType: ItemType,
    ownerEmail: ?string,
    isCurrentUserOwner: boolean,
    handleSuccess: ?Function,
    handleError: ?Function,
): collaboratorsListType | null {
    const [collaboratorsList, setCollaboratorsList] = React.useState<collaboratorsListType | null>(null);

    React.useEffect(() => {
        if (collaboratorsList) return;

        const handleGetCollaborationsSuccess = (response: Collaborations) => {
            const updatedCollaboratorsList = convertCollabsResponse(response, ownerEmail, isCurrentUserOwner);
            setCollaboratorsList(updatedCollaboratorsList);
            if (handleSuccess) {
                handleSuccess();
            }
        };

        const handleGetCollaborationsError = () => {
            setCollaboratorsList({ collaborators: [] }); // default to an empty collaborators list for the USM
            if (handleError) {
                handleError();
            }
        };

        let collabAPIInstance;
        if (itemType === TYPE_FILE) {
            collabAPIInstance = api.getFileCollaborationsAPI(false);
        } else if (itemType === TYPE_FOLDER) {
            collabAPIInstance = api.getFolderCollaborationsAPI(false);
        }
        if (collabAPIInstance) {
            collabAPIInstance.getCollaborations(itemID, handleGetCollaborationsSuccess, handleGetCollaborationsError);
        }
    }, [api, collaboratorsList, handleError, handleSuccess, isCurrentUserOwner, itemID, itemType, ownerEmail]);

    return collaboratorsList;
}

export default useCollaborators;
