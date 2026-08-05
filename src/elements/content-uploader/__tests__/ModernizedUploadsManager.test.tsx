import * as React from 'react';
import { render, screen } from '../../../test-utils/testing-library';
import ModernizedUploadsManager from '../ModernizedUploadsManager';
import { ERROR_CODE_UPLOAD_INSUFFICIENT_PERMISSIONS, STATUS_ERROR } from '../../../constants';

describe('elements/content-uploader/ModernizedUploadsManager', () => {
    const renderComponent = (props = {}) =>
        render(
            <ModernizedUploadsManager
                isExpanded
                items={[]}
                rootFolderId="0"
                onToggle={jest.fn()}
                onItemCancel={jest.fn()}
                onItemRemove={jest.fn()}
                onItemRetry={jest.fn()}
                onCancelAll={jest.fn()}
                onRetryAll={jest.fn()}
                {...props}
            />,
        );

    const buildErroredItem = (error: Record<string, string>) => ({
        name: 'foo.pdf',
        extension: 'pdf',
        progress: 0,
        size: 100,
        status: STATUS_ERROR,
        file: { name: 'foo.pdf' } as File,
        error,
        api: {} as never,
    });

    test('renders localized copy for a known error code instead of the API message', () => {
        renderComponent({
            items: [
                buildErroredItem({
                    code: ERROR_CODE_UPLOAD_INSUFFICIENT_PERMISSIONS,
                    message: 'Untranslated API copy',
                }),
            ],
        });

        expect(screen.getByText("Error: You don't have permission to upload to this folder")).toBeInTheDocument();
        expect(screen.queryByText(/Untranslated API copy/)).not.toBeInTheDocument();
    });

    test('falls back to the API message for an unmapped error code', () => {
        renderComponent({ items: [buildErroredItem({ code: 'UNKNOWN_ERROR_CODE', message: 'Boom' })] });

        expect(screen.getByText('Error: Boom')).toBeInTheDocument();
    });
});
