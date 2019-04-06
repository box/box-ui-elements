// @flow
import * as React from 'react';
import classNames from 'classnames';
import { FormattedTime, FormattedMessage } from 'react-intl';

import messages from '../../../common/messages';
import { TASK_NEW_INCOMPLETE } from '../../../../constants';

type Props = {
    dueDate?: ?ISODate,
    status: TaskStatus,
};

const TaskDueDate = ({ dueDate, status }: Props): React.Node => {
    const isOverdue = dueDate ? status === TASK_NEW_INCOMPLETE && new Date(dueDate) < Date.now() : false;

    return dueDate ? (
        <div
            className={classNames('bcs-task-due-date', {
                'bcs-task-overdue': isOverdue,
            })}
            data-testid="task-due-date"
        >
            <FormattedMessage {...messages.taskDueDate} />
            <FormattedTime value={dueDate} day="numeric" month="short" year="numeric" />
        </div>
    ) : null;
};

export default TaskDueDate;
