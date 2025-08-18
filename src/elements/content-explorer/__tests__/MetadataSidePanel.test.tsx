import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../../../test-utils/testing-library';
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
        onClose: mockOnClose,
        metadataTemplate: mockMetadataTemplate,
        selectedItemIds: new Set(['1']),
    };

    const renderComponent = (props: Partial<MetadataSidePanelProps> = {}) =>
        render(<MetadataSidePanel {...defaultProps} {...props} />);

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
});
