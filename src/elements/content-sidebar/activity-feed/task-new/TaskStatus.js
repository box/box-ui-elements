// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
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
// $FlowFixMe LabelPill is in typescript
import LabelPill from '../../../../components/label-pill';

type Props = {|
    status: TaskStatus,
|};

const statusMessageKeyMap = {
    [TASK_NEW_APPROVED]: messages.taskFeedApprovedUppercaseLabel,
    [TASK_NEW_COMPLETED]: messages.taskFeedCompletedUppercaseLabel,
    [TASK_NEW_REJECTED]: messages.taskFeedRejectedUppercaseLabel,
    [TASK_NEW_NOT_STARTED]: messages.taskFeedInProgressUppercaseLabel,
    [TASK_NEW_IN_PROGRESS]: messages.taskFeedInProgressUppercaseLabel,
};

const typeKeyMap = {
    [TASK_NEW_APPROVED]: 'success',
    [TASK_NEW_COMPLETED]: 'success',
    [TASK_NEW_REJECTED]: 'error',
    [TASK_NEW_NOT_STARTED]: 'default',
    [TASK_NEW_IN_PROGRESS]: 'default',
};

const Status = React.memo<Props>(({ status }: Props) => (
    <LabelPill.Pill type={typeKeyMap[status]}>
        <LabelPill.Text>
            <FormattedMessage {...statusMessageKeyMap[status]}>
                {(...msg: Array<React.Node>): React.Node => <div className="bcs-TaskStatus">{msg}</div>}
            </FormattedMessage>
        </LabelPill.Text>
    </LabelPill.Pill>
));

export default Status;
