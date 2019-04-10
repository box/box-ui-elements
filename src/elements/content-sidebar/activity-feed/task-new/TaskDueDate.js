// @flow
import * as React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import messages from '../../../common/messages';
import { ReadableTime } from '../../../../components/time';

import { TASK_NEW_INCOMPLETE } from '../../../../constants';

type Props = {
    dueDate: ISODate,
    status: TaskStatus,
};

const TaskDueDate = ({ dueDate, status }: Props): React.Node => {
    const isOverdue = dueDate ? status === TASK_NEW_INCOMPLETE && new Date(dueDate) < Date.now() : false;
    const fullDueDate = new Date(dueDate);

    return (
        <div
            className={classNames('bcs-task-due-date', {
                'bcs-task-overdue': isOverdue,
            })}
            data-testid="task-due-date"
        >
            <FormattedMessage
                {...messages.taskDueDateLabel}
                values={{
                    date: <ReadableTime alwaysShowTime timestamp={fullDueDate.getTime()} />,
                }}
            />
        </div>
    );
};

export default TaskDueDate;
