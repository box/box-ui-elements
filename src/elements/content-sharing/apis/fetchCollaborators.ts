import { TYPE_FILE, TYPE_FOLDER } from '../../../constants';

import type { Collaborations } from '../../../common/types/core';
import type { FetchItemProps } from '../types';

export const fetchCollaborators = async ({ api, itemID, itemType }: FetchItemProps): Promise<Collaborations> => {
    let collabAPIInstance;
    if (itemType === TYPE_FILE) {
        collabAPIInstance = api.getFileCollaborationsAPI(false);
    } else if (itemType === TYPE_FOLDER) {
        collabAPIInstance = api.getFolderCollaborationsAPI(false);
    }

    if (!collabAPIInstance) {
        return null;
    }

    return new Promise((resolve, reject) => {
        collabAPIInstance.getCollaborations(itemID, resolve, reject);
    });
};
