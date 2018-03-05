import React from 'react';
import { injectIntl } from 'react-intl';
import messages from '../messages';
import Datefield from '../Date';
import { VIEW_RECENTS } from '../../constants';
import type { BoxItem, View } from '../../flowTypes';

type Props = {
    item: BoxItem,
    view: View,
    intl: any
};

const ItemModified = ({ view, item, intl }: Props) => {
    const { modified_at = '', interacted_at = '', modified_by }: BoxItem = item;
    const isRecents: boolean = view === VIEW_RECENTS;
    const date: string = isRecents ? interacted_at || modified_at : modified_at;
    const modified_by_name: string = modified_by.name;
    const byLabel = intl.formatMessage(messages.by);

    return (
   		<span className='be-item-label'>
            <Datefield date={date} />&nbsp;{byLabel}&nbsp;{modified_by_name}
        </span>
    );
};

export default injectIntl(ItemModified);