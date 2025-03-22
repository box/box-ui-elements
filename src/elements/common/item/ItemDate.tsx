import React from 'react';
import { useIntl } from 'react-intl';

import DateValue from '../date-value';

import { VIEW_RECENTS } from '../../../constants';

import messages from './messages';

import type { BoxItem, View } from '../../../common/types/core';

export interface ItemDateProps {
    isSmall?: boolean;
    item: BoxItem;
    view: View;
}

const ItemDate = ({ isSmall, item, view }: ItemDateProps) => {
    const { interacted_at: interactedAt, modified_at: modifiedAt, modified_by: modifiedBy } = item;

    const { formatMessage } = useIntl();

    if (view === VIEW_RECENTS) {
        return (
            <DateValue
                date={interactedAt || modifiedAt}
                isRelative
                messages={{
                    default: messages.viewedDate,
                    today: messages.viewedToday,
                    yesterday: messages.viewedYesterday,
                }}
            />
        );
    }

    if (!isSmall && modifiedBy?.name) {
        return formatMessage(messages.modifiedDateBy, {
            date: <DateValue date={modifiedAt} isRelative />,
            name: modifiedBy.name,
        });
    }

    return <DateValue date={modifiedAt} isRelative />;
};

export default ItemDate;
