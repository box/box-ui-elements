import { expect, userEvent, within } from '@storybook/test';
import { defaultVisualConfig } from '../../../utils/storybook';
import ContentSidebar from '../ContentSidebar';

export const basic = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await canvas.findByRole('heading', { name: /Metadata/i });
        const addTemplateButton = await canvas.findByRole('button', { name: /Add template/i });

        expect(addTemplateButton).toBeInTheDocument();
        await userEvent.click(addTemplateButton);

        const customMetadataOption = canvas.getByRole('option', { name: /Custom Metadata/i });
        expect(customMetadataOption).toBeInTheDocument();
    },
};

const fileIdWithMetadata = global.FILE_ID;
const token = global.TOKEN;
const mockFeatures = {
    'metadata.redesign.enabled': true,
};
const mockLogger = {
    onReadyMetric: ({ endMarkName }) => {
        console.log(`Logger: onReadyMetric called with endMarkName: ${endMarkName}`);
    },
};

const defualtMetadataArgs = {
    fileId: fileIdWithMetadata,
    isFeatureEnabled: true,
    onError: (error, code, context) => console.error('Error:', error, code, context),
};

export default {
    title: 'Elements/ContentSidebar/MetadataSidebarRedesign/tests/interaction-tests',
    component: ContentSidebar,
    args: {
        token,
        metadataSidebarProps: {
            ...defualtMetadataArgs,
        },
        hasMetadata: true,
        features: mockFeatures,
        fileId: fileIdWithMetadata,
        logger: mockLogger,
    },
    parameters: {
        ...defaultVisualConfig.parameters,
    },
};
