import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { Notification } from '@box/blueprint-web';
import { render, screen, waitFor } from '../../../test-utils/testing-library';
import MetadataSidePanel, { type MetadataSidePanelProps } from '../MetadataSidePanel';

// Mock scrollTo method
Object.defineProperty(Element.prototype, 'scrollTo', {
    value: jest.fn(),
    writable: true,
});

const mockCollection = {
    items: [
        {
            id: '1',
            name: 'Test File 1.pdf',
            type: 'file',
            metadata: {
                enterprise_123: {
                    mockTemplate: {
                        alias: 'mock-alias-1',
                    },
                },
            },
        },
        {
            id: '2',
            name: 'Test File 2.docx',
            type: 'file',
            metadata: {
                enterprise_123: {
                    mockTemplate: {
                        alias: 'mock-alias-2',
                    },
                },
            },
        },
    ],
    nextMarker: null,
    offset: 0,
    totalCount: 2,
};

const mockMetadataTemplate = {
    id: 'template-id',
    displayName: 'Mock Template',
    scope: 'enterprise_123',
    templateKey: 'mockTemplate',
    type: 'metadata_template',
    hidden: false,
    fields: [
        {
            id: '123',
            key: 'alias',
            displayName: 'Alias',
            type: 'string',
            hidden: false,
            options: [],
        },
    ],
};

const mockOnClose = jest.fn();

