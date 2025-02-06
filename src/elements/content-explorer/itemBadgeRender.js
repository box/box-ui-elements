/**
 * @flow
 * @file Function to render the badges table cell
 * @author Box
 */

import React from 'react';
import type { BoxItem } from '../../../common/types/core';
import ItemBadge from '../common/item/ItemBadge';

export default (): Function => ({ rowData }: { rowData: BoxItem }) => {

    return (
        <ItemBadge isLocked={Boolean(rowData.lock)}/>
    )
}
