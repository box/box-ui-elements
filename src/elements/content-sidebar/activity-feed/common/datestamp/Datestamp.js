// @flow
import * as React from 'react';
import ReadableTime from '../../../../../components/time/ReadableTime';
import { MILLISECONDS_PER_YEAR } from '../../../../../constants';
import type { ISODate } from '../../../../../common/types/core';

export type Props = {
    date: ISODate | Date | number,
};

const Datestamp = ({ date, ...rest }: Props) => {
    const now = new Date().getTime();
    const dateInMs = new Date(date).getTime();
    // Only show time if activity time is within the last year
    const showTime = now - dateInMs < MILLISECONDS_PER_YEAR;
    return <ReadableTime timestamp={dateInMs} alwaysShowTime={showTime} relativeThreshold={0} {...rest} />;
};

export default Datestamp;
