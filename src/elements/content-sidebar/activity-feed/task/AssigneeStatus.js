/**
 * @flow
 * @file CompletedAssignment component
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import IconCheck from 'box-react-ui/lib/icons/general/IconCheck';
import IconClose from 'box-react-ui/lib/icons/general/IconClose';
import IconPending from 'box-react-ui/lib/icons/general/IconHelp';
import Avatar from '../Avatar';
import { TASK_APPROVED, TASK_REJECTED, TASK_COMPLETED, TASK_INCOMPLETE } from '../../../../constants';
import messages from '../../../common/messages';

type Props = {
    user: {
        type: 'user',
        login?: string,
        id: string,
        name: string,
        email?: string,
        avatar_url?: string,
    },
    getAvatarUrl?: string => Promise<?string>,
    status: TASK_APPROVED | TASK_COMPLETED | TASK_REJECTED | TASK_INCOMPLETE,
};

const StatusIcon = ({ status, ...rest }: { status: 'pending' | 'complete' | 'approved' | 'rejected' }) => {
    switch (status) {
        case TASK_APPROVED:
        case TASK_COMPLETED:
            return <IconCheck {...rest} />;
        case TASK_REJECTED:
            return <IconClose {...rest} />;
        case TASK_INCOMPLETE:
        default:
            return <IconPending {...rest} />;
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
