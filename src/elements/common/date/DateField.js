/**
 * @flow
 * @file Function to render the date table cell
 * @author Box
 */

import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { InjectIntlProvidedProps } from 'react-intl';
import { isToday, isYesterday } from '../../../utils/datetime';
import messages from '../messages';
import './DateField.scss';

type Props = {
    capitalize?: boolean,
    date: string,
    dateFormat?: Object,
    omitCommas?: boolean,
    relative?: boolean,
} & InjectIntlProvidedProps;

const DEFAULT_DATE_FORMAT = {
    weekday: 'short',
    month: 'short',
    year: 'numeric',
    day: 'numeric',
};

const DateField = ({
    date,
    dateFormat = DEFAULT_DATE_FORMAT,
    omitCommas = false,
    intl,
    relative = true,
    capitalize = false,
}: Props) => {
    const d = new Date(date);
    const isTodaysDate = isToday(d);
    const isYesterdaysDate = isYesterday(d);

    if (relative && (isTodaysDate || isYesterdaysDate)) {
        let Message = <FormattedMessage {...messages.today} />;
        if (isYesterdaysDate) {
            Message = <FormattedMessage {...messages.yesterday} />;
        }

        if (capitalize) {
            return <span className="be-date-capitalize">{Message}</span>;
        }

        return Message;
    }

    let formattedDate = intl.formatDate(d, dateFormat);
    formattedDate = omitCommas ? formattedDate.replace(/,/g, '') : formattedDate;
    return formattedDate;
};

export default injectIntl(DateField);
