import { type ComponentProps } from 'react';
import { expect, userEvent, within, fn, screen } from '@storybook/test';
import { type StoryObj } from '@storybook/react';
import { defaultVisualConfig } from '../../../../utils/storybook';
import ContentSidebar from '../../ContentSidebar';
import MetadataSidebarRedesign from '../../MetadataSidebarRedesign';

const fileIdWithMetadata = global.FILE_ID;
const fileWithoutMetadata = '416047501580';
const token = global.TOKEN;

const defaultMetadataArgs = {
    fileId: fileIdWithMetadata,
    isFeatureEnabled: true,
    onError: fn,
};
const defaultMetadataSidebarProps: ComponentProps<typeof MetadataSidebarRedesign> = {
    isBoxAiSuggestionsEnabled: true,
    isFeatureEnabled: true,
    onError: fn,
};
const mockFeatures = {
    'metadata.redesign.enabled': true,
};
const mockLogger = {
    onReadyMetric: ({ endMarkName }) => {
        // eslint-disable-next-line no-console
        console.log(`Logger: onReadyMetric called with endMarkName: ${endMarkName}`);
    },
};

export const Basic = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await canvas.findByRole('heading', { name: 'Metadata' });
        const addTemplateButton = await canvas.findByRole('button', { name: 'Add template' });

        expect(addTemplateButton).toBeInTheDocument();
        await userEvent.click(addTemplateButton);

        const customMetadataOption = canvas.getByRole('option', { name: 'Custom Metadata' });
        expect(customMetadataOption).toBeInTheDocument();
        expect(customMetadataOption).toHaveAttribute('aria-disabled');
    },
};

export const AddTemplateDropdownMenuOnEmpty = {
    args: {
        fileId: '416047501580',
        metadataSidebarProps: {
            isBoxAiSuggestionsEnabled: true,
            isFeatureEnabled: true,
            onError: fn,
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await canvas.findByRole('heading', { name: 'Metadata' });
        const addTemplateButton = await canvas.findByRole('button', { name: 'Add template' });

        expect(addTemplateButton).toBeInTheDocument();
        await userEvent.click(addTemplateButton);

        const options = canvas.getAllByRole('option');
        expect(options).toHaveLength(4);
        options.forEach(option => {
            expect(option).not.toHaveAttribute('disabled');
        });
    },
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

export const AddingNewMetadataTemplate: StoryObj<typeof MetadataSidebarRedesign> = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const heading = await canvas.findByRole('heading', { name: 'Metadata' });
        expect(heading).toBeInTheDocument();

        const addTemplateButton = await canvas.findByRole('button', { name: 'Add template' });
        expect(addTemplateButton).toBeInTheDocument();
        await userEvent.click(addTemplateButton);

        const customMetadataOption = canvas.getByRole('option', { name: 'Virus Scan' });
        expect(customMetadataOption).toBeInTheDocument();
        await userEvent.click(customMetadataOption);

        const templateHeader = await canvas.findByRole('heading', { name: 'Virus Scan' });
        expect(templateHeader).toBeInTheDocument();
    },
};

export const UnsavedChangesModalWhenChoosingDifferentTemplate: StoryObj<typeof MetadataSidebarRedesign> = {
    args: {
        fileId: '416047501580',
        metadataSidebarProps: defaultMetadataSidebarProps,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const heading = await canvas.findByRole('heading', { name: 'Metadata' });
        expect(heading).toBeInTheDocument();

        const addTemplateButton = await canvas.findByRole('button', { name: 'Add template' }, { timeout: 5000 });
        expect(addTemplateButton).toBeInTheDocument();
        await userEvent.click(addTemplateButton);

        const customMetadataOption = canvas.getByRole('option', { name: 'Virus Scan' });
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

export const EmptyStateWithBoxAiEnabled: StoryObj<typeof MetadataSidebarRedesign> = {
    args: {
        fileId: fileWithoutMetadata,
        metadataSidebarProps: {
            ...defaultMetadataSidebarProps,
        },
    },
};

export const EmptyStateWithBoxAiDisabled: StoryObj<typeof MetadataSidebarRedesign> = {
    args: {
        fileId: fileWithoutMetadata,
        metadataSidebarProps: {
            ...defaultMetadataSidebarProps,
            isBoxAiSuggestionsEnabled: false,
        },
    },
};

export const MetadataInstanceEditorWithDefinedTemplate: StoryObj<typeof MetadataSidebarRedesign> = {
    args: {
        fileId: '416047501580',
        metadataSidebarProps: defaultMetadataSidebarProps,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const addTemplateButton = await canvas.findByRole('button', { name: 'Add template' }, { timeout: 5000 });
        await userEvent.click(addTemplateButton);

        const customMetadataOption = canvas.getByRole('option', { name: 'My Template' });
        await userEvent.click(customMetadataOption);
    },
};

export const MetadataInstanceEditorWithCustomTemplate: StoryObj<typeof MetadataSidebarRedesign> = {
    args: {
        fileId: '416047501580',
        metadataSidebarProps: defaultMetadataSidebarProps,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const addTemplateButton = await canvas.findByRole('button', { name: 'Add template' }, { timeout: 5000 });
        await userEvent.click(addTemplateButton);

        const customMetadataOption = canvas.getByRole('option', { name: 'Custom Metadata' });
        await userEvent.click(customMetadataOption);
    },
};

export const MetadataInstanceEditorCancelChanges: StoryObj<typeof MetadataSidebarRedesign> = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const editButtons = await canvas.findAllByRole('button', { name: 'Edit' }, { timeout: 5000 });

        let headlines = await canvas.findAllByRole('heading', { level: 1 });
        expect(headlines).toHaveLength(3);
        expect(headlines.map(heading => heading.textContent)).toEqual(
            expect.arrayContaining(['My Template', 'Select Dropdowns', 'Custom Metadata']),
        );

        // go to edit mode - only edited template is visible
        await userEvent.click(editButtons[0]);

        headlines = await canvas.findAllByRole('heading', { level: 1 });
        expect(headlines).toHaveLength(1);
        expect(headlines.map(heading => heading.textContent)).toEqual(expect.arrayContaining(['My Template']));

        // cancel editing - back to list view
        const cancelButton = await canvas.findByRole('button', { name: 'Cancel' }, { timeout: 5000 });
        await userEvent.click(cancelButton);

        headlines = await canvas.findAllByRole('heading', { level: 1 });
        expect(headlines).toHaveLength(3);
        expect(headlines.map(heading => heading.textContent)).toEqual(
            expect.arrayContaining(['My Template', 'Select Dropdowns', 'Custom Metadata']),
        );
    },
};
