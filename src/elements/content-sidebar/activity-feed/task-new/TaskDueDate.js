// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import messages from './messages';
import { ReadableTime } from '../../../../components/time';
import LabelPill from '../../../../components/label-pill';

import { TASK_NEW_NOT_STARTED } from '../../../../constants';

import type { TaskStatus } from '../../../../common/types/tasks';
import type { ISODate } from '../../../../common/types/core';

import './TaskDueDate.scss';

type Props = {
    dueDate: ISODate,
    status: TaskStatus,
};

const TaskDueDate = ({ dueDate, status }: Props): React.Node => {
    const isOverdue = dueDate ? status === TASK_NEW_NOT_STARTED && new Date(dueDate) < Date.now() : false;
    const fullDueDate = new Date(dueDate);
    const pillProps = isOverdue ? { 'data-testid': 'task-overdue-date', type: 'error' } : { type: 'default' };
    return (
        <div data-testid="task-due-date" className="bcs-TaskDueDate">
            <LabelPill.Pill {...pillProps}>
                <LabelPill.Text>
                    <FormattedMessage
                        {...messages.taskFeedStatusDue}
                        values={{
                            dateTime: <ReadableTime alwaysShowTime timestamp={fullDueDate.getTime()} />,
                        }}
                    />
                </LabelPill.Text>
            </LabelPill.Pill>
        </div>
    );
};

export default TaskDueDate;
