import * as React from 'react';
import { render, screen, userEvent } from '../../../test-utils/testing-library';
import LargeFileWarningModal, { type LargeFileWarningModalProps } from '../LargeFileWarningModal';

jest.mock('@tanstack/react-virtual', () => ({
    useVirtualizer: ({ count }: { count: number }) => ({
        getTotalSize: () => count * 20,
        getVirtualItems: () =>
            Array.from({ length: count }, (_, index) => ({
                index,
                key: index,
                start: index * 20,
                end: (index + 1) * 20,
                size: 20,
                lane: 0,
            })),
    }),
}));

const renderModal = (props: Partial<LargeFileWarningModalProps> = {}) => {
    const defaultProps: LargeFileWarningModalProps = {
        eligibleCount: 1,
        isOpen: true,
        maxFileSize: 100,
        onCancel: jest.fn(),
        onConfirm: jest.fn(),
        oversizeFiles: [{ name: 'large-file.txt', size: 200 }],
        ...props,
    };
    render(<LargeFileWarningModal {...defaultProps} />);
    return defaultProps;
};

describe('elements/content-uploader/LargeFileWarningModal', () => {
    test('renders singular heading and oversize file details when one file is oversize', async () => {
        renderModal();
        expect(await screen.findByText("File Can't Be Uploaded")).toBeInTheDocument();
        expect(screen.getByText('large-file.txt')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Upload the Rest' })).toBeEnabled();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    test('renders plural heading when multiple files are oversize', async () => {
        renderModal({
            oversizeFiles: [
                { name: 'large-a.txt', size: 200 },
                { name: 'large-b.txt', size: 300 },
            ],
        });
        expect(await screen.findByText("Files Can't Be Uploaded")).toBeInTheDocument();
    });

    test('disables Upload the Rest when no eligible files remain', async () => {
        renderModal({ eligibleCount: 0 });
        expect(await screen.findByRole('button', { name: 'Upload the Rest' })).toBeDisabled();
    });

    test('calls onConfirm when Upload the Rest is clicked', async () => {
        const props = renderModal();
        const user = userEvent();
        await user.click(await screen.findByRole('button', { name: 'Upload the Rest' }));
        expect(props.onConfirm).toHaveBeenCalledTimes(1);
    });

    test('calls onCancel when Cancel is clicked', async () => {
        const props = renderModal();
        const user = userEvent();
        await user.click(await screen.findByRole('button', { name: 'Cancel' }));
        expect(props.onCancel).toHaveBeenCalledTimes(1);
    });

    test('calls onUpgradeCTAClick and onCancel when upgrade link is clicked', async () => {
        const onUpgradeCTAClick = jest.fn();
        const onCancel = jest.fn();
        renderModal({ onUpgradeCTAClick, onCancel });
        const user = userEvent();
        await user.click(await screen.findByRole('button', { name: 'Upgrade your plan' }));
        expect(onUpgradeCTAClick).toHaveBeenCalledTimes(1);
        expect(onCancel).toHaveBeenCalledTimes(1);
    });
});
