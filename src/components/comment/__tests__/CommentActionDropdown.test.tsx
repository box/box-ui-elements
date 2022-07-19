import React from 'react';
import { IntlProvider } from 'react-intl';
import { render, screen, fireEvent } from '@testing-library/react';
import noop from 'lodash/noop';
import CommentActionDropdown from '../CommentActionDropdown';

jest.mock('react-intl', () => ({
    ...jest.requireActual('react-intl'),
    FormattedMessage: ({ defaultMessage }: { defaultMessage: string }) => <span>{defaultMessage}</span>,
}));

jest.mock('../messages', () => ({
    commentDeleteMenuItem: {
        defaultMessage: 'Delete',
    },
    commentEditMenuItem: {
        defaultMessage: 'Modify',
    },
    commentResolveMenuItem: {
        defaultMessage: 'Resolve',
    },
}));

const commentId = '123';

const Wrapper = ({ children }: { children?: React.ReactNode }) => {
    return <IntlProvider locale="en">{children}</IntlProvider>;
};

const renderWithWrapper = (actionHandlers?: {
    onDelete?: (commentId: string) => void;
    onEdit?: (commentId: string) => void;
    onResolve?: (commentId: string) => void;
}) =>
    render(<CommentActionDropdown commentId={commentId} {...actionHandlers} />, {
        wrapper: Wrapper,
    });

describe('components/comment/CommentActionDropdown', () => {
    describe('should render if at least one callback function is passed', () => {
        test('onResolve', () => {
            renderWithWrapper({ onResolve: noop });

            expect(screen.getByTestId('CommentActionDropdown')).toBeVisible();
        });

        test('onEdit', () => {
            renderWithWrapper({ onEdit: noop });

            expect(screen.getByTestId('CommentActionDropdown')).toBeVisible();
        });

        test('onDelete', () => {
            renderWithWrapper({ onDelete: noop });

            expect(screen.getByTestId('CommentActionDropdown')).toBeVisible();
        });
    });

    test('should not render if callback functions are not passed', () => {
        renderWithWrapper();

        expect(screen.queryByTestId('CommentActionDropdown')).not.toBeInTheDocument();
    });

    test('menu items corresponding to each callback function should be visible in the dropdown', async () => {
        renderWithWrapper({ onResolve: noop, onEdit: noop, onDelete: noop });

        fireEvent.click(screen.getByTestId('CommentActionDropdown'));

        expect(await screen.findByText('Resolve')).toBeVisible();
        expect(await screen.findByText('Modify')).toBeVisible();
        expect(await screen.findByText('Delete')).toBeVisible();
    });

    describe('menu items should not be visible if corresponding callback functions are not passed', () => {
        test('onResolve', () => {
            renderWithWrapper({ onEdit: noop, onDelete: noop });

            fireEvent.click(screen.getByTestId('CommentActionDropdown'));

            expect(screen.queryByText('Resolve')).not.toBeInTheDocument();
        });

        test('onEdit', () => {
            renderWithWrapper({ onResolve: noop, onDelete: noop });

            fireEvent.click(screen.getByTestId('CommentActionDropdown'));

            expect(screen.queryByText('Edit')).not.toBeInTheDocument();
        });

        test('onDelete', () => {
            renderWithWrapper({ onResolve: noop, onEdit: noop });

            fireEvent.click(screen.getByTestId('CommentActionDropdown'));

            expect(screen.queryByText('Delete')).not.toBeInTheDocument();
        });
    });

    describe('should run each callback function with commentId when cliked on corresponding menu item', () => {
        test('onResolve', async () => {
            const onResolve = jest.fn();
            renderWithWrapper({ onResolve });

            const menuBtn = screen.getByTestId('CommentActionDropdown');

            fireEvent.click(menuBtn);
            fireEvent.click(await screen.findByText('Resolve'));

            expect(onResolve).toHaveBeenCalledWith(commentId);
        });

        test('onEdit', async () => {
            const onEdit = jest.fn();
            renderWithWrapper({ onEdit });

            const menuBtn = screen.getByTestId('CommentActionDropdown');

            fireEvent.click(menuBtn);
            fireEvent.click(await screen.findByText('Modify'));

            expect(onEdit).toHaveBeenCalledWith(commentId);
        });

        test('onDelete', async () => {
            const onDelete = jest.fn();
            renderWithWrapper({ onDelete });

            const menuBtn = screen.getByTestId('CommentActionDropdown');

            fireEvent.click(menuBtn);
            fireEvent.click(await screen.findByText('Delete'));

            expect(onDelete).toHaveBeenCalledWith(commentId);
        });
    });
});
