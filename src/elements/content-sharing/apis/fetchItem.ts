import { Item } from '@box/unified-share-modal';

import { TYPE_FILE, TYPE_FOLDER } from '../../../constants';
import { CONTENT_SHARING_ITEM_FIELDS } from '../constants';

import type { FetchItemProps } from '../types';

export const fetchItem = async ({ api, itemId, itemType }: FetchItemProps): Promise<Item | null> => {
    if (itemType === TYPE_FILE) {
        return new Promise((resolve, reject) => {
            api.getFileAPI().getFile(itemId, resolve, reject, { fields: CONTENT_SHARING_ITEM_FIELDS });
        });
    }

    if (itemType === TYPE_FOLDER) {
        return new Promise((resolve, reject) => {
            api.getFolderAPI().getFolderFields(itemId, resolve, reject, { fields: CONTENT_SHARING_ITEM_FIELDS });
        });
    }

    return null;
};
