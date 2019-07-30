/**
 * @flow
 * @file Component for the sub details for the item name
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import getSize from '../../../utils/size';
import Datefield from '../date';
import messages from '../messages';
import { VIEW_RECENTS } from '../../../constants';
import './ItemSubDetails.scss';

type Props = {
    item: BoxItem,
    view: View,
};

const ItemSubDetails = ({ item, view }: Props) => {
    const { modified_at = '', interacted_at = '', modified_by }: BoxItem = item;
    const modifiedBy: string = modified_by ? modified_by.name || '' : '';
    const isRecents: boolean = view === VIEW_RECENTS;
    const date: string = isRecents ? interacted_at || modified_at : modified_at;
    const { size }: BoxItem = item;
    const DateValue = <Datefield date={date} omitCommas />;

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
