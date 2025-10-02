// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import ActivityDatestamp from '../common/activity-datestamp';
import messages from './messages';
// $FlowFixMe LabelPill is in typescript
import LabelPill from '../../../../components/label-pill';
import { TASK_NEW_NOT_STARTED } from '../../../../constants';

import type { TaskStatus } from '../../../../common/types/tasks';
import type { ISODate } from '../../../../common/types/core';

type Props = {
    dueDate: ISODate,
    status: TaskStatus,
};

const TaskDueDate = ({ dueDate, status }: Props): React.Node => {
    const isOverdue = dueDate ? status === TASK_NEW_NOT_STARTED && new Date(dueDate) < Date.now() : false;
    const fullDueDate = new Date(dueDate);
    const pillProps = isOverdue ? { 'data-testid': 'task-overdue-date', type: 'error' } : { type: 'default' };
    return (
        <div data-testid="task-due-date">
            <LabelPill.Pill {...pillProps}>
                <LabelPill.Text>
                    <FormattedMessage
                        {...messages.taskFeedStatusDue}
                        values={{
                            dateTime: <ActivityDatestamp date={fullDueDate.getTime()} uppercase />,
                        }}
                    />
                </LabelPill.Text>
            </LabelPill.Pill>
        </div>
    );
};

export default TaskDueDate;
