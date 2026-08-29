import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../../../test-utils/testing-library';
import ShareDialog, { ShareDialogProps } from '../ShareDialog';
import type { BoxItem } from '../../../common/types/core';

jest.mock('react-modal', () => {
    return jest.fn(({ children }) => <div aria-label="Share">{children}</div>);
});

describe('elements/content-explorer/ShareDialog', () => {
    const defaultProps: ShareDialogProps = {
        appElement: document.createElement('div'),
        canSetShareAccess: true,
        isLoading: false,
        isOpen: true,
        item: { id: '1', shared_link: { access: 'open', url: 'http://example.com' } },
        onCancel: jest.fn(),
        onShareAccessChange: jest.fn(),
        parentElement: document.createElement('div'),
    };

    const renderComponent = (props?: Partial<ShareDialogProps>) => render(<ShareDialog {...defaultProps} {...props} />);

    test('renders', async () => {
        renderComponent();
        expect(await screen.findByLabelText('Share')).toBeInTheDocument();
        expect(await screen.findByRole('button', { name: 'Close' }));
    });

    test('calls onCancel when Close button is clicked', async () => {
        renderComponent();
        await userEvent.click(await screen.findByRole('button', { name: 'Close' }));
        expect(defaultProps.onCancel).toHaveBeenCalled();
    });

    test('copies URL to clipboard when Copy button is clicked', async () => {
        renderComponent();
        const copyButton = await screen.findByRole('button', { name: 'Copy' });
        document.execCommand = jest.fn();
        await userEvent.click(copyButton);
        expect(document.execCommand).toHaveBeenCalledWith('copy');
    });

    test('renders loading state when isLoading is true', async () => {
        renderComponent({ isLoading: true });
        expect(await screen.findByRole('status', { name: 'Loading' })).toBeInTheDocument();
    });

    test('renders with empty input when item has no shared link', async () => {
        const itemWithoutSharedLink = { id: '2', shared_link: null } as unknown as BoxItem;
        renderComponent({ item: itemWithoutSharedLink });
        expect(await screen.findByRole('textbox')).toHaveValue('None');
    });
});
