import * as React from 'react';

import { render, screen, userEvent } from '../../../../../test-utils/testing-library';
import {
    TASK_EDIT_MODE_CREATE,
    TASK_EDIT_MODE_EDIT,
    TASK_TYPE_APPROVAL,
    TASK_TYPE_GENERAL,
} from '../../../../../constants';
import TaskModalV2 from '../TaskModalV2';

import type { TaskModalV2Props } from '../TaskModalV2';

describe('elements/content-sidebar/task-modal-v2/TaskModalV2', () => {
    const renderModal = (props: Partial<TaskModalV2Props> = {}) =>
        render(<TaskModalV2 isOpen onClose={jest.fn()} taskType={TASK_TYPE_APPROVAL} {...props} />);

    test('renders nothing when isOpen is false', () => {
        renderModal({ isOpen: false });
        expect(screen.queryByTestId('task-modal-v2')).not.toBeInTheDocument();
    });

    test('renders the modal with a placeholder form region when isOpen is true', () => {
        renderModal();
        expect(screen.getByTestId('task-modal-v2')).toBeVisible();
        expect(screen.getByText('Form goes here')).toBeVisible();
    });

    test.each([
        [TASK_TYPE_APPROVAL, TASK_EDIT_MODE_CREATE, 'Create Approval Task'],
        [TASK_TYPE_APPROVAL, TASK_EDIT_MODE_EDIT, 'Modify Approval Task'],
        [TASK_TYPE_GENERAL, TASK_EDIT_MODE_CREATE, 'Create General Task'],
        [TASK_TYPE_GENERAL, TASK_EDIT_MODE_EDIT, 'Modify General Task'],
    ])('renders the correct title for taskType=%s editMode=%s', (taskType, editMode, expectedTitle) => {
        renderModal({ taskType, editMode });
        expect(screen.getByRole('heading', { name: expectedTitle })).toBeVisible();
    });

    test('calls onClose when the close button is clicked', async () => {
        const user = userEvent();
        const onClose = jest.fn();
        renderModal({ onClose });
        await user.click(screen.getByRole('button', { name: 'Close' }));
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    test('calls onClose when Escape is pressed', async () => {
        const user = userEvent();
        const onClose = jest.fn();
        renderModal({ onClose });
        await user.keyboard('{Escape}');
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
