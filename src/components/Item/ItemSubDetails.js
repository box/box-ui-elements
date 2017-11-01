/**
 * @flow
 * @file Component for the sub details for the item name
 * @author Box
 */

import React from 'react';
import { injectIntl } from 'react-intl';
import messages from '../messages';
import getSize from '../../util/size';
import Datefield from '../Date';
import { VIEW_RECENTS } from '../../constants';
import type { BoxItem, View } from '../../flowTypes';

type Props = {
    item: BoxItem,
    view: View,
    intl: any
};

const ItemSubDetails = ({ view, item, intl }: Props) => {
    const { size, modified_at = '', interacted_at = '' }: BoxItem = item;
    const isRecents: boolean = view === VIEW_RECENTS;
    const date: string = isRecents ? interacted_at || modified_at : modified_at;
    const message = isRecents ? intl.formatMessage(messages.interacted) : intl.formatMessage(messages.modified);

    return (
        <span>
            <span>
                {message}&nbsp;
            </span>
            <Datefield date={date} />
            <span>
                &nbsp;-&nbsp;{getSize(size)}
            </span>
        </span>
    );
};

export default injectIntl(ItemSubDetails);
