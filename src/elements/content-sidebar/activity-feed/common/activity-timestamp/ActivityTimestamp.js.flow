// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import ActivityDatestamp from '../activity-datestamp';
import Tooltip from '../../../../../components/tooltip';
import messages from './messages';
import './ActivityTimestamp.scss';

type Props = {
    date: number, // unix epoch timestamp (new Date().getTime())
};

const ActivityTimestamp = ({ date }: Props) => (
    <Tooltip text={<FormattedMessage {...messages.fullDateTime} values={{ time: date }} />}>
        <small className="bcs-ActivityTimestamp">
            <ActivityDatestamp date={date} />
        </small>
    </Tooltip>
);

export default ActivityTimestamp;
