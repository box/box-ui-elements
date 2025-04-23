import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { screen, render } from '../../../test-utils/testing-library';
import RemoveCollaboratorConfirmModal from '../RemoveCollaboratorConfirmModal';

describe('features/unified-share-modal/RemoveCollaboratorConfirmModal', () => {
    const renderComponent = (props = {}) =>
        render(<RemoveCollaboratorConfirmModal isOpen onRequestClose={jest.fn()} onSubmit={jest.fn()} {...props} />);

    test('should render a confirmation Modal', async () => {
        const collaborator = { email: 'dt@example.com' };
        const onRequestClose = jest.fn();
        renderComponent({
            onRequestClose,
            collaborator,
        });

        const modal = screen.queryByRole('alertdialog');
        expect(modal).toBeInTheDocument();

        const title = screen.queryByRole('heading', { name: 'Remove Collaborator' });
        expect(title).toBeInTheDocument();

        const description = screen.queryByRole('paragraph');
        expect(description).toHaveTextContent(
            `Are you sure you want to remove ${collaborator.email} as a collaborator?`,
        );

        const submitButton = screen.queryByRole('button', { name: 'Okay' });
        expect(submitButton).toBeInTheDocument();

        const cancelButton = screen.queryByRole('button', { name: 'Cancel' });
        expect(cancelButton).toBeInTheDocument();
        await userEvent.click(cancelButton);

        expect(onRequestClose).toHaveBeenCalledTimes(1);
    });

    test('should call onSubmit callback when submit button is clicked', async () => {
        const onSubmit = jest.fn();
        renderComponent({
            onSubmit,
            collaborator: { email: 'dt@example.com' },
        });

        const submitButton = screen.queryByRole('button', { name: 'Okay' });
        await userEvent.click(submitButton);

        expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    test('should disable modal buttons and set loading state when props.submitting is true', () => {
        renderComponent({
            submitting: true,
            collaborator: { email: 'dt@example.com' },
        });

        const submitButton = screen.queryByRole('button', { name: 'Okay' });
        expect(submitButton).toHaveAttribute('aria-disabled', 'true');

        const cancelButton = screen.queryByRole('button', { name: 'Cancel' });
        expect(cancelButton).toHaveAttribute('aria-disabled', 'true');
    });
});
