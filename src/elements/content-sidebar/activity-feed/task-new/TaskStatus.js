// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import camelCase from 'lodash/camelCase';
import {
    TASK_NEW_APPROVED,
    TASK_NEW_REJECTED,
    TASK_NEW_COMPLETED,
    TASK_NEW_NOT_STARTED,
    TASK_NEW_IN_PROGRESS,
} from '../../../../constants';
import messages from './messages';
import type { TaskStatus } from '../../../../common/types/tasks';

import './TaskStatus.scss';

type Props = {|
    status: TaskStatus,
|};

const statusMessageKeyMap = {
    [TASK_NEW_APPROVED]: messages.tasksFeedApprovedLabel,
    [TASK_NEW_COMPLETED]: messages.tasksFeedCompletedLabel,
    [TASK_NEW_REJECTED]: messages.tasksFeedRejectedLabel,
    [TASK_NEW_NOT_STARTED]: messages.tasksFeedInProgressLabel,
    [TASK_NEW_IN_PROGRESS]: messages.tasksFeedInProgressLabel,
};

const Status = React.memo<Props>(({ status }: Props) => (
    <FormattedMessage
        {...messages.tasksFeedStatusLabel}
        values={{
            taskStatus: (
                <span className={`bcs-TaskStatus-message ${camelCase(status)}`}>
                    <FormattedMessage {...statusMessageKeyMap[status]} />
                </span>
            ),
        }}
    >
        {(...msg: Array<React.Node>): React.Node => <div className="bcs-TaskStatus">{msg}</div>}
    </FormattedMessage>
));

export default Status;
