import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import noop from 'lodash/noop';
import ActionDropdown from '../ActionDropdown';

describe('components/comment/ActionDropdown', () => {
    const commentId = '123';

    describe('should render if at least one callback function is passed', () => {
        test('onResolve', () => {
            render(<ActionDropdown commentId={commentId} onResolve={noop} />);

            expect(screen.getByTestId('Comment-actionDropdown')).toBeVisible();
        });

        test('onEdit', () => {
            render(<ActionDropdown commentId={commentId} onEdit={noop} />);

            expect(screen.getByTestId('Comment-actionDropdown')).toBeVisible();
        });

        test('onDelete', () => {
            render(<ActionDropdown commentId={commentId} onDelete={noop} />);

            expect(screen.getByTestId('Comment-actionDropdown')).toBeVisible();
        });
    });

    test('should not render if callback functions are not passed', () => {
        render(<ActionDropdown commentId={commentId} />);

        expect(screen.queryByTestId('Comment-actionDropdown')).not.toBeInTheDocument();
    });

    test('menu items corresponding to each callback function should be visible in the dropdown', async () => {
        render(<ActionDropdown commentId={commentId} onEdit={noop} onResolve={noop} onDelete={noop} />);

        fireEvent.click(screen.getByTestId('Comment-actionDropdown'));

        expect(await screen.findByTestId('ActionDropdownItem-resolve')).toBeVisible();
        expect(await screen.findByTestId('ActionDropdownItem-edit')).toBeVisible();
        expect(await screen.findByTestId('ActionDropdownItem-delete')).toBeVisible();
    });

    describe('menu items should not be visible if corresponding callback functions are not passed', () => {
        test('onResolve', () => {
            render(<ActionDropdown commentId={commentId} onEdit={noop} onDelete={noop} />);

            fireEvent.click(screen.getByTestId('Comment-actionDropdown'));

            expect(screen.queryByTestId('ActionDropdownItem-resolve')).not.toBeInTheDocument();
        });

        test('onEdit', () => {
            render(<ActionDropdown commentId={commentId} onResolve={noop} onDelete={noop} />);

            fireEvent.click(screen.getByTestId('Comment-actionDropdown'));

            expect(screen.queryByTestId('ActionDropdownItem-edit')).not.toBeInTheDocument();
        });

        test('onDelete', () => {
            render(<ActionDropdown commentId={commentId} onResolve={noop} onEdit={noop} />);

            fireEvent.click(screen.getByTestId('Comment-actionDropdown'));

            expect(screen.queryByTestId('ActionDropdownItem-delete')).not.toBeInTheDocument();
        });
    });

    describe('should run each callback function with commentId when cliked on corresponding menu item', () => {
        test('onResolve', async () => {
            const onResolve = jest.fn();
            render(<ActionDropdown commentId={commentId} onResolve={onResolve} />);

            const menuBtn = screen.getByTestId('Comment-actionDropdown');

            fireEvent.click(menuBtn);
            fireEvent.click(await screen.findByTestId('ActionDropdownItem-resolve'));

            expect(onResolve).toHaveBeenCalledWith(commentId);
        });

        test('onEdit', async () => {
            const onEdit = jest.fn();
            render(<ActionDropdown commentId={commentId} onEdit={onEdit} />);

            const menuBtn = screen.getByTestId('Comment-actionDropdown');

            fireEvent.click(menuBtn);
            fireEvent.click(await screen.findByTestId('ActionDropdownItem-edit'));

            expect(onEdit).toHaveBeenCalledWith(commentId);
        });

        test('onDelete', async () => {
            const onDelete = jest.fn();
            render(<ActionDropdown commentId={commentId} onDelete={onDelete} />);

            const menuBtn = screen.getByTestId('Comment-actionDropdown');

            fireEvent.click(menuBtn);
            fireEvent.click(await screen.findByTestId('ActionDropdownItem-delete'));

            expect(onDelete).toHaveBeenCalledWith(commentId);
        });
    });
});
