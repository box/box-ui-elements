// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Tooltip from '../../../../../components/tooltip';
import ReadableTime from '../../../../../components/time/ReadableTime';
import messages from './messages';
import './ActivityTimestamp.scss';

type Props = {
    date: number, // unix epoch timestamp (new Date().getTime())
};

// 365 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
export const MILLISECONDS_PER_YEAR = 365 * 24 * 60 * 60 * 1000;

const ActivityTimestamp = ({ date }: Props) => {
    const now = new Date().getTime();
    // Only show time if activity time is within the last year
    const showTime = now - date < MILLISECONDS_PER_YEAR;

    return (
        <Tooltip text={<FormattedMessage {...messages.fullDateTime} values={{ time: date }} />}>
            <small className="bcs-ActivityTimestamp">
                <ReadableTime alwaysShowTime={showTime} relativeThreshold={0} timestamp={date} />
            </small>
        </Tooltip>
    );
};

export default ActivityTimestamp;
