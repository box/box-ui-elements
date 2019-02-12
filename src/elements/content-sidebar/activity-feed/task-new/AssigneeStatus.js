/**
 * @flow
 * @file CompletedAssignment component
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import IconClose from '../../../../icons/general/IconClose';
import IconCheck from '../../../../icons/general/IconCheck';
import Avatar from '../Avatar';
import { TASK_NEW_APPROVED, TASK_NEW_REJECTED, TASK_NEW_COMPLETED, TASK_NEW_INCOMPLETE } from '../../../../constants';
import messages from '../../../common/messages';

type Props = {
    getAvatarUrl?: string => Promise<?string>,
    status: TaskStatus,
    user: UserMini,
};

const StatusIcon = ({ status, ...rest }: { status: TaskStatus }) => {
    switch (status) {
        case TASK_NEW_APPROVED:
        case TASK_NEW_COMPLETED:
            return <IconCheck {...rest} />;
        case TASK_NEW_REJECTED:
            return <IconClose {...rest} />;
        case TASK_NEW_INCOMPLETE:
        default:
            return null;
    }
};

const AssignmentStatus = ({ user, status, getAvatarUrl }: Props): React.Node => (
    <div className="bcs-task-assignment-status">
        <Avatar className="bcs-task-assignment-avatar" user={user} getAvatarUrl={getAvatarUrl} />
        <StatusIcon
            status={status}
            className={`bcs-task-assignment-status-icon ${status}`}
            height={12}
            width={12}
            title={<FormattedMessage {...messages.completedAssignment} />}
        />
    </div>
);

export default AssignmentStatus;
