import * as React from 'react';
import { FormatDateOptions } from 'react-intl';
import './DateField.scss';
export interface DateFieldProps {
    capitalize?: boolean;
    date: string;
    dateFormat?: FormatDateOptions;
    omitCommas?: boolean;
    relative?: boolean;
}
declare const DateField: ({ date, dateFormat, omitCommas, relative, capitalize, }: DateFieldProps) => React.ReactNode | string;
export default DateField;
