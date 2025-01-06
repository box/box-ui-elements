import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../../../test-utils/testing-library';
import DeleteConfirmationDialog, { DeleteConfirmationDialogProps } from '../DeleteConfirmationDialog';
import { ITEM_TYPE_FILE, ITEM_TYPE_FOLDER } from '../../../constants';

const mockItem = { id: '123', type: ITEM_TYPE_FILE, name: 'Test File' };
const mockFolderItem = { id: '456', type: ITEM_TYPE_FOLDER, name: 'Test Folder' };

jest.mock('react-modal', () => {
    return jest.fn(({ children }) => <div aria-label="Delete">{children}</div>);
});

describe('elements/content-explorer/DeleteConfirmationDialog', () => {
    const defaultProps = {
        appElement: document.body,
        errorCode: '',
        isLoading: false,
        isOpen: false,
        item: mockItem,
        onCancel: jest.fn(),
        onDelete: jest.fn(),
        parentElement: document.createElement('div'),
    };

    const renderComponent = (props: Partial<DeleteConfirmationDialogProps>) =>
        render(<DeleteConfirmationDialog {...defaultProps} {...props} />);

    test('should render the dialog with file message', async () => {
        renderComponent({ isOpen: true });

        expect(await screen.findByText('Are you sure you want to delete Test File?')).toBeInTheDocument();
    });

    test('should render the dialog with folder message', async () => {
        renderComponent({ isOpen: true, item: mockFolderItem });

        expect(
            await screen.findByText('Are you sure you want to delete Test Folder and all its contents?'),
        ).toBeInTheDocument();
    });

    test('should call onCancel when cancel button is clicked', async () => {
        const mockOnCancel = jest.fn();
        renderComponent({ isOpen: true, onCancel: mockOnCancel });

        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        await userEvent.click(cancelButton);
        expect(mockOnCancel).toBeCalledTimes(1);
    });

    test('should call onDelete when delete button is clicked', async () => {
        const mockOnDelete = jest.fn();
        renderComponent({ isOpen: true, onDelete: mockOnDelete });

        const deleteButton = screen.getByRole('button', { name: 'Delete' });
        await userEvent.click(deleteButton);
        expect(mockOnDelete).toBeCalledTimes(1);
    });

    test('should disable buttons when isLoading is true', () => {
        renderComponent({ isOpen: true, isLoading: true });

        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        expect(cancelButton).toBeDisabled();
        const loadingIndicator = screen.getByRole('status', { name: 'Loading' });
        expect(loadingIndicator).toBeInTheDocument();
    });
});
