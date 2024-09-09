import * as React from 'react';
import { render, screen } from '../../../test-utils/testing-library';
import ItemAction from '../ItemAction';

describe('elements/content-uploader/ItemAction', () => {
    const renderComponent = (props = {}) => {
        const defaultProps = {
            isResumableUploadsEnabled: false,
            onClick: jest.fn(),
            status: 'pending',
        };
        return render(<ItemAction {...defaultProps} {...props} />);
    };

    test.each`
        status          | label
        ${'complete'}   | ${'Remove'}
        ${'error'}      | ${'Retry'}
        ${'inprogress'} | ${'Cancel this upload'}
        ${'pending'}    | ${'Cancel this upload'}
        ${'staged'}     | ${'Cancel this upload'}
        ${'unknown'}    | ${'Cancel this upload'}
    `('renders icon button when status is `$status` and resumable uploads is disabled', ({ label, status }) => {
        renderComponent({ isResumableUploadsEnabled: false, status });
        expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
    });

    test.each(['inprogress', 'pending', 'staged', 'unknown'])(
        'renders loading indicator when status is `%s` and resumable uploads is enabled',
        status => {
            renderComponent({ isResumableUploadsEnabled: true, status });
            expect(screen.queryByRole('button')).not.toBeInTheDocument();
            expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
        },
    );

    test('renders correctly when status is `complete` and resumable uploads is enabled', () => {
        renderComponent({ isResumableUploadsEnabled: true, status: 'complete' });
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
        expect(screen.getByRole('img', { name: 'Complete' })).toBeInTheDocument();
    });

    test('renders correctly when status is `error` and resumable uploads is enabled', () => {
        renderComponent({ isResumableUploadsEnabled: true, status: 'error' });
        expect(screen.getByRole('button', { name: 'Resume' })).toBeInTheDocument();
    });

    test.each(['complete', 'error', 'inprogress', 'staged', 'unknown'])(
        'renders an empty component when item is folder and status is `%s`',
        status => {
            const { container } = renderComponent({ isFolder: true, status });
            expect(container).toBeEmptyDOMElement();
        },
    );

    test('does not render an empty component when item is folder and status is `pending`', () => {
        const { container } = renderComponent({ isFolder: true, status: 'pending' });
        expect(container).not.toBeEmptyDOMElement();
    });

    test('renders CTA button when status is `error` and code is `file_size_limit_exceeded`', () => {
        renderComponent({ error: { code: 'file_size_limit_exceeded' }, onUpgradeCTAClick: jest.fn(), status: 'error' });
        expect(screen.getByRole('button', { name: 'Upgrade' })).toBeInTheDocument();
    });

    test('does not render CTA button when status is `error` and code is not `file_size_limit_exceeded`', () => {
        renderComponent({ error: { code: 'unknown' }, onUpgradeCTAClick: jest.fn(), status: 'error' });
        expect(screen.queryByRole('button', { name: 'Upgrade' })).not.toBeInTheDocument();
    });
});
