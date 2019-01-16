/**
 * @flow
 * @file CompletedAssignment component
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import Avatar from 'box-react-ui/lib/components/avatar';
import IconCheck from 'box-react-ui/lib/icons/general/IconCheck';
import IconClose from 'box-react-ui/lib/icons/general/IconClose';
import IconPending from 'box-react-ui/lib/icons/general/IconHelp';

import { TASK_APPROVED, TASK_REJECTED, TASK_COMPLETED, TASK_INCOMPLETE } from '../../../../constants';

import messages from '../../../common/messages';

type Props = {
    user: {
        id: string,
        name: string,
        avatar_url?: ?string,
    },
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

const AssignmentStatus = ({ user, status }: Props): React.Node => (
    <div className="bcs-task-assignment-status">
        <Avatar className="bcs-task-assignment-avatar" avatarUrl={user.avatar_url} id={user.id} name={user.name} />
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
