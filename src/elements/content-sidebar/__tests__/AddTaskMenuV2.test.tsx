import * as React from 'react';
import { IntlShape } from 'react-intl';
import { render, screen, userEvent } from '../../../test-utils/testing-library';
import AddTaskMenuV2 from '../AddTaskMenuV2';
import { TASK_TYPE_APPROVAL, TASK_TYPE_GENERAL } from '../../../constants';

describe('elements/content-sidebar/AddTaskMenuV2', () => {
    const defaultProps = {
        isDisabled: false,
        onMenuItemClick: jest.fn(),
        setAddTaskButtonRef: jest.fn(),
        intl: {
            formatMessage: jest.fn(msg => msg.defaultMessage || msg.id),
        } as unknown as IntlShape,
    };

    const renderComponent = (props = {}) => {
        return render(<AddTaskMenuV2 {...defaultProps} {...props} />);
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should render trigger button with correct props', () => {
        renderComponent();

        const triggerButton = screen.getByRole('button', { name: /add task/i });
        expect(triggerButton).toBeInTheDocument();
        expect(triggerButton).not.toBeDisabled();
    });

    test('should render disabled trigger button when isDisabled is true', () => {
        renderComponent({ isDisabled: true });

        const triggerButton = screen.getByRole('button', { name: /add task/i });
        expect(triggerButton).toBeDisabled();
    });

    test('should call onMenuItemClick with TASK_TYPE_GENERAL when general task item is clicked', async () => {
        const onMenuItemClick = jest.fn();
        const user = userEvent();

        renderComponent({ onMenuItemClick });

        // Open the dropdown
        const triggerButton = screen.getByRole('button', { name: /add task/i });
        await user.click(triggerButton);

        // Click on general task menu item
        const generalTaskItem = screen.getByRole('menuitem', { name: /general task/i });
        await user.click(generalTaskItem);

        expect(onMenuItemClick).toHaveBeenCalledTimes(1);
        expect(onMenuItemClick).toHaveBeenCalledWith(TASK_TYPE_GENERAL);
    });

    test('should call onMenuItemClick with TASK_TYPE_APPROVAL when approval task item is clicked', async () => {
        const onMenuItemClick = jest.fn();
        const user = userEvent();

        renderComponent({ onMenuItemClick });

        // Open the dropdown
        const triggerButton = screen.getByRole('button', { name: /add task/i });
        await user.click(triggerButton);

        // Click on approval task menu item
        const approvalTaskItem = screen.getByRole('menuitem', { name: /approval task/i });
        await user.click(approvalTaskItem);

        expect(onMenuItemClick).toHaveBeenCalledTimes(1);
        expect(onMenuItemClick).toHaveBeenCalledWith(TASK_TYPE_APPROVAL);
    });

    test('should call setAddTaskButtonRef with button element', () => {
        const setAddTaskButtonRef = jest.fn();

        renderComponent({ setAddTaskButtonRef });

        expect(setAddTaskButtonRef).toHaveBeenCalled();
    });
});
