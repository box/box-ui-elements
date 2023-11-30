// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
import messages from './messages';
import Button from '../../../../components/button';
import PrimaryButton from '../../../../components/primary-button';
import { TASK_TYPE_APPROVAL, TASK_TYPE_GENERAL } from '../../../../constants';
import type { TaskType } from '../../../../common/types/tasks';

import './TaskActions.scss';

type Props = {|
    isMultiFile: boolean,
    onTaskApproval: Function,
    onTaskComplete: Function,
    onTaskReject: Function,
    onTaskView: Function,
    taskType: TaskType,
|};

const TaskActions = ({
    isMultiFile,
    onTaskApproval,
    onTaskReject,
    onTaskComplete,
    onTaskView,
    taskType,
}: Props): React.Node => {
    let action = null;
    if (isMultiFile) {
        action = onTaskView && (
            <PrimaryButton
                className="bcs-TaskActions-button"
                data-resin-target={ACTIVITY_TARGETS.TASK_VIEW_DETAILS}
                data-testid="view-task"
                onClick={onTaskView}
            >
                <FormattedMessage {...messages.tasksFeedViewDetailsAction} />
            </PrimaryButton>
        );
    } else if (taskType === TASK_TYPE_APPROVAL) {
        action = (
            <>
                <Button
                    className="bcs-TaskActions-button"
                    data-resin-target={ACTIVITY_TARGETS.TASK_REJECT}
                    data-testid="reject-task"
                    onClick={onTaskReject}
                >
                    <FormattedMessage {...messages.tasksFeedRejectAction} />
                </Button>
                <PrimaryButton
                    className="bcs-TaskActions-button"
                    data-resin-target={ACTIVITY_TARGETS.TASK_APPROVE}
                    data-testid="approve-task"
                    onClick={onTaskApproval}
                >
                    <FormattedMessage {...messages.tasksFeedApproveAction} />
                </PrimaryButton>
            </>
        );
    } else if (taskType === TASK_TYPE_GENERAL) {
        action = (
            <PrimaryButton
                className="bcs-TaskActions-button"
                data-resin-target={ACTIVITY_TARGETS.TASK_COMPLETE}
                data-testid="complete-task"
                onClick={onTaskComplete}
            >
                <FormattedMessage {...messages.tasksFeedCompleteAction} />
            </PrimaryButton>
        );
    }
    return <div className="bcs-TaskActions">{action}</div>;
};

export default TaskActions;
