import * as React from 'react';
import { render, screen, fireEvent } from '../../../test-utils/testing-library';

import RenameDialog, { RenameDialogProps } from '../RenameDialog';

describe('elements/content-explorer/RenameDialog', () => {
    const mockItem = {
        id: '123456',
        name: 'mockFile',
        extension: 'txt',
        type: 'file',
    };

    const defaultProps = {
        errorCode: '',
        isLoading: false,
        isOpen: false,
        item: mockItem,
        onCancel: jest.fn(),
        onRename: jest.fn(),
        parentElement: document.body,
    };

    const renderComponent = (props: Partial<RenameDialogProps>) =>
        render(<RenameDialog {...defaultProps} {...props} />);

    test('render rename dialog correctly when it is open and not loading', () => {
        renderComponent({ isOpen: true, item: mockItem });

        expect(screen.getByText('Rename File')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Rename' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();

        const textInput = screen.getByLabelText('Name');
        expect(textInput).toBeInTheDocument();
        expect(textInput).toHaveValue('mockFile');
    });

    test('render dialog footer correctly when it is open and loading', () => {
        renderComponent({ isOpen: true, isLoading: true });

        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        expect(cancelButton).toBeInTheDocument();
        expect(cancelButton).toBeDisabled();

        const loadingIndicator = screen.getByRole('status', { name: 'Loading' });
        expect(loadingIndicator).toBeInTheDocument();

        const renameButton = screen.queryByRole('button', { name: 'Rename' });
        expect(renameButton).not.toBeInTheDocument();
    });

    test('call onRename with input value and extension when rename button is clicked', () => {
        const mockRenameFunction = jest.fn();
        renderComponent({ isOpen: true, item: mockItem, onRename: mockRenameFunction });

        const textInput = screen.getByLabelText('Name');
        fireEvent.change(textInput, { target: { value: 'newFileName' } });

        fireEvent.click(screen.getByRole('button', { name: 'Rename' }));
        expect(mockRenameFunction).toHaveBeenCalledTimes(1);
        expect(mockRenameFunction).toHaveBeenCalledWith('newFileName', '.txt');
    });

    test('call onRename with input value and extension when enter key is pressed', () => {
        const mockRenameFunction = jest.fn();
        renderComponent({ isOpen: true, item: mockItem, onRename: mockRenameFunction });

        const textInput = screen.getByLabelText('Name');
        fireEvent.change(textInput, { target: { value: 'newFileName' } });

        fireEvent.keyDown(textInput, { key: 'Enter', code: 'Enter' });
        expect(mockRenameFunction).toHaveBeenCalledTimes(1);
        expect(mockRenameFunction).toHaveBeenCalledWith('newFileName', '.txt');
    });

    test('call onCancel when cancel button is clicked', () => {
        const mockCancelFunction = jest.fn();
        renderComponent({ isOpen: true, onCancel: mockCancelFunction });

        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
        expect(mockCancelFunction).toHaveBeenCalledTimes(1);
    });

    test('call onCancel when close icon is clicked', () => {
        const mockCancelFunction = jest.fn();
        renderComponent({ isOpen: true, onCancel: mockCancelFunction });

        fireEvent.click(screen.getByRole('button', { name: 'Close' }));
        expect(mockCancelFunction).toHaveBeenCalledTimes(1);
    });

    test('call onCancel when text value is not changed and rename button is clicked', () => {
        const mockCancelFunction = jest.fn();
        renderComponent({ isOpen: true, onCancel: mockCancelFunction });

        fireEvent.click(screen.getByRole('button', { name: 'Rename' }));
        expect(mockCancelFunction).toHaveBeenCalledTimes(1);
    });

    test.each`
        errorCode               | expectedError
        ${'item_name_in_use'}   | ${'An item with the same name already exists.'}
        ${'item_name_too_long'} | ${'This name is too long.'}
        ${'default'}            | ${'This name is invalid.'}
    `('render correct error message based on errorCode', ({ errorCode, expectedError }) => {
        renderComponent({ isOpen: true, errorCode });

        expect(screen.getByText(expectedError)).toBeInTheDocument();
    });
});
