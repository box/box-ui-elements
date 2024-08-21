import { expect, userEvent, within } from '@storybook/test';
import { defaultVisualConfig } from '../../../../utils/storybook';
import ContentSidebar from '../../ContentSidebar';

export const basic = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await canvas.findByRole('heading', { name: 'Metadata' });
        const addTemplateButton = await canvas.findByRole('button', { name: 'Add template' });

        expect(addTemplateButton).toBeInTheDocument();
        await userEvent.click(addTemplateButton);

        const customMetadataOption = canvas.getByRole('option', { name: 'Custom Metadata' });
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

const defaultMetadataArgs = {
    fileId: fileIdWithMetadata,
    isFeatureEnabled: true,
    onError: (error, code, context) => console.error('Error:', error, code, context),
};

export default {
    title: 'Elements/ContentSidebar/MetadataSidebarRedesign/tests/visual-regression-tests',
    component: ContentSidebar,
    args: {
        token,
        metadataSidebarProps: {
            ...defaultMetadataArgs,
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
