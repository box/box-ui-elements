import * as React from 'react';
import { render, screen, userEvent } from '../../../test-utils/testing-library';
import { AddTaskButtonComponent as AddTaskButton } from '../AddTaskButton';
import { ViewType, FeedEntryType } from '../../common/types/SidebarNavigation';

jest.mock('../AddTaskMenu', () => ({ onMenuItemClick, isDisabled, setAddTaskButtonRef }) => (
    <div data-testid="add-task-menu">
        <button
            type="button"
            onClick={() => onMenuItemClick('GENERAL')}
            disabled={isDisabled}
            ref={setAddTaskButtonRef}
            data-testid="menu-item-general"
        >
            Add General Task
        </button>
    </div>
));

jest.mock('../TaskModal', () => ({ isTaskFormOpen, onModalClose, taskType }) => (
    <div data-testid="task-modal" data-open={isTaskFormOpen} data-task-type={taskType}>
        <button type="button" onClick={onModalClose} data-testid="modal-close">
            Close Modal
        </button>
    </div>
));

describe('elements/content-sidebar/AddTaskButton', () => {
    /*
    1. Pushing the open state into history keeps the sidebar open upon resize and refresh
    2. Preventing the sidebar from closing keeps the task modal open upon edit and resize
    */

    const defaultProps = {
        history: { replace: jest.fn() },
        isDisabled: false,
        onTaskModalClose: jest.fn(),
        taskFormProps: {
            approvers: [],
            approverSelectorContacts: [],
            completionRule: 'ALL',
            createTask: jest.fn(),
            getApproverWithQuery: jest.fn(),
            getAvatarUrl: jest.fn(),
            id: '',
            message: '',
        },
    };

    const renderComponent = (props = {}) => {
        return render(<AddTaskButton {...defaultProps} {...props} />);
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('should call history.replace state with force open state when task menu items are clicked', async () => {
        const historyMock = { replace: jest.fn() };
        const user = userEvent();

        renderComponent({ history: historyMock });

        const menuItem = screen.getByTestId('menu-item-general');
        await user.click(menuItem);

        expect(historyMock.replace).toHaveBeenCalledWith({ state: { open: true } });
    });

    test('should set state.isTaskFormOpen to false and call onTaskModalClose when task modal is closed', async () => {
        const onTaskModalCloseMock = jest.fn();
        const user = userEvent();

        renderComponent({ onTaskModalClose: onTaskModalCloseMock });

        // First click a menu item to open the modal
        const menuItem = screen.getByTestId('menu-item-general');
        await user.click(menuItem);

        // Verify modal is open
        const modal = screen.getByTestId('task-modal');
        expect(modal).toHaveAttribute('data-open', 'true');

        // Close the modal
        const closeButton = screen.getByTestId('modal-close');
        await user.click(closeButton);

        // Verify modal is closed and callback was called
        expect(modal).toHaveAttribute('data-open', 'false');
        expect(onTaskModalCloseMock).toHaveBeenCalledTimes(1);
    });

    describe('when routerDisabled is true', () => {
        test('should use internalSidebarNavigationHandler when task menu items are clicked', async () => {
            const mockNavigationHandler = jest.fn();
            const user = userEvent();

            renderComponent({
                routerDisabled: true,
                internalSidebarNavigationHandler: mockNavigationHandler,
            });

            const menuItem = screen.getByTestId('menu-item-general');
            await user.click(menuItem);

            expect(mockNavigationHandler).toHaveBeenCalledTimes(1);
            expect(mockNavigationHandler).toHaveBeenCalledWith({ open: true }, true);
        });

        test('should preserve internalSidebarNavigation state when using navigation handler', async () => {
            const mockNavigationHandler = jest.fn();
            const mockInternalSidebarNavigation = {
                sidebar: ViewType.ACTIVITY,
                activeFeedEntryType: FeedEntryType.COMMENTS,
                activeFeedEntryId: '123',
            };
            const user = userEvent();

            renderComponent({
                routerDisabled: true,
                internalSidebarNavigationHandler: mockNavigationHandler,
                internalSidebarNavigation: mockInternalSidebarNavigation,
            });

            const menuItem = screen.getByTestId('menu-item-general');
            await user.click(menuItem);

            expect(mockNavigationHandler).toHaveBeenCalledTimes(1);
            expect(mockNavigationHandler).toHaveBeenCalledWith(
                {
                    sidebar: ViewType.ACTIVITY,
                    activeFeedEntryType: FeedEntryType.COMMENTS,
                    activeFeedEntryId: '123',
                    open: true,
                },
                true,
            );
        });
    });
});
