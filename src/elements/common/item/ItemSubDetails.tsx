import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import getSize from '../../../utils/size';
import DateField from '../date';
import { VIEW_RECENTS } from '../../../constants';
import type { View, BoxItem } from '../../../common/types/core';

import messages from '../messages';
import './ItemSubDetails.scss';

export interface ItemSubDetailsProps {
    item: BoxItem;
    view: View;
}

const ItemSubDetails = ({ item, view }: ItemSubDetailsProps) => {
    const { modified_at = '', interacted_at = '', modified_by, size }: BoxItem = item;
    const modifiedBy: string = modified_by ? modified_by.name || '' : '';
    const isRecents: boolean = view === VIEW_RECENTS;
    const date: string = isRecents ? interacted_at || modified_at : modified_at;
    if (!date) return null;
    const DateValue = <DateField date={date} omitCommas />;

    let message = messages.modifiedDateBy;
    if (isRecents) {
        message = messages.interactedDate;
    } else if (!modifiedBy) {
        message = messages.modifiedDate;
    }

    return (
        <span>
            <span className="bdl-ItemSubDetails-modifiedBy">
                <FormattedMessage
                    {...message}
                    values={{
                        date: DateValue,
                        name: modifiedBy,
                    }}
                />
            </span>
            <span className="bdl-ItemSubDetails-size">{getSize(size)}</span>
        </span>
    );
};

export default ItemSubDetails;
