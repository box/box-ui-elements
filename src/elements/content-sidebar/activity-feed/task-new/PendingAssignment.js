/**
 * @flow
 * @file PendingAssignment component
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import Button from 'components/button';

import { ACTIVITY_TARGETS } from 'elements/common/interactionTargets';
import messages from 'elements/common/messages';

type Props = {
    name: string,
    onTaskApproval?: Function,
    onTaskReject?: Function,
    shouldShowActions: boolean,
};

const PendingAssignment = ({ onTaskApproval, onTaskReject, shouldShowActions }: Props): React.Node =>
    shouldShowActions ? (
        <div className="bcs-task-pending-assignment bcs-task-assignment-actions">
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
        </div>
    ) : null;

export default PendingAssignment;
