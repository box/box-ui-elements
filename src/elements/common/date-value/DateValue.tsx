import { useIntl } from 'react-intl';

import { isToday, isYesterday } from '../../../utils/datetime';

import { DEFAULT_DATE_FORMAT } from '../constants';

import messages from './messages';

export interface DateValueProps {
    date: string;
    format?: Intl.DateTimeFormatOptions;
    isRelative?: boolean;
}

const DateValue = ({ date, format = DEFAULT_DATE_FORMAT, isRelative = false }: DateValueProps) => {
    const { formatDate, formatMessage } = useIntl();
    const dateObject = new Date(date);

    if (isRelative && isToday(dateObject)) {
        return formatMessage(messages.today);
    }

    if (isRelative && isYesterday(dateObject)) {
        return formatMessage(messages.yesterday);
    }

    return formatDate(dateObject, format);
};

export default DateValue;
