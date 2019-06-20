// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
import messages from '../../../common/messages';
import Button from '../../../../components/button';
import { TASK_TYPE_APPROVAL, TASK_TYPE_GENERAL } from '../../../../constants';
import type { TaskType } from '../../../../common/types/tasks';

type Props = {|
    onTaskApproval: Function,
    onTaskComplete: Function,
    onTaskReject: Function,
    taskType: TaskType,
|};

const TaskActions = ({ onTaskApproval, onTaskReject, onTaskComplete, taskType }: Props): React.Node => {
    let action = null;
    if (taskType === TASK_TYPE_APPROVAL) {
        action = (
            <React.Fragment>
                <Button
                    className="bcs-task-action-button bcs-task-check-btn"
                    data-testid="approve-task"
                    onClick={onTaskApproval}
                    data-resin-target={ACTIVITY_TARGETS.TASK_APPROVE}
                >
                    <FormattedMessage {...messages.tasksFeedApproveAction} />
                </Button>
                <Button
                    className="bcs-task-action-button bcs-task-x-btn"
                    data-testid="reject-task"
                    onClick={onTaskReject}
                    data-resin-target={ACTIVITY_TARGETS.TASK_REJECT}
                >
                    <FormattedMessage {...messages.tasksFeedRejectAction} />
                </Button>
            </React.Fragment>
        );
    } else if (taskType === TASK_TYPE_GENERAL) {
        action = (
            <Button
                className="bcs-task-action-button bcs-task-check-btn"
                data-testid="complete-task"
                onClick={onTaskComplete}
                data-resin-target={ACTIVITY_TARGETS.TASK_COMPLETE}
            >
                <FormattedMessage {...messages.tasksFeedCompleteAction} />
            </Button>
        );
    }
    return <div className="bcs-task-pending-assignment bcs-task-assignment-actions">{action}</div>;
};

export default TaskActions;
