import { expect, userEvent, within, fn } from '@storybook/test';

import MetadataSidebar from '../MetadataSidebarRedesign';
import { defaultVisualConfig } from '../../../utils/storybook';

export const basic = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const addTemplateButton = canvas.getByRole('button', { name: /add template/i });

        expect(addTemplateButton).toBeInTheDocument();
        await userEvent.click(addTemplateButton);

        const customMetadataOption = canvas.getByRole('option', { name: /Custom Metadata/i });
        expect(customMetadataOption).toBeInTheDocument();
    },
};

const mockAPI = {
    getFile: fn((id, successCallback) => {
        successCallback({ id, [FIELD_PERMISSIONS_CAN_UPLOAD]: true });
    }),
    getMetadata: fn((_file, successCallback) => {
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
    getFileAPI: fn().mockReturnValue(mockAPI),
    getMetadataAPI: fn().mockReturnValue(mockAPI),
};

export default {
    title: 'Elements/ContentSidebar/MetadataSidebar/tests/visual',
    component: MetadataSidebar,
    args: {
        api,
        fileId: 'test-file-id-1',
        elementId: 'element-1',
        isFeatureEnabled: true,
        onError: fn(),
    },
    parameters: {
        ...defaultVisualConfig.parameters,
    },
};
