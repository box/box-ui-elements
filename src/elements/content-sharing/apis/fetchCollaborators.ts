import { TYPE_FILE, TYPE_FOLDER } from '../../../constants';

import type { Collaborations } from '../../../common/types/core';
import type { FetchItemProps } from '../types';

export const fetchCollaborators = async ({ api, itemId, itemType }: FetchItemProps): Promise<Collaborations> => {
    let collabApiInstance;
    if (itemType === TYPE_FILE) {
        collabApiInstance = api.getFileCollaborationsAPI(false);
    } else if (itemType === TYPE_FOLDER) {
        collabApiInstance = api.getFolderCollaborationsAPI(false);
    }

    if (!collabApiInstance) {
        return null;
    }

    return new Promise((resolve, reject) => {
        collabApiInstance.getCollaborations(itemId, resolve, reject);
    });
};
