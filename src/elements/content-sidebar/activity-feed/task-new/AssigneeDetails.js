// @flow strict
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import ReadableTime from '../../../../components/time/ReadableTime';
import commonMessages from '../../../common/messages';
import messages from './messages';
import { TASK_NEW_APPROVED, TASK_NEW_REJECTED, TASK_NEW_COMPLETED, TASK_NEW_NOT_STARTED } from '../../../../constants';
import type { ISODate } from '../../../../common/types/core';

import './AssigneeList.scss';

const statusMessages = {
    [TASK_NEW_APPROVED]: messages.tasksFeedStatusApproved,
    [TASK_NEW_REJECTED]: messages.tasksFeedStatusRejected,
    [TASK_NEW_COMPLETED]: messages.tasksFeedStatusCompleted,
    [TASK_NEW_NOT_STARTED]: null,
};

const Datestamp = ({ date }: { date: ISODate | Date }) => {
    return <ReadableTime timestamp={new Date(date).getTime()} alwaysShowTime relativeThreshold={0} />;
};

type Props = {
    className?: string,
    completedAt?: ?ISODate | Date,
    status: $Keys<typeof statusMessages>,
    user: { name: string },
};

const AvatarDetails = React.memo<Props>(({ user, status, completedAt, className }) => {
    const statusMessage = statusMessages[status] || null;
    return (
        <div className={className}>
            <div className="bcs-AssigneeList-detailsName">
                {user.name ? user.name : <FormattedMessage {...commonMessages.priorCollaborator} />}
            </div>
            {statusMessage && completedAt && (
                <div className="bcs-AssigneeList-detailsStatus">
                    <FormattedMessage {...statusMessage} values={{ dateTime: <Datestamp date={completedAt} /> }} />
                </div>
            )}
        </div>
    );
});

export default AvatarDetails;
