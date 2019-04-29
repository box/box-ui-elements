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

const statusMessageKeyMap = {
    [TASK_NEW_APPROVED]: messages.tasksFeedApprovedLabel,
    [TASK_NEW_COMPLETED]: messages.tasksFeedCompletedLabel,
    [TASK_NEW_REJECTED]: messages.tasksFeedRejectedLabel,
    [TASK_NEW_NOT_STARTED]: messages.tasksFeedInProgressLabel,
    [TASK_NEW_IN_PROGRESS]: messages.tasksFeedInProgressLabel,
};

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

const Status = React.memo<Props>(({ status }: Props) => (
    <FormattedMessage
        {...messages.tasksFeedStatusLabel}
        values={{
            taskStatus: (
                <React.Fragment>
                    <StatusIcon
                        status={status}
                        className={`bcs-task-status-item bcs-task-status-icon ${camelCase(status)}`}
                        aria-hidden
                    />
                    <span className={`bcs-task-status-item bcs-task-status-message ${camelCase(status)}`}>
                        <FormattedMessage {...statusMessageKeyMap[status]} />
                    </span>
                </React.Fragment>
            ),
        }}
    >
        {(...msg: Array<React.Node>): React.Node => <div className="bcs-task-status">{msg}</div>}
    </FormattedMessage>
));

export default Status;
