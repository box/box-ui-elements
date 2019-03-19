// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import camelCase from 'lodash/camelCase';
import IconComplete from '../../../../icons/general/IconVerified';
import IconReject from '../../../../icons/general/IconRejected';
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
            return <IconComplete {...rest} />;
        case TASK_NEW_REJECTED:
            return <IconReject {...rest} />;
        case TASK_NEW_INCOMPLETE:
        default:
            return null;
    }
};

const AssignmentStatus = React.memo<Props>(({ user, status, getAvatarUrl, ...rest }: Props) => (
    <div className="bcs-task-assignment-status" {...rest}>
        <Avatar className="bcs-task-assignment-avatar" user={user} getAvatarUrl={getAvatarUrl} />
        <StatusIcon
            status={status}
            className={`bcs-task-assignment-status-icon ${camelCase(status)}`}
            height={12}
            width={12}
            title={<FormattedMessage {...messages.completedAssignment} />}
        />
    </div>
));

export default AssignmentStatus;
