// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
import messages from './messages';
import Button from '../../../../components/button';
import { TASK_TYPE_APPROVAL, TASK_TYPE_GENERAL } from '../../../../constants';
import type { TaskType } from '../../../../common/types/tasks';

import './TaskActions.scss';

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
            <>
                <Button
                    className="bcs-TaskActions-button"
                    data-testid="approve-task"
                    onClick={onTaskApproval}
                    data-resin-target={ACTIVITY_TARGETS.TASK_APPROVE}
                >
                    <FormattedMessage {...messages.tasksFeedApproveAction} />
                </Button>
                <Button
                    className="bcs-TaskActions-button"
                    data-testid="reject-task"
                    onClick={onTaskReject}
                    data-resin-target={ACTIVITY_TARGETS.TASK_REJECT}
                >
                    <FormattedMessage {...messages.tasksFeedRejectAction} />
                </Button>
            </>
        );
    } else if (taskType === TASK_TYPE_GENERAL) {
        action = (
            <Button
                className="bcs-TaskActions-button"
                data-testid="complete-task"
                onClick={onTaskComplete}
                data-resin-target={ACTIVITY_TARGETS.TASK_COMPLETE}
            >
                <FormattedMessage {...messages.tasksFeedCompleteAction} />
            </Button>
        );
    }
    return <div className="bcs-TaskActions">{action}</div>;
};

export default TaskActions;
