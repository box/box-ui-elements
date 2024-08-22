import React from 'react';
import { userEvent } from '@testing-library/user-event';
import { screen, render } from '../../../test-utils/testing-library';
import { FIELD_PERMISSIONS_CAN_UPLOAD } from '../../../constants';
import {
    MetadataSidebarRedesignComponent as MetadataSidebarRedesign,
    type MetadataSidebarRedesignProps,
} from '../MetadataSidebarRedesign';
import useSidebarMetadataFetcher, { STATUS } from '../hooks/useSidebarMetadataFetcher';

jest.mock('../hooks/useSidebarMetadataFetcher');
const mockUseSidebarMetadataFetcher = useSidebarMetadataFetcher as jest.MockedFunction<
    typeof useSidebarMetadataFetcher
>;

describe('elements/content-sidebar/Metadata/MetadataSidebarRedesign', () => {
    const mockTemplates = [
        {
            id: 'metadata_template_custom_1',
            scope: 'global',
            templateKey: 'properties',
            hidden: false,
        },
    ];

    const mockFile = {
        id: '123',
        permissions: { [FIELD_PERMISSIONS_CAN_UPLOAD]: true },
    };

    const defaultProps = {
        api: {},
        fileId: 'test-file-id-1',
        elementId: 'element-1',
        isFeatureEnabled: true,
        onError: jest.fn(),
    } satisfies MetadataSidebarRedesignProps;

    beforeEach(() => {
        mockUseSidebarMetadataFetcher.mockReturnValue({
            templates: mockTemplates,
            errorMessage: null,
            status: STATUS.SUCCESS,
            file: mockFile,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should render title', () => {
        render(<MetadataSidebarRedesign {...defaultProps} />);

        expect(screen.getByRole('heading', { level: 3, name: 'Metadata' })).toBeInTheDocument();
    });

    test('should have accessible "Add template" button', () => {
        render(<MetadataSidebarRedesign {...defaultProps} />);

        expect(screen.getByRole('button', { name: 'Add template' })).toBeInTheDocument();
    });

    test('should have selectable "Custom Metadata" template in dropdown', async () => {
        render(<MetadataSidebarRedesign {...defaultProps} />);

        const addTemplateButton = screen.getByRole('button', { name: 'Add template' });
        await userEvent.click(addTemplateButton);

        const customMetadataOption = screen.getByRole('option', { name: 'Custom Metadata' });
        expect(customMetadataOption).toBeInTheDocument();
        userEvent.click(customMetadataOption);

        // instead of below assertions check if template was added when MetadataInstanceList will be implemented
        await userEvent.click(addTemplateButton);

        expect(customMetadataOption).toHaveAttribute('aria-disabled', 'true');
    });

    test('should render metadata sidebar with error', async () => {
        mockUseSidebarMetadataFetcher.mockReturnValue({
            templates: [],
            errorMessage: {
                id: 'error',
                defaultMessage: 'error message',
            },
            status: STATUS.ERROR,
            file: mockFile,
        });

        const errorMessage = { id: 'error', defaultMessage: 'error message' };
        render(<MetadataSidebarRedesign {...defaultProps} />);

        expect(screen.getByRole('heading', { level: 3, name: 'Metadata' })).toBeInTheDocument();
        expect(screen.getByText(errorMessage.defaultMessage)).toBeInTheDocument();
    });

    test('should render metadata sidebar with loading indicator', async () => {
        mockUseSidebarMetadataFetcher.mockReturnValue({
            templates: [],
            errorMessage: null,
            status: STATUS.LOADING,
            file: mockFile,
        });

        render(<MetadataSidebarRedesign {...defaultProps} />);

        expect(screen.getByRole('heading', { level: 3, name: 'Metadata' })).toBeInTheDocument();
        expect(screen.getByTestId('loading')).toBeInTheDocument();
    });
});
