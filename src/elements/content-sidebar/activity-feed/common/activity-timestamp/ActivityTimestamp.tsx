import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import ActivityDatestamp from '../activity-datestamp';
import Tooltip from '../../../../../components/tooltip';
import messages from './messages';
import './ActivityTimestamp.scss';

export interface ActivityTimestampProps {
    /** unix epoch timestamp (new Date().getTime()) */
    date: number;
}

const ActivityTimestamp = ({ date }: ActivityTimestampProps): React.ReactElement => (
    <Tooltip text={<FormattedMessage {...messages.fullDateTime} values={{ time: date }} />}>
        <small className="bcs-ActivityTimestamp">
            <ActivityDatestamp date={date} />
        </small>
    </Tooltip>
);

export default ActivityTimestamp;
