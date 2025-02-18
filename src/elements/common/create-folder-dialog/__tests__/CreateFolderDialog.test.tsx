import * as React from 'react';
import userEvent from '@testing-library/user-event';

import { render, screen } from '../../../../test-utils/testing-library';
import CreateFolderDialog, { CreateFolderDialogProps } from '../CreateFolderDialog';
import { ERROR_CODE_ITEM_NAME_TOO_LONG, ERROR_CODE_ITEM_NAME_IN_USE } from '../../../../constants';

jest.mock('react-modal', () => {
    return jest.fn(({ children }) => <div>{children}</div>);
});

const defaultProps = {
    appElement: document.createElement('div'),
    errorCode: '',
    isLoading: false,
    isOpen: true,
    onCancel: jest.fn(),
    onCreate: jest.fn(),
    parentElement: document.createElement('div'),
};

describe('elements/common/create-folder-dialog/CreateFolderDialog', () => {
    const renderComponent = (props: Partial<CreateFolderDialogProps> = {}) =>
        render(<CreateFolderDialog {...defaultProps} {...props} />);

    test('renders the dialog with the correct initial state', () => {
        renderComponent();

        expect(screen.getByText('Please enter a name.')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toBeEmptyDOMElement();
        expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    test('calls onCancel when cancel button is clicked', async () => {
        const onCancel = jest.fn();

        renderComponent({ onCancel });
        await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
        expect(onCancel).toHaveBeenCalled();
    });

    test('calls onCreate with the correct values when create button is clicked', async () => {
        const onCreate = jest.fn();

        renderComponent({ onCreate });
        const input = screen.getByRole('textbox');
        await userEvent.clear(input);
        await userEvent.type(input, 'newname');
        await userEvent.click(screen.getByRole('button', { name: 'Create' }));
        expect(onCreate).toHaveBeenCalledWith('newname');
    });

    test('displays an error message when errorCode is neither ERROR_CODE_ITEM_NAME_IN_USE nor ERROR_CODE_ITEM_NAME_TOO_LONG', () => {
        renderComponent({ errorCode: 'bad' });
        expect(screen.getByText('This is an invalid folder name.')).toBeInTheDocument();
    });

    test('displays an error message when errorCode is ERROR_CODE_ITEM_NAME_IN_USE', () => {
        renderComponent({ errorCode: ERROR_CODE_ITEM_NAME_IN_USE });
        expect(screen.getByText('A folder with the same name already exists.')).toBeInTheDocument();
    });

    test('displays an error message when errorCode is ERROR_CODE_ITEM_NAME_TOO_LONG', () => {
        renderComponent({ errorCode: ERROR_CODE_ITEM_NAME_TOO_LONG });
        expect(screen.getByText('This folder name is too long.')).toBeInTheDocument();
    });

    test('does not call onCreate if the name has not changed', async () => {
        const onCancel = jest.fn();
        const onCreate = jest.fn();

        renderComponent({ onCancel, onCreate });
        await userEvent.click(screen.getByText('Create'));
        expect(onCreate).not.toHaveBeenCalled();
    });

    test('calls handleOnCreate on Enter key press', async () => {
        const onCreate = jest.fn();

        renderComponent({ onCreate });
        const input = screen.getByRole('textbox');
        await userEvent.clear(input);
        await userEvent.type(input, 'newname');
        await userEvent.type(input, '{enter}');
        expect(onCreate).toHaveBeenCalledWith('newname');
    });
});
