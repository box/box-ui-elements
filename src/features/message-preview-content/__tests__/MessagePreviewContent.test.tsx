import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '../../../test-utils/testing-library';
import MessagePreviewContent from '../MessagePreviewContent';
import type { Props } from '../MessagePreviewContent';

import ContentPreview from '../../../elements/content-preview';

jest.mock('../../../elements/content-preview', () => ({
    __esModule: true,
    default: jest.fn(),
}));

const MockContentPreview = ContentPreview as jest.MockedFunction<typeof ContentPreview>;

const defaultProps: Props = {
    apiHost: 'https://api.box.com/',
    fileId: '89283839922',
    getToken: jest.fn(),
    sharedLink: 'https://cloud.box.com/s/asdf',
};

const renderComponent = (props?: Partial<Props>) => render(<MessagePreviewContent {...defaultProps} {...props} />);

describe('components/message-preview-content/MessagePreviewContent', () => {
    beforeEach(() => {
        MockContentPreview.mockImplementation(function MockPreview({ className, onError, onLoad, componentRef }) {
            const [isLoaded, setIsLoaded] = React.useState(false);

            React.useEffect(() => {
                if (componentRef?.current) {
                    componentRef.current.getViewer = () => ({
                        disableViewerControls: jest.fn(),
                    });
                }
            }, [componentRef]);

            const handleLoad = async () => {
                if (componentRef?.current) {
                    componentRef.current.getViewer = () => ({
                        disableViewerControls: jest.fn(),
                    });
                }
                setIsLoaded(true);
                await Promise.resolve(); // Ensure state update completes
                onLoad?.();
            };

            return (
                <div data-testid="content-preview" className={className}>
                    <button onClick={() => onError?.()}>Trigger Error</button>
                    <button onClick={handleLoad}>Trigger Load</button>
                    {isLoaded && <div data-testid="preview-loaded" />}
                </div>
            );
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    test('should show loading state initially', async () => {
        const { container } = renderComponent();

        await waitFor(() => {
            expect(screen.getByTestId('message-preview-ghost')).toBeInTheDocument();
            expect(container.querySelector('.MessagePreviewContent')).toHaveClass('is-loading');
            expect(screen.getByTestId('content-preview')).toBeInTheDocument();
        });
    });

    test('should show error notification on preview error', async () => {
        const user = userEvent.setup();
        const { container } = renderComponent();

        await waitFor(() => {
            expect(screen.getByTestId('content-preview')).toBeInTheDocument();
        });

        const errorButton = screen.getByText('Trigger Error');
        await user.click(errorButton);

        await waitFor(() => {
            expect(screen.getByTestId('preview-error-notification')).toBeInTheDocument();
            expect(container.querySelector('.MessagePreviewContent')).not.toHaveClass('is-loading');
        });
    });

    test('should remove loading state when content is loaded', async () => {
        const user = userEvent.setup();
        const { container } = renderComponent();

        // Wait for initial render
        const preview = await screen.findByTestId('content-preview');
        expect(preview).toBeInTheDocument();

        // Find and click load button
        const loadButton = await screen.findByText('Trigger Load');
        await user.click(loadButton);

        // Wait for loading state to be removed
        await waitFor(
            () => {
                expect(screen.queryByTestId('message-preview-ghost')).not.toBeInTheDocument();
            },
            { timeout: 3000 },
        );

        // Verify loading class is removed
        expect(container.querySelector('.MessagePreviewContent')).not.toHaveClass('is-loading');
    });
});
