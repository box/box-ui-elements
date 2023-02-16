import { TYPE_FOLDER } from '../../../constants';

/* ----------------------- Helpers for ContentExplorer ---------------------------- */

export const areAllItemsActionDisabled = items => {
    return items.length > 0 ? items.every(item => item.isActionDisabled) : false;
};

export const isFolderPresent = items => {
    return items.some(item => item.type === TYPE_FOLDER);
};

export const isLoadingItems = items => {
    return items && items[0] && items[0].isLoading;
};
