import * as React from 'react';
import { IntlConfig } from 'react-intl';
// @ts-ignore flow import
import ReadableTime from '../../../../../components/time/ReadableTime';

export const MILLISECONDS_PER_YEAR = 365 * 24 * 60 * 60 * 1000; // 365 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds

// TODO: duplicated ReadableTime props until it migrates to typescript
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

const ActivityDatestamp = ({ date, ...rest }: Props) => {
    const now = new Date().getTime();
    const dateInMs = new Date(date).getTime();
    // Only show time if activity time is within the last year
    const showTime = now - dateInMs < MILLISECONDS_PER_YEAR;
    return <ReadableTime timestamp={dateInMs} alwaysShowTime={showTime} relativeThreshold={0} {...rest} />;
};

export default ActivityDatestamp;
