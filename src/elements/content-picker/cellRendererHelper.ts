/**
 * @file Function to filter cells from being selected
 * @author Box
 */

import { TYPE_FILE } from '../../constants';
import { BoxItem } from '../../common/types/core';

function isRowSelectable(
    selectableType: string,
    extensionsWhitelist: string[],
    hasHitSelectionLimit: boolean,
    rowData: BoxItem,
): boolean {
    const { type, extension = '', selected } = rowData;
    const shouldAllowSelection = hasHitSelectionLimit ? !!selected : true;
    const isTypeSelectable = !!type && selectableType.indexOf(type) > -1;
    const isFilePicker = selectableType.indexOf(TYPE_FILE) > -1;
    const isExtensionWhitelisted =
        isFilePicker && extensionsWhitelist.length ? extensionsWhitelist.indexOf(extension) > -1 : true;

    return shouldAllowSelection && isTypeSelectable && isExtensionWhitelisted;
}

export default isRowSelectable;
