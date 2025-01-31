import React from 'react';
import { useIntl } from 'react-intl';

import DateValue from '../date-value';

import { VIEW_RECENTS } from '../../../constants';

import messages from './messages';

import type { BoxItem, View } from '../../../common/types/core';

export interface ItemDateProps {
    item: BoxItem;
    view: View;
}

const ItemDate = ({ item, view }: ItemDateProps) => {
    const { interacted_at: interactedAt, modified_at: modifiedAt, modified_by: modifiedBy } = item;

    const { formatMessage } = useIntl();

    if (view === VIEW_RECENTS) {
        return (
            <DateValue
                date={interactedAt}
                isRelative
                messages={{
                    default: messages.viewedDate,
                    today: messages.viewedToday,
                    yesterday: messages.viewedYesterday,
                }}
            />
        );
    }

    if (modifiedBy?.name) {
        return formatMessage(messages.modifiedDateBy, {
            date: <DateValue date={modifiedAt} isRelative />,
            name: modifiedBy.name,
        });
    }

    return <DateValue date={modifiedAt} isRelative />;
};

export default ItemDate;
