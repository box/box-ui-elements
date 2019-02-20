/**
 * @flow
 * @file Function to render the date table cell
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import Datefield from '../common/date';
import messages from '../common/messages';
import { FIELD_INTERACTED_AT } from '../../constants';

export default () => ({ dataKey, rowData }: { dataKey: string, rowData: BoxItem }) => {
    const { modified_at = '', interacted_at = '', modified_by }: BoxItem = rowData;
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
