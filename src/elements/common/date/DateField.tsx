// @deprecated, use DateValue component
import * as React from 'react';
import { FormatDateOptions, FormattedMessage, useIntl } from 'react-intl';
import { isToday, isYesterday } from '../../../utils/datetime';

import messages from '../messages';
import './DateField.scss';

const DEFAULT_DATE_FORMAT = {
    weekday: 'short',
    month: 'short',
    year: 'numeric',
    day: 'numeric',
} as const;

export interface DateFieldProps {
    capitalize?: boolean;
    date: string;
    dateFormat?: FormatDateOptions;
    omitCommas?: boolean;
    relative?: boolean;
}

// This component has internationalization concerns, e.g. comma removal, capitalization
const DateField = ({
    date,
    dateFormat = DEFAULT_DATE_FORMAT,
    omitCommas = false,
    relative = true,
    capitalize = false,
}: DateFieldProps): React.ReactNode | string => {
    const { formatDate } = useIntl();
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

    let formattedDate = formatDate(d, dateFormat);
    formattedDate = omitCommas ? formattedDate.replace(/,/g, '') : formattedDate;
    return formattedDate;
};

export default DateField;
