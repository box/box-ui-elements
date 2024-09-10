import { expect, userEvent, within, fn, screen } from '@storybook/test';
import { type StoryObj } from '@storybook/react';
import { defaultVisualConfig } from '../../../../utils/storybook';
import ContentSidebar from '../../ContentSidebar';
import MetadataSidebarRedesign from '../../MetadataSidebarRedesign';

export const Basic = {
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
    onError: fn,
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

export const MetadataInstanceEditorWithCustomMetadata: StoryObj<typeof MetadataSidebarRedesign> = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const heading = await canvas.findByRole('heading', { name: 'Metadata' });
        expect(heading).toBeInTheDocument();

        const addTemplateButton = await canvas.findByRole('button', { name: 'Add template' });
        expect(addTemplateButton).toBeInTheDocument();
        await userEvent.click(addTemplateButton);

        const customMetadataOption = canvas.getByRole('option', { name: 'Custom Metadata' });
        expect(customMetadataOption).toBeInTheDocument();
        await userEvent.click(customMetadataOption);

        const templateHeader = await canvas.findByRole('heading', { name: 'Custom Metadata' });
        expect(templateHeader).toBeInTheDocument();
    },
};

export const MetadataInstanceEditorWithTemplate: StoryObj<typeof MetadataSidebarRedesign> = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const heading = await canvas.findByRole('heading', { name: 'Metadata' });
        expect(heading).toBeInTheDocument();

        const addTemplateButton = await canvas.findByRole('button', { name: 'Add template' });
        expect(addTemplateButton).toBeInTheDocument();
        await userEvent.click(addTemplateButton);

        const customMetadataOption = canvas.getByRole('option', { name: 'My Template' });
        expect(customMetadataOption).toBeInTheDocument();
        await userEvent.click(customMetadataOption);

        const templateHeader = await canvas.findByRole('heading', { name: 'My Template' });
        expect(templateHeader).toBeInTheDocument();
    },
};

export const UnsavedChangesModalWhenChoosingDifferentTemplate: StoryObj<typeof MetadataSidebarRedesign> = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const heading = await canvas.findByRole('heading', { name: 'Metadata' });
        expect(heading).toBeInTheDocument();

        const addTemplateButton = await canvas.findByRole('button', { name: 'Add template' });
        expect(addTemplateButton).toBeInTheDocument();
        await userEvent.click(addTemplateButton);

        const customMetadataOption = canvas.getByRole('option', { name: 'Custom Metadata' });
        expect(customMetadataOption).toBeInTheDocument();
        await userEvent.click(customMetadataOption);

        await userEvent.click(addTemplateButton);
        const myTemplateOption = canvas.getByRole('option', { name: 'My Template' });
        expect(myTemplateOption).toBeInTheDocument();
        await userEvent.click(myTemplateOption);

        const unsavedChangesModal = screen.getByText('Unsaved Changes');
        expect(unsavedChangesModal).toBeInTheDocument();
    },
};
