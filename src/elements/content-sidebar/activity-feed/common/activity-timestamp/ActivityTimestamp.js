// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Tooltip from '../../../../../components/tooltip';
import ReadableTime from '../../../../../components/time/ReadableTime';
import messages from './messages';
import { isCurrentYear } from '../../../../../utils/datetime';
import './ActivityTimestamp.scss';

type Props = {
    date: number, // unix epoch timestamp (new Date().getTime())
};

const ActivityTimestamp = ({ date }: Props) => {
    const showTime = isCurrentYear(date);

    return (
        <Tooltip text={<FormattedMessage {...messages.fullDateTime} values={{ time: date }} />}>
            <small className="bcs-ActivityTimestamp">
                <ReadableTime alwaysShowTime={showTime} relativeThreshold={0} timestamp={date} />
            </small>
        </Tooltip>
    );
};

export default ActivityTimestamp;
