/**
 * @flow
 * @file Component for the sub details for the item name
 * @author Box
 */

import React from 'react';
import getSize from '../../util/size';
import getDate from '../../util/date';
import type { BoxItem } from '../../flowTypes';

type Props = {
    item: BoxItem,
    getLocalizedMessage: Function
};

const ItemSubDetails = ({ item, getLocalizedMessage }: Props) => {
    const { size, modified_at = '' }: BoxItem = item;
    const today: string = getLocalizedMessage('buik.date.today');
    const yesterday: string = getLocalizedMessage('buik.date.yesterday');
    const date: string = getDate(modified_at, today, yesterday);
    return (
        <span>
            {`${getLocalizedMessage('buik.item.modified')} ${date} - ${getSize(size)}`}
        </span>
    );
};

export default ItemSubDetails;
