/**
 * @flow
 * @file PendingAssignment component
 */

import React, { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';

import IconCheck from 'box-react-ui/lib/icons/general/IconCheck';
import IconClose from 'box-react-ui/lib/icons/general/IconClose';
import PlainButton from 'box-react-ui/lib/components/plain-button';
import Tooltip from 'box-react-ui/lib/components/tooltip';

import messages from '../messages';

type Props = {
    name: string,
    onTaskApproval: Function,
    onTaskReject: Function,
    shouldShowActions: boolean
};

const PendingAssignment = ({ name, onTaskApproval, onTaskReject, shouldShowActions }: Props): ReactNode => (
    <div className='box-ui-task-pending-assignment'>
        <div className='box-ui-task-assignment-name'>{name}</div>
        {shouldShowActions ? (
            <div className='box-ui-task-assignment-actions'>
                <Tooltip position='bottom-center' text={<FormattedMessage {...messages.taskApprove} />}>
                    <PlainButton className='box-ui-task-check-btn' onClick={onTaskApproval}>
                        <IconCheck className='box-ui-task-check-icon' height={18} width={18} />
                    </PlainButton>
                </Tooltip>
                <Tooltip position='bottom-center' text={<FormattedMessage {...messages.taskReject} />}>
                    <PlainButton className='box-ui-task-x-btn' onClick={onTaskReject}>
                        <IconClose className='box-ui-task-x-icon' height={18} width={18} />
                    </PlainButton>
                </Tooltip>
            </div>
        ) : null}
    </div>
);

PendingAssignment.displayName = 'PendingAssignment';

export default PendingAssignment;
