// @flow
import * as React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import messages from './messages';
import { ReadableTime } from '../../../../components/time';

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

    return (
        <div
            className={classNames('bcs-TaskDueDate', {
                'bcs-is-taskOverdue': isOverdue,
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
