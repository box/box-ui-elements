import { Item } from '@box/unified-share-modal';

import { TYPE_FILE, TYPE_FOLDER } from '../../../constants';
import { CONTENT_SHARING_ITEM_FIELDS } from '../constants';

import type { FetchItemProps } from '../types';

export const fetchItem = async ({ api, itemID, itemType }: FetchItemProps): Promise<Item | null> => {
    if (itemType === TYPE_FILE) {
        return new Promise((resolve, reject) => {
            api.getFileAPI().getFile(itemID, resolve, reject, { fields: CONTENT_SHARING_ITEM_FIELDS });
        });
    }

    if (itemType === TYPE_FOLDER) {
        return new Promise((resolve, reject) => {
            api.getFolderAPI().getFolderFields(itemID, resolve, reject, { fields: CONTENT_SHARING_ITEM_FIELDS });
        });
    }

    return null;
};
