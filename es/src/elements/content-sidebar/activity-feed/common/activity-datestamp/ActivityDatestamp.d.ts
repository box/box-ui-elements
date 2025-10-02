import * as React from 'react';
import { IntlConfig } from 'react-intl';
export declare const MILLISECONDS_PER_YEAR: number;
type ReadableTimeProps = {
    allowFutureTimestamps?: boolean;
    alwaysShowTime?: boolean;
    intl: IntlConfig;
    relativeThreshold?: number;
    showWeekday?: boolean;
    timestamp: number;
    uppercase?: boolean;
};
export type Props = {
    date: string | Date | number;
} & Partial<ReadableTimeProps>;
declare const ActivityDatestamp: ({ date, ...rest }: Props) => React.JSX.Element;
export default ActivityDatestamp;
