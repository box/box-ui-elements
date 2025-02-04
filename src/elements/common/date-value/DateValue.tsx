import { MessageDescriptor, useIntl } from 'react-intl';

import { isToday, isYesterday } from '../../../utils/datetime';

import { DEFAULT_DATE_FORMAT } from '../constants';

import defaultMessages from './messages';

export interface DateValueProps {
    messages?: {
        default?: MessageDescriptor;
        today?: MessageDescriptor;
        yesterday?: MessageDescriptor;
    };
    date: string;
    format?: Intl.DateTimeFormatOptions;
    isRelative?: boolean;
}

const DateValue = ({ date, format = DEFAULT_DATE_FORMAT, messages = {}, isRelative = false }: DateValueProps) => {
    const { formatDate, formatMessage } = useIntl();

    const dateObject = new Date(date);
    const formattedDate = formatDate(dateObject, format);

    if (isRelative && isToday(dateObject)) {
        return formatMessage(messages.today ?? defaultMessages.today, { date: formattedDate });
    }

    if (isRelative && isYesterday(dateObject)) {
        return formatMessage(messages.yesterday ?? defaultMessages.yesterday, { date: formattedDate });
    }

    return messages.default ? formatMessage(messages.default, { date: formattedDate }) : formattedDate;
};

export default DateValue;
