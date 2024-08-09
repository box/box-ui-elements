import React from 'react';
import { userEvent } from '@testing-library/user-event';
import { FIELD_PERMISSIONS_CAN_UPLOAD } from '../../../constants';
import { screen, render } from '../../../test-utils/testing-library';

import {
    MetadataSidebarRedesignComponent as MetadataSidebar,
    type MetadataSidebarRedesignProps,
} from '../MetadataSidebarRedesign';

describe('elements/content-sidebar/Metadata/MetadataSidebarRedesigned', () => {
    const mockAPI = {
        getFile: jest.fn((id, successCallback) => {
            successCallback({ id, [FIELD_PERMISSIONS_CAN_UPLOAD]: true });
        }),
        getMetadata: jest.fn((_file, successCallback) => {
            successCallback({
                editors: [],
                templates: [
                    {
                        id: 'metadata_template_custom_1',
                        scope: 'global',
                        templateKey: 'properties',
                        hidden: false,
                    },
                ],
            });
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
        return render(<MetadataSidebar {...ps} />);
    };

    test('should render title', () => {
        renderComponent();

        expect(screen.getByRole('heading', { level: 3, name: 'Metadata' })).toBeInTheDocument();
    });

    test('should have accessible "Add template" button', () => {
        renderComponent();

        expect(screen.getByRole('button', { name: /Add template/i })).toBeInTheDocument();
    });

    test('should have selectable "Custom Metadata" template in dropdown', async () => {
        renderComponent();

        const addTemplateButton = screen.getByRole('button', { name: /Add template/i });
        await userEvent.click(addTemplateButton);

        const customMetadataOption = screen.getByRole('option', { name: /Custom Metadata/i });
        expect(customMetadataOption).toBeInTheDocument();
        userEvent.click(customMetadataOption);

        // instead of below assertions check if template was added when MetadataInstanceList will be implemented
        await userEvent.click(addTemplateButton);

        expect(customMetadataOption).toHaveAttribute('aria-disabled', 'true');
    });
});
