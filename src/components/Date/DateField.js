/**
 * @flow
 * @file Function to render the date table cell
 * @author Box
 */

import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import messages from '../messages';
import { isToday, isYesterday } from '../../util/datetime';

type Props = {
    date: string,
    relative: boolean,
    intl: any
};

const DateField = ({ date, intl, relative = true }: Props) => {
    const d = new Date(date);
    if (relative && isToday(d)) {
        return <FormattedMessage {...messages.today} />;
    } else if (relative && isYesterday(d)) {
        return <FormattedMessage {...messages.yesterday} />;
    }

    const formattedDate = intl.formatDate(d, { weekday: 'short', month: 'short', year: 'numeric', day: 'numeric' });
    return (
        <span>
            {formattedDate.replace(/,/g, '')}
        </span>
    );
};

export default injectIntl(DateField);
