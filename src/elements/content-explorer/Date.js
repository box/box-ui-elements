// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Datefield from '../common/date';
import messages from '../common/messages';
import { FIELD_INTERACTED_AT } from '../../constants';
import type { BoxItem } from '../../common/types/core';

type Props = {
    dataKey: string,
    item: BoxItem,
};

const Date = ({ dataKey, item }: Props) => {
    const { modified_at = '', interacted_at = '', modified_by }: BoxItem = item;
    const modifiedBy: string = modified_by ? modified_by.name || '' : '';
    const isRecents: boolean = dataKey === FIELD_INTERACTED_AT;
    const date: string = isRecents ? interacted_at || modified_at : modified_at;
    const DateValue = <Datefield capitalize date={date} omitCommas />;

    if (isRecents || !modifiedBy) {
        return DateValue;
    }

    return (
        <FormattedMessage
            {...messages.nameDate}
            values={{
                date: DateValue,
                name: modifiedBy,
            }}
        />
    );
};
export default Date;
