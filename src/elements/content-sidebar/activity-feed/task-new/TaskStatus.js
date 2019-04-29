// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import camelCase from 'lodash/camelCase';
import IconComplete from '../../../../icons/general/IconVerified';
import IconReject from '../../../../icons/general/IconRejected';
import {
    TASK_NEW_APPROVED,
    TASK_NEW_REJECTED,
    TASK_NEW_COMPLETED,
    TASK_NEW_NOT_STARTED,
    TASK_NEW_IN_PROGRESS,
} from '../../../../constants';
import messages from '../../../common/messages';

type Props = {|
    status: TaskStatus,
|};

const ICON_SIZE = 14;

const StatusIcon = ({ status, ...rest }: { status: TaskStatus }) => {
    switch (status) {
        case TASK_NEW_APPROVED:
        case TASK_NEW_COMPLETED:
            return <IconComplete width={ICON_SIZE} height={ICON_SIZE} {...rest} />;
        case TASK_NEW_REJECTED:
            return <IconReject width={ICON_SIZE} height={ICON_SIZE} {...rest} />;
        case TASK_NEW_NOT_STARTED:
        case TASK_NEW_IN_PROGRESS:
        default:
            return null;
    }
};

const StatusMessage = ({ status }: { status: TaskStatus }) => {
    let statusMessage;
    switch (status) {
        case TASK_NEW_APPROVED:
            statusMessage = messages.tasksFeedApprovedLabel;
            break;
        case TASK_NEW_COMPLETED:
            statusMessage = messages.tasksFeedCompletedLabel;
            break;
        case TASK_NEW_REJECTED:
            statusMessage = messages.tasksFeedRejectedLabel;
            break;
        case TASK_NEW_NOT_STARTED:
        case TASK_NEW_IN_PROGRESS:
            statusMessage = messages.tasksFeedInProgressLabel;
            break;
        default:
            return null;
    }

    return (
        <span className={`bcs-task-status-message ${camelCase(status)}`}>
            <FormattedMessage {...statusMessage} />
        </span>
    );
};

const Status = React.memo<Props>(({ status }: Props) => (
    <div className="bcs-task-status">
        <span className="bcs-task-status-label">
            <FormattedMessage {...messages.tasksFeedStatusLabel} />
        </span>
        <StatusIcon status={status} className={`bcs-task-status-icon ${camelCase(status)}`} aria-hidden />
        <StatusMessage status={status} />
    </div>
));

export default Status;
