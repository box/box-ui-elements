import * as React from 'react';
import userEvent from '@testing-library/user-event';

import { render, screen } from '../../../test-utils/testing-library';
import RenameDialog from '../RenameDialog';
import { ERROR_CODE_ITEM_NAME_TOO_LONG, ERROR_CODE_ITEM_NAME_IN_USE } from '../../../constants';

jest.mock('react-modal', () => {
    return jest.fn(({ children }) => <div aria-label="Rename">{children}</div>);
});

const defaultProps = {
    appElement: document.createElement('div'),
    errorCode: '',
    isLoading: false,
    isOpen: true,
    item: { id: '123', name: 'test.txt', extension: 'txt', type: 'file' },
    onCancel: jest.fn(),
    onRename: jest.fn(),
    parentElement: document.createElement('div'),
};

describe('elements/content-explorer/RenameDialog', () => {
    const renderComponent = (props = {}) => render(<RenameDialog {...defaultProps} {...props} />);

    test('renders the dialog with the correct initial state', () => {
        renderComponent();

        expect(screen.getByText('Please enter a new name for test:')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toHaveValue('test');
        expect(screen.getByDisplayValue('test')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Rename' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    test('calls onCancel when cancel button is clicked', async () => {
        const onCancel = jest.fn();

        renderComponent({ onCancel });
        await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
        expect(onCancel).toHaveBeenCalled();
    });

    test('calls onRename with the correct values when rename button is clicked', async () => {
        const onRename = jest.fn();

        renderComponent({ onRename });
        const input = screen.getByRole('textbox');
        await userEvent.clear(input);
        await userEvent.type(input, 'newname');
        await userEvent.click(screen.getByRole('button', { name: 'Rename' }));
        expect(onRename).toHaveBeenCalledWith('newname', '.txt');
    });

    test('displays an error message is neither ERROR_CODE_ITEM_NAME_IN_USE or ERROR_CODE_ITEM_NAME_TOO_LONG', () => {
        renderComponent({ errorCode: 'something else' });
        expect(screen.getByText('This name is invalid.')).toBeInTheDocument();
    });

    test('displays an error message when errorCode is ERROR_CODE_ITEM_NAME_IN_USE', () => {
        renderComponent({ errorCode: ERROR_CODE_ITEM_NAME_IN_USE });
        expect(screen.getByText('An item with the same name already exists.')).toBeInTheDocument();
    });

    test('displays an error message when errorCode is ERROR_CODE_ITEM_NAME_TOO_LONG', () => {
        renderComponent({ errorCode: ERROR_CODE_ITEM_NAME_TOO_LONG });
        expect(screen.getByText('This name is too long.')).toBeInTheDocument();
    });

    test('does not call onRename if the name has not changed', async () => {
        const onCancel = jest.fn();
        const onRename = jest.fn();

        renderComponent({ onCancel, onRename });
        await userEvent.click(screen.getByText('Rename'));
        expect(onRename).not.toHaveBeenCalled();
        expect(onCancel).toHaveBeenCalled();
    });

    test('calls handleRename on Enter key press', async () => {
        const onRename = jest.fn();

        renderComponent({ onRename });
        const input = screen.getByRole('textbox');
        await userEvent.clear(input);
        await userEvent.type(input, 'newname');
        await userEvent.type(input, '{enter}');
        expect(onRename).toHaveBeenCalledWith('newname', '.txt');
    });
});
