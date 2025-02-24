import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import DateField from '../date';
import messages from './messages';
import { VIEW_RECENTS } from '../../../constants';
import type { BoxItem } from '../../../common/types/core';

export interface ItemSubDetailsProps {
    item: BoxItem;
    view?: string;
}

const ItemSubDetails = ({ item, view }: ItemSubDetailsProps) => {
    const { modified_at = '', interacted_at = '', modified_by, size }: BoxItem = item;
    const modifiedBy: string = modified_by ? modified_by.name || '' : '';
    const isRecents: boolean = view === VIEW_RECENTS;
    const date: string = isRecents ? interacted_at || modified_at : modified_at;

    // Don't render anything if we don't have valid dates during loading
    if (!date) {
        return null;
    }

    const DateValue = <DateField date={date} omitCommas />;

    let message = messages.modifiedDateBy;
    const values = {
        date: DateValue,
        name: modifiedBy,
        size,
    };

    if (isRecents) {
        message = messages.interactedDate;
    } else if (!modifiedBy) {
        message = messages.modifiedDate;
    }

    return <FormattedMessage {...message} values={values} />;
};

export default ItemSubDetails;
