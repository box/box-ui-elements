import * as React from 'react';

import { render, screen } from '../../../../../test-utils/testing-library';
import { ERROR_CODE_GROUP_EXCEEDS_LIMIT, TASK_TYPE_APPROVAL, TASK_TYPE_GENERAL } from '../../../../../constants';
import type { ElementsXhrError } from '../../../../../common/types/api';
import TaskErrorNotice from '../TaskErrorNotice';

describe('elements/content-sidebar/activity-feed-v2/task-modal-v2/TaskErrorNotice', () => {
    test('renders nothing when error is undefined', () => {
        render(<TaskErrorNotice error={undefined} isEditMode={false} taskType={TASK_TYPE_APPROVAL} />);
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    test('renders a generic create error notice for non-forbidden errors in create mode', () => {
        render(
            <TaskErrorNotice
                error={{ status: 500 } as ElementsXhrError}
                isEditMode={false}
                taskType={TASK_TYPE_APPROVAL}
            />,
        );
        expect(screen.getByText(/An error occurred while creating this task/i)).toBeVisible();
    });

    test('renders a generic update error notice for non-forbidden errors in edit mode', () => {
        render(
            <TaskErrorNotice error={{ status: 500 } as ElementsXhrError} isEditMode taskType={TASK_TYPE_APPROVAL} />,
        );
        expect(screen.getByText(/An error occurred while modifying this task/i)).toBeVisible();
    });

    test('renders the approval-task forbidden warning for 403 on edit', () => {
        render(
            <TaskErrorNotice error={{ status: 403 } as ElementsXhrError} isEditMode taskType={TASK_TYPE_APPROVAL} />,
        );
        expect(screen.getByText(/Unable to remove assignee\(s\) because the task is now approved\./i)).toBeVisible();
    });

    test('renders the general-task forbidden warning for 403 on edit', () => {
        render(<TaskErrorNotice error={{ status: 403 } as ElementsXhrError} isEditMode taskType={TASK_TYPE_GENERAL} />);
        expect(screen.getByText(/Unable to remove assignee\(s\) because the task is now completed\./i)).toBeVisible();
    });

    test('renders the group-exceeds warning with the max-assignees interpolation', () => {
        render(
            <TaskErrorNotice
                error={{ code: ERROR_CODE_GROUP_EXCEEDS_LIMIT } as ElementsXhrError}
                isEditMode={false}
                taskType={TASK_TYPE_APPROVAL}
            />,
        );
        expect(screen.getByText(/Exceeded max assignees per group/i)).toBeVisible();
        expect(screen.getByText(/cannot exceed the limit of 250 assignees per group/i)).toBeVisible();
    });

    test('reads status from Axios-shaped error.response.status', () => {
        const axiosForbiddenError = { response: { status: 403 } } as unknown as ElementsXhrError;
        render(<TaskErrorNotice error={axiosForbiddenError} isEditMode taskType={TASK_TYPE_GENERAL} />);
        expect(screen.getByText(/Unable to remove assignee\(s\) because the task is now completed\./i)).toBeVisible();
    });

    test('reads code from Axios-shaped error.response.data.code', () => {
        const axiosGroupExceedsError = {
            response: { data: { code: ERROR_CODE_GROUP_EXCEEDS_LIMIT } },
        } as unknown as ElementsXhrError;
        render(<TaskErrorNotice error={axiosGroupExceedsError} isEditMode={false} taskType={TASK_TYPE_APPROVAL} />);
        expect(screen.getByText(/Exceeded max assignees per group/i)).toBeVisible();
    });
});
