import React from 'react';
import { userEvent } from '@testing-library/user-event';
import { FIELD_PERMISSIONS_CAN_UPLOAD } from '../../../constants';
import { screen, render } from '../../../test-utils/testing-library';

import {
    MetadataSidebarRedesignComponent as MetadataSidebarRedesign,
    type MetadataSidebarRedesignProps,
} from '../MetadataSidebarRedesign';

describe('elements/content-sidebar/Metadata/MetadataSidebarRedesign', () => {
    const mockFile = {
        id: '123',
        permissions: { [FIELD_PERMISSIONS_CAN_UPLOAD]: true },
    };

    const mockTemplates = [
        {
            id: 'metadata_template_custom_1',
            scope: 'global',
            templateKey: 'properties',
            hidden: false,
        },
    ];

    const mockAPI = {
        getFile: jest.fn((id, successCallback, errorCallback) => {
            try {
                successCallback(mockFile);
            } catch (error) {
                errorCallback(error);
            }
        }),
        getMetadata: jest.fn((_file, successCallback, errorCallback) => {
            try {
                successCallback({
                    editors: [],
                    templates: mockTemplates,
                });
            } catch (error) {
                errorCallback(error);
            }
        }),
    };
    const api = {
        getFileAPI: jest.fn().mockReturnValue(mockAPI),
        getMetadataAPI: jest.fn().mockReturnValue(mockAPI),
    };

    const defaultProps = {
        api,
        fileId: 'test-file-id-1',
        elementId: 'element-1',
        isFeatureEnabled: true,
        onError: jest.fn(),
    } satisfies MetadataSidebarRedesignProps;

    const renderComponent = (props: Partial<MetadataSidebarRedesignProps> = {}) => {
        const ps = { ...defaultProps, ...props } as MetadataSidebarRedesignProps;
        return render(<MetadataSidebarRedesign {...ps} />);
    };

    test('should render title', () => {
        renderComponent();

        expect(screen.getByRole('heading', { level: 3, name: 'Metadata' })).toBeInTheDocument();
    });

    test('should have accessible "Add template" button', () => {
        renderComponent();

        expect(screen.getByRole('button', { name: 'Add template' })).toBeInTheDocument();
    });

    test('should have selectable "Custom Metadata" template in dropdown', async () => {
        renderComponent();

        const addTemplateButton = screen.getByRole('button', { name: 'Add template' });
        await userEvent.click(addTemplateButton);

        const customMetadataOption = screen.getByRole('option', { name: 'Custom Metadata' });
        expect(customMetadataOption).toBeInTheDocument();
        userEvent.click(customMetadataOption);

        // instead of below assertions check if template was added when MetadataInstanceList will be implemented
        await userEvent.click(addTemplateButton);

        expect(customMetadataOption).toHaveAttribute('aria-disabled', 'true');
    });
});
