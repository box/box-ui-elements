import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '../../../test-utils/testing-library';
import APICache from '../../../utils/Cache';

import PreviewDialog, { PreviewDialogProps } from '../PreviewDialog';

jest.mock('react-modal', () => {
    return jest.fn(({ children, onRequestClose }) => (
        <div aria-label="Preview">
            <button aria-label="Close" onClick={onRequestClose}>
                Close
            </button>
            {children}
        </div>
    ));
});

describe('elements/content-explorer/PreviewDialog', () => {
    const defaultProps = {
        appElement: document.body,
        apiHost: 'https://api.box.com',
        appHost: 'https://app.box.com',
        cache: new APICache(),
        canDownload: true,
        contentPreviewProps: {},
        currentCollection: { items: [{ id: '1', type: 'file' }] },
        isOpen: true,
        isTouch: false,
        item: { id: '1', type: 'file' },
        onCancel: jest.fn(),
        onDownload: jest.fn(),
        onPreview: jest.fn(),
        parentElement: document.createElement('div'),
        previewLibraryVersion: '1.0.0',
        staticHost: 'https://static.box.com',
        staticPath: '/static',
        token: 'token',
    };

    const renderComponent = (props?: Partial<PreviewDialogProps>) =>
        render(<PreviewDialog {...defaultProps} {...props} />);

    test('renders', async () => {
        renderComponent();
        expect(await screen.findByLabelText('Preview')).toBeInTheDocument();
        expect(await screen.findByRole('button', { name: 'Close' }));
    });

    test('calls onCancel when modal is closed', async () => {
        const onCancel = jest.fn();
        renderComponent({ onCancel });
        const closeButton = screen.getByRole('button', { name: 'Close' });
        // Ensure we have the right close button by checking its parent
        expect(closeButton.closest('.bcpr-PreviewHeader-button-close')).toBeTruthy();
        await userEvent.click(closeButton);
        expect(onCancel).toHaveBeenCalled();
    });

    test('does not render when item is null', () => {
        const props = { item: null };
        const { container } = renderComponent(props);
        expect(container.firstChild).toBeNull();
    });

    test('does not render when items are null', () => {
        const props = { currentCollection: { items: null } };
        const { container } = renderComponent(props);
        expect(container.firstChild).toBeNull();
    });

    test('calls onPreview with cloned data on load', () => {
        const data = { id: '1', type: 'file' };
        renderComponent();
        waitFor(() => {
            expect(defaultProps.onPreview).toHaveBeenCalledWith(expect.objectContaining(data));
        });
    });
});