describe('elements/content-explorer/MetadataSidePanel', () => {
    const defaultProps: MetadataSidePanelProps = {
        currentCollection: mockCollection,
        getOperations: jest.fn(),
        metadataTemplate: mockMetadataTemplate,
        onClose: mockOnClose,
        onUpdate: jest.fn(),
        refreshCollection: jest.fn(),
        selectedItemIds: new Set(['1']),
    };

    const renderComponent = (props: Partial<MetadataSidePanelProps> = {}) =>
        render(
            <Notification.Provider>
                <Notification.Viewport />
                <MetadataSidePanel {...defaultProps} {...props} />
            </Notification.Provider>,
        );

    test('renders the metadata title', () => {
        renderComponent();
        expect(screen.getByText('Metadata')).toBeInTheDocument();
    });

    test('renders the close button with proper aria-label', () => {
        renderComponent();
        const closeButton = screen.getByLabelText('Close');
        expect(closeButton).toBeInTheDocument();
    });

    test('renders the selected item text', () => {
        renderComponent();
        expect(screen.getByText('Test File 1.pdf')).toBeInTheDocument();
    });

    test('renders metadata instance (view mode) by default', () => {
        renderComponent();
        const editTemplateButton = screen.getByLabelText('Edit Mock Template');
        expect(editTemplateButton).toBeInTheDocument();
    });

    test('renders field value of selected item', () => {
        renderComponent();
        const fieldValue = screen.getByText('mock-alias-1');
        expect(fieldValue).toBeInTheDocument();
    });

    test('call onClose when close button is clicked', async () => {
        renderComponent();
        const closeButton = screen.getByLabelText('Close');
        await userEvent.click(closeButton);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('render correct subtitle when multiple items are selected', () => {
        renderComponent({ selectedItemIds: new Set(['1', '2']) });
        const subtitle = screen.getByText('2 files selected');
        expect(subtitle).toBeInTheDocument();
    });

    test('render cancel and submit button when in edit mode', async () => {
        renderComponent();
        const editTemplateButton = screen.getByLabelText('Edit Mock Template');
        await userEvent.click(editTemplateButton);

        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        expect(cancelButton).toBeInTheDocument();
        const submitButton = screen.getByRole('button', { name: 'Save' });
        expect(submitButton).toBeInTheDocument();
    });

    test('switches back to view mode when cancel button is clicked', async () => {
        renderComponent();
        const editTemplateButton = screen.getByLabelText('Edit Mock Template');
        await userEvent.click(editTemplateButton);

        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        await userEvent.click(cancelButton);

        // Should be back in view mode
        expect(screen.getByLabelText('Edit Mock Template')).toBeInTheDocument();
    });

    test('calls onUpdate when form is submitted for single item', async () => {
        const mockUpdateMetadata = jest.fn().mockResolvedValue(undefined);
        renderComponent({ onUpdate: mockUpdateMetadata });

        const editTemplateButton = screen.getByLabelText('Edit Mock Template');
        await userEvent.click(editTemplateButton);

        const submitButton = screen.getByRole('button', { name: 'Save' });
        await userEvent.click(submitButton);

        expect(mockUpdateMetadata).toHaveBeenCalledWith(
            mockCollection.items[0],
            expect.any(Array),
            expect.any(Function),
            expect.any(Function),
        );
    });

    test('calls getOperations and onUpdate for each item when multiple items are selected', async () => {
        const mockUpdateMetadata = jest.fn().mockResolvedValue(undefined);
        const mockGetOperations = jest.fn().mockReturnValue([]);

        renderComponent({
            selectedItemIds: new Set(['1', '2']),
            onUpdate: mockUpdateMetadata,
            getOperations: mockGetOperations,
        });

        const editTemplateButton = screen.getByLabelText('Edit Mock Template');
        await userEvent.click(editTemplateButton);

        const submitButton = screen.getByRole('button', { name: 'Save' });
        await userEvent.click(submitButton);

        await waitFor(() => {
            expect(mockGetOperations).toHaveBeenCalledTimes(2);
            expect(mockUpdateMetadata).toHaveBeenCalledTimes(2);
        });
    });

    test('displays success notification when metadata update succeeds', async () => {
        const mockUpdateMetadata = jest.fn().mockImplementation((_, __, successCallback) => {
            successCallback();
            return Promise.resolve();
        });
        const mockRefreshCollection = jest.fn();

        renderComponent({
            onUpdate: mockUpdateMetadata,
            refreshCollection: mockRefreshCollection,
        });

        const editTemplateButton = screen.getByLabelText('Edit Mock Template');
        await userEvent.click(editTemplateButton);

        const submitButton = screen.getByRole('button', { name: 'Save' });
        await userEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('1 document updated')).toBeInTheDocument();
            expect(mockRefreshCollection).toHaveBeenCalledTimes(1);
            expect(screen.getByLabelText('Edit Mock Template')).toBeInTheDocument(); // Back to view mode
        });
    });

    test('displays error notification when metadata update fails', async () => {
        const mockUpdateMetadata = jest.fn().mockImplementation((_, __, ___, errorCallback) => {
            errorCallback();
            return Promise.resolve();
        });

        renderComponent({ onUpdate: mockUpdateMetadata });

        const editTemplateButton = screen.getByLabelText('Edit Mock Template');
        await userEvent.click(editTemplateButton);

        const submitButton = screen.getByRole('button', { name: 'Save' });
        await userEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Unable to save changes. Please try again')).toBeInTheDocument();
        });
    });

    test('displays error notification when multiple item update fails', async () => {
        const mockUpdateMetadata = jest.fn().mockRejectedValue(new Error('Update failed'));
        const mockGetOperations = jest.fn().mockReturnValue([]);

        renderComponent({
            selectedItemIds: new Set(['1', '2']),
            onUpdate: mockUpdateMetadata,
            getOperations: mockGetOperations,
        });

        const editTemplateButton = screen.getByLabelText('Edit Mock Template');
        await userEvent.click(editTemplateButton);

        const submitButton = screen.getByRole('button', { name: 'Save' });
        await userEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Unable to save changes. Please try again')).toBeInTheDocument();
        });
    });

    test('handles "all" selection correctly', () => {
        renderComponent({ selectedItemIds: 'all' });
        const subtitle = screen.getByText('2 files selected');
        expect(subtitle).toBeInTheDocument();
    });

    test('displays "Multiple Values" for items with different field values', () => {
        const collectionWithDifferentValues = {
            ...mockCollection,
            items: [
                {
                    ...mockCollection.items[0],
                    metadata: {
                        enterprise_123: {
                            mockTemplate: {
                                alias: 'value-1',
                            },
                        },
                    },
                },
                {
                    ...mockCollection.items[1],
                    metadata: {
                        enterprise_123: {
                            mockTemplate: {
                                alias: 'value-2',
                            },
                        },
                    },
                },
            ],
        };

        renderComponent({
            currentCollection: collectionWithDifferentValues,
            selectedItemIds: new Set(['1', '2']),
        });

        expect(screen.getByText('Multiple Values')).toBeInTheDocument();
    });

    test('renders correct accessibility attributes', () => {
        renderComponent();

        // Close button should have proper aria-label
        const closeButton = screen.getByLabelText('Close');
        expect(closeButton).toHaveAttribute('aria-label', 'Close');

        // Edit button should have proper aria-label
        const editButton = screen.getByLabelText('Edit Mock Template');
        expect(editButton).toHaveAttribute('aria-label', 'Edit Mock Template');
    });
});
