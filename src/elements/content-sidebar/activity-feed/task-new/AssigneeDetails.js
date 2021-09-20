// @flow strict
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import ActivityDatestamp from '../common/activity-datestamp';
import commonMessages from '../../../common/messages';
import messages from './messages';
import { TASK_NEW_APPROVED, TASK_NEW_REJECTED, TASK_NEW_COMPLETED, TASK_NEW_NOT_STARTED } from '../../../../constants';
import type { ISODate } from '../../../../common/types/core';

import './AssigneeDetails.scss';

const statusMessages = {
    [TASK_NEW_APPROVED]: messages.tasksFeedStatusApproved,
    [TASK_NEW_REJECTED]: messages.tasksFeedStatusRejected,
    [TASK_NEW_COMPLETED]: messages.tasksFeedStatusCompleted,
    [TASK_NEW_NOT_STARTED]: null,
};

type Props = {
    className?: string,
    completedAt?: ?ISODate | Date,
    status: $Keys<typeof statusMessages>,
    user: { name: string },
};

const AssigneeDetails = React.memo<Props>(({ user, status, completedAt, className }: Props) => {
    const statusMessage = statusMessages[status] || null;
    return (
        <div className={classNames(className, 'bcs-AssigneeDetails')}>
            <div className="bcs-AssigneeDetails-name">
                {user.name ? user.name : <FormattedMessage {...commonMessages.priorCollaborator} />}
            </div>
            {statusMessage && completedAt && (
                <div className="bcs-AssigneeDetails-status">
                    <FormattedMessage
                        {...statusMessage}
                        values={{ dateTime: <ActivityDatestamp date={completedAt} /> }}
                    />
                </div>
            )}
        </div>
    );
});

export default AssigneeDetails;
