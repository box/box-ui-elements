/**
 * @flow
 * @file PendingAssignment component
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import IconCheck from '../../../../icons/general/IconCheck';
import IconClose from '../../../../icons/general/IconClose';
import PlainButton from '../../../../components/plain-button';
import Tooltip from '../../../../components/tooltip';

import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
import messages from './messages';

type Props = {
    name: string,
    onTaskApproval?: Function,
    onTaskReject?: Function,
    shouldShowActions: boolean,
};

const PendingAssignment = ({ name, onTaskApproval, onTaskReject, shouldShowActions }: Props): React.Node => (
    <div className="bcs-task-pending-assignment">
        <div className="bcs-task-assignment-name">{name}</div>
        {shouldShowActions ? (
            <div className="bcs-task-assignment-actions">
                <Tooltip position="bottom-center" text={<FormattedMessage {...messages.taskApprove} />}>
                    <PlainButton
                        className="bcs-task-check-btn"
                        data-resin-target={ACTIVITY_TARGETS.TASK_APPROVE}
                        onClick={onTaskApproval}
                    >
                        <IconCheck className="bcs-task-check-icon" height={18} width={18} />
                    </PlainButton>
                </Tooltip>
                <Tooltip position="bottom-center" text={<FormattedMessage {...messages.taskReject} />}>
                    <PlainButton
                        className="bcs-task-x-btn"
                        data-resin-target={ACTIVITY_TARGETS.TASK_REJECT}
                        onClick={onTaskReject}
                    >
                        <IconClose className="bcs-task-x-icon" height={18} width={18} />
                    </PlainButton>
                </Tooltip>
            </div>
        ) : null}
    </div>
);

export default PendingAssignment;
