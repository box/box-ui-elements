import { MessageDescriptor } from 'react-intl';
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
declare const DateValue: ({ date, format, messages, isRelative }: DateValueProps) => string;
export default DateValue;
