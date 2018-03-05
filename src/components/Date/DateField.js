/**
 * @flow
 * @file Function to render the date table cell
 * @author Box
 */

import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import messages from '../messages';
import { isToday, isYesterday } from '../../util/datetime';
import './DateField.scss';

type Props = {
    date: string,
    relative: boolean,
    capitalize: boolean,
    intl: any
};

const DateField = ({ date, intl, relative = true, capitalize = false }: Props) => {
    const d = new Date(date);
    const isTodaysDate = isToday(d);
    const isYesterdaysDate = isYesterday(d);

    if (relative && (isTodaysDate || isYesterdaysDate)) {
        let Message = <FormattedMessage {...messages.today} />;
        if (isYesterdaysDate) {
            Message = <FormattedMessage {...messages.yesterday} />;
        }
        if (capitalize) {
            return <span className='be-date-capitalize'>{Message}</span>;
        }
        return Message;
    }

    const formattedDate = intl.formatDate(d, { weekday: 'short', month: 'short', year: 'numeric', day: 'numeric' });
    return <span>{formattedDate.replace(/,/g, '')}</span>;
};

export default injectIntl(DateField);
