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
import LabelPill, { LabelPillStatus } from '../../../../components/label-pill';
import type { TaskStatus } from '../../../../common/types/tasks';

interface StatusProps {
    status: TaskStatus;
}

const statusMessageKeyMap = {
    [TASK_NEW_APPROVED]: messages.taskFeedApprovedUppercaseLabel,
    [TASK_NEW_COMPLETED]: messages.taskFeedCompletedUppercaseLabel,
    [TASK_NEW_REJECTED]: messages.taskFeedRejectedUppercaseLabel,
    [TASK_NEW_NOT_STARTED]: messages.taskFeedInProgressUppercaseLabel,
    [TASK_NEW_IN_PROGRESS]: messages.taskFeedInProgressUppercaseLabel,
};

const typeKeyMap = {
    [TASK_NEW_APPROVED]: LabelPillStatus.SUCCESS,
    [TASK_NEW_COMPLETED]: LabelPillStatus.SUCCESS,
    [TASK_NEW_REJECTED]: LabelPillStatus.ERROR,
    [TASK_NEW_NOT_STARTED]: LabelPillStatus.DEFAULT,
    [TASK_NEW_IN_PROGRESS]: LabelPillStatus.DEFAULT,
};

const Status = React.memo<StatusProps>(({ status }: StatusProps) => (
    <LabelPill.Pill type={typeKeyMap[status]}>
        <LabelPill.Text>
            <FormattedMessage {...statusMessageKeyMap[status]} />
        </LabelPill.Text>
    </LabelPill.Pill>
));

export default Status;
