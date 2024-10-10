import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../../../test-utils/testing-library';
import DeleteConfirmationDialog, { DeleteConfirmationDialogProps } from '../DeleteConfirmationDialog';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { TYPE_FOLDER } from '../../../constants';

const mockItem = { type: 'pdf', name: 'Test File' };
const mockFolderItem = { type: TYPE_FOLDER, name: 'Test Folder' };
const mockOnCancel = jest.fn();
const mockOnDelete = jest.fn();

const defaultProps = {
    errorCode: '',
    isLoading: false,
    isOpen: false,
    item: mockItem,
    onCancel: jest.fn(),
    onDelete: jest.fn(),
    parentElement: document.body,
};

const renderComponent = (props: Partial<DeleteConfirmationDialogProps>) =>
    render(<DeleteConfirmationDialog {...defaultProps} {...props} />);

describe('elements/content-explorer/DeleteConfirmationDialog', () => {
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
        renderComponent({ isOpen: true, onCancel: mockOnCancel });

        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        await userEvent.click(cancelButton);
        expect(mockOnCancel).toBeCalledTimes(1);
    });

    test('should call onDelete when delete button is clicked', async () => {
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
