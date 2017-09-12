/**
 * @flow
 * @file Component for the sub details for the item name
 * @author Box
 */

import React from 'react';
import getSize from '../../util/size';
import { getDate } from '../../util/date';
import { VIEW_RECENTS } from '../../constants';
import type { BoxItem, View } from '../../flowTypes';

type Props = {
    item: BoxItem,
    getLocalizedMessage: Function,
    view: View
};

const ItemSubDetails = ({ view, item, getLocalizedMessage }: Props) => {
    const { size, modified_at = '', interacted_at = '' }: BoxItem = item;
    const today: string = getLocalizedMessage('buik.date.today');
    const yesterday: string = getLocalizedMessage('buik.date.yesterday');
    const isRecents: boolean = view === VIEW_RECENTS;
    const date: string = getDate(isRecents ? interacted_at || modified_at : modified_at, today, yesterday);
    const message = isRecents ? getLocalizedMessage('buik.item.interacted') : getLocalizedMessage('buik.item.modified');

    return (
        <span>
            {`${message} ${date} - ${getSize(size)}`}
        </span>
    );
};

export default ItemSubDetails;
