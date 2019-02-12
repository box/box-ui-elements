/**
 * @flow
 * @file PendingAssignment component
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import Button from 'components/button';

import { ACTIVITY_TARGETS } from 'elements/common/interactionTargets';
import messages from 'elements/common/messages';
import { TASK_TYPE_APPROVAL } from '../../../../constants';

type Props = {
    onTaskApproval: Function,
    onTaskComplete: Function,
    onTaskReject: Function,
    taskType?: TaskType,
};

const PendingAssignment = ({ onTaskApproval, onTaskReject, onTaskComplete, taskType }: Props): React.Node => (
    <div className="bcs-task-pending-assignment bcs-task-assignment-actions">
        {taskType === TASK_TYPE_APPROVAL ? (
            <React.Fragment>
                <Button
                    className="bcs-task-action-button bcs-task-check-btn"
                    onClick={onTaskApproval}
                    data-resin-target={ACTIVITY_TARGETS.TASK_APPROVE}
                >
                    <FormattedMessage {...messages.tasksFeedApproveAction} />
                </Button>
                <Button
                    className="bcs-task-action-button bcs-task-x-btn"
                    onClick={onTaskReject}
                    data-resin-target={ACTIVITY_TARGETS.TASK_REJECT}
                >
                    <FormattedMessage {...messages.tasksFeedRejectAction} />
                </Button>
            </React.Fragment>
        ) : (
            <Button
                className="bcs-task-action-button bcs-task-check-btn"
                onClick={onTaskComplete}
                data-resin-target={ACTIVITY_TARGETS.TASK_COMPLETE}
            >
                <FormattedMessage {...messages.tasksFeedCompleteAction} />
            </Button>
        )}
    </div>
);

export default PendingAssignment;
