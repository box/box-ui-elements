import * as React from 'react';
import { render, screen, userEvent } from '../../../test-utils/testing-library';
import CancelAllUploadsModal, { type CancelAllUploadsModalProps } from '../CancelAllUploadsModal';

const renderModal = (props: Partial<CancelAllUploadsModalProps> = {}) => {
    const defaultProps: CancelAllUploadsModalProps = {
        isOpen: true,
        onConfirm: jest.fn(),
        onDismiss: jest.fn(),
        ...props,
    };
    render(<CancelAllUploadsModal {...defaultProps} />);
    return defaultProps;
};

describe('elements/content-uploader/CancelAllUploadsModal', () => {
    test('renders heading, body, and both action buttons when open', async () => {
        renderModal();
        expect(await screen.findByRole('alertdialog')).toBeInTheDocument();
        expect(screen.getByText('Cancel all uploads?')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Files that are still uploading will be canceled. Completed uploads will not be affected.',
            ),
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel All' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Keep Uploading' })).toBeInTheDocument();
    });

    test('calls onConfirm when Cancel All is clicked', async () => {
        const props = renderModal();
        const user = userEvent();
        const button = await screen.findByRole('button', { name: 'Cancel All' });
        await user.click(button);
        expect(props.onConfirm).toHaveBeenCalledTimes(1);
        expect(props.onDismiss).not.toHaveBeenCalled();
    });

    test('calls onDismiss when Keep Uploading is clicked', async () => {
        const props = renderModal();
        const user = userEvent();
        const button = await screen.findByRole('button', { name: 'Keep Uploading' });
        await user.click(button);
        expect(props.onDismiss).toHaveBeenCalledTimes(1);
        expect(props.onConfirm).not.toHaveBeenCalled();
    });

    test('does not render dialog when isOpen is false', () => {
        renderModal({ isOpen: false });
        expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });
});
