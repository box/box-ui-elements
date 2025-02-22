import * as React from 'react';
import { useIntl } from 'react-intl';
import { VIEW_RECENTS } from '../../../constants';
import type { BoxItem } from '../../../common/types/core';

export interface ItemDateProps {
    item: BoxItem;
    view?: string;
}

const ItemDate = ({ item, view }: ItemDateProps) => {
    const { formatMessage } = useIntl();
    const { interacted_at: interactedAt, modified_at: modifiedAt = '' } = item;

    if (view === VIEW_RECENTS) {
        return (
            <span>
                {formatMessage(
                    {
                        id: 'boxui.itemDate.interactedDate',
                        defaultMessage: 'Interacted {interactedDate}',
                        description: 'Text for interacted date with interacted prefix',
                    },
                    {
                        interactedDate: interactedAt,
                    },
                )}
            </span>
        );
    }

    return (
        <span>
            {formatMessage(
                {
                    id: 'boxui.itemDate.modifiedDate',
                    defaultMessage: 'Modified {date}',
                    description: 'Text for modified date with modified prefix',
                },
                {
                    date: modifiedAt,
                },
            )}
        </span>
    );
};

export default ItemDate;
