import { type ComponentProps } from 'react';
import { http, HttpResponse } from 'msw';
import { expect, userEvent, waitFor, within, fn, screen } from '@storybook/test';
import { type StoryObj } from '@storybook/react';
import ContentSidebar from '../../ContentSidebar';
import MetadataSidebarRedesign from '../../MetadataSidebarRedesign';
import {
    aiSuggestionForDateField,
    aiSuggestionsForMyAttribute,
    fileIdWithMetadata,
    fileIdWithoutMetadata,
    mockEmptyMetadataInstances,
    mockEnterpriseMetadataTemplates,
    mockErrorDeleteMyTemplateMetadataRequest,
    mockFileRequest,
    mockFileRequestWithoutMetadata,
    mockGlobalMetadataTemplates,
    mockMetadataInstances,
} from '../__mocks__/MetadataSidebarRedesignedMocks';
import { mockUserRequest } from '../../../__mocks__/mockRequests';

const token = global.TOKEN;

const defaultMetadataArgs = {
    fileId: fileIdWithMetadata,
    isFeatureEnabled: true,
    onError: fn,
};
const defaultMetadataSidebarProps: ComponentProps<typeof MetadataSidebarRedesign> = {
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

export const AddTemplateDropdownMenuOn = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const addTemplateButton = await canvas.findByRole('button', { name: 'Add template' }, { timeout: 2000 });

        expect(addTemplateButton).toBeInTheDocument();
        await userEvent.click(addTemplateButton);

        const customMetadataOption = canvas.getByRole('option', { name: 'Custom Metadata' });
        expect(customMetadataOption).toBeInTheDocument();
        expect(customMetadataOption).toHaveAttribute('aria-disabled');
    },
};

export const AddTemplateDropdownMenuOnEmpty = {
    args: {
        fileId: fileIdWithoutMetadata,
        metadataSidebarProps: {
            isBoxAiSuggestionsEnabled: true,
            isFeatureEnabled: true,
            onError: fn,
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const addTemplateButton = await canvas.findByRole('button', { name: 'Add template' }, { timeout: 2000 });

        expect(addTemplateButton).toBeInTheDocument();
        await userEvent.click(addTemplateButton);

        const options = canvas.getAllByRole('option');
        expect(options).toHaveLength(5);
        options.forEach(option => {
            expect(option).not.toHaveAttribute('disabled');
        });
    },
};

export const FilterInstancesDropdown = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await waitFor(
            async () => {
                const filterInstancesButton = await canvas.findByRole('combobox');

                expect(filterInstancesButton).toBeInTheDocument();
                await userEvent.click(filterInstancesButton);

                const firstOption = canvas.getByRole('option', { name: 'My Template' });
                expect(firstOption).toBeInTheDocument();
                const secondOption = canvas.getByRole('option', { name: 'Select Dropdowns' });
                expect(secondOption).toBeInTheDocument();
                const thirdOption = canvas.getByRole('option', { name: 'Custom Metadata' });
                expect(thirdOption).toBeInTheDocument();

                await userEvent.click(firstOption);

                const headlines = await canvas.findAllByRole('heading', { level: 4 });
                expect(headlines).toHaveLength(1);
                expect(headlines[0].textContent).toEqual(expect.arrayContaining(['My Template']));
            },
            { timeout: 2000 },
        );
    },
};

const defaultMockHandlers = [
    http.get(mockUserRequest.url, () => {
        return HttpResponse.json(mockUserRequest.response);
    }),
    http.get(mockFileRequest.url, () => {
        return HttpResponse.json(mockFileRequest.response);
    }),
    http.get(mockFileRequestWithoutMetadata.url, () => {
        return HttpResponse.json(mockFileRequestWithoutMetadata.response);
    }),
    http.get(mockMetadataInstances.url, () => {
        return HttpResponse.json(mockMetadataInstances.response);
    }),
    http.get(mockGlobalMetadataTemplates.url, () => {
        return HttpResponse.json(mockGlobalMetadataTemplates.response);
    }),
    http.get(mockEmptyMetadataInstances.url, () => {
        return HttpResponse.json(mockEmptyMetadataInstances.response);
    }),
    http.get(mockEnterpriseMetadataTemplates.url, () => {
        return HttpResponse.json(mockEnterpriseMetadataTemplates.response);
    }),
];

export const AddingNewMetadataTemplate: StoryObj<typeof MetadataSidebarRedesign> = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

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
        fileId: fileIdWithoutMetadata,
        metadataSidebarProps: defaultMetadataSidebarProps,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const addTemplateButton = await canvas.findByRole('button', { name: 'Add template' });
        expect(addTemplateButton).toBeInTheDocument();
        await userEvent.click(addTemplateButton);

        const customMetadataOption = canvas.getByRole('option', { name: 'Virus Scan' });
        expect(customMetadataOption).toBeInTheDocument();
        await userEvent.click(customMetadataOption);

        await userEvent.click(addTemplateButton);
        const myTemplateOption = canvas.getByRole('option', { name: 'My Template' });
        expect(myTemplateOption).toBeInTheDocument();
        await userEvent.click(myTemplateOption);

        const unsavedChangesModal = await screen.findByRole(
            'heading',
            { level: 2, name: 'Unsaved Changes' },
            { timeout: 5000 },
        );
        expect(unsavedChangesModal).toBeInTheDocument();
    },
};

export const EmptyStateWithBoxAiEnabled: StoryObj<typeof MetadataSidebarRedesign> = {
    args: {
        fileId: fileIdWithoutMetadata,
        metadataSidebarProps: {
            ...defaultMetadataSidebarProps,
        },
        features: {
            ...mockFeatures,
            'metadata.aiSuggestions.enabled': true,
        },
    },
};

export const EmptyStateWithBoxAiDisabled: StoryObj<typeof MetadataSidebarRedesign> = {
    args: {
        fileId: fileIdWithoutMetadata,
        metadataSidebarProps: {
            ...defaultMetadataSidebarProps,
            isBoxAiSuggestionsEnabled: false,
        },
    },
};

export const MetadataInstanceEditorWithDefinedTemplate: StoryObj<typeof MetadataSidebarRedesign> = {
    args: {
        fileId: fileIdWithoutMetadata,
        metadataSidebarProps: defaultMetadataSidebarProps,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const addTemplateButton = await canvas.findByRole('button', { name: 'Add template' });
        await userEvent.click(addTemplateButton);

        const customMetadataOption = canvas.getByRole('option', { name: 'My Template' });
        await userEvent.click(customMetadataOption);
    },
};

export const MetadataInstanceEditorWithCustomTemplate: StoryObj<typeof MetadataSidebarRedesign> = {
    args: {
        fileId: fileIdWithoutMetadata,
        metadataSidebarProps: defaultMetadataSidebarProps,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const addTemplateButton = await canvas.findByRole('button', { name: 'Add template' }, { timeout: 2000 });
        await userEvent.click(addTemplateButton);

        const customMetadataOption = canvas.getByRole('option', { name: 'Custom Metadata' });
        await userEvent.click(customMetadataOption);
    },
};

export const MetadataInstanceEditorCancelChanges: StoryObj<typeof MetadataSidebarRedesign> = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Edit buttons contains also template name
        const editButton = await canvas.findByRole('button', { name: 'Edit My Template' });
        expect(editButton).toBeInTheDocument();

        let headlines = await canvas.findAllByRole('heading', { level: 4 });
        expect(headlines).toHaveLength(3);
        expect(headlines.map(heading => heading.textContent)).toEqual(
            expect.arrayContaining(['My Template', 'Select Dropdowns', 'Custom Metadata']),
        );

        // go to edit mode - only edited template is visible
        await userEvent.click(editButton);

        headlines = await canvas.findAllByRole('heading', { level: 4 });
        expect(headlines).toHaveLength(1);
        expect(headlines.map(heading => heading.textContent)).toEqual(expect.arrayContaining(['My Template']));

        // cancel editing - back to list view
        const cancelButton = await canvas.findByRole('button', { name: 'Cancel' });
        await userEvent.click(cancelButton);

        headlines = await canvas.findAllByRole('heading', { level: 4 });
        expect(headlines).toHaveLength(3);
        expect(headlines.map(heading => heading.textContent)).toEqual(
            expect.arrayContaining(['My Template', 'Select Dropdowns', 'Custom Metadata']),
        );
    },
};

export const DeleteButtonIsDisabledWhenAddingNewMetadataTemplate: StoryObj<typeof MetadataSidebarRedesign> = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const addTemplateButton = await canvas.findByRole('button', { name: 'Add template' });
        expect(addTemplateButton).toBeInTheDocument();
        await userEvent.click(addTemplateButton);

        const customMetadataOption = canvas.getByRole('option', { name: 'Virus Scan' });
        expect(customMetadataOption).toBeInTheDocument();
        await userEvent.click(customMetadataOption);

        const deleteButton = await canvas.findByRole('button', { name: 'Delete' });
        expect(deleteButton).toBeDisabled();
    },
};

export const DeleteButtonIsEnabledWhenEditingMetadataTemplateInstance: StoryObj<typeof MetadataSidebarRedesign> = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const editMetadataInstanceButton = await canvas.findByRole('button', { name: 'Edit My Template' });
        expect(editMetadataInstanceButton).toBeInTheDocument();
        await userEvent.click(editMetadataInstanceButton);

        const deleteButton = await canvas.findByRole('button', { name: 'Delete' });
        expect(deleteButton).toBeEnabled();
    },
};

export const MetadataInstanceEditorAddTemplateAgainAfterCancel: StoryObj<typeof MetadataSidebarRedesign> = {
    args: {
        fileId: fileIdWithoutMetadata,
        metadataSidebarProps: defaultMetadataSidebarProps,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const addTemplateButton = await canvas.findByRole('button', { name: 'Add template' });

        await userEvent.click(addTemplateButton);

        const templateMetadataOption = canvas.getByRole('option', { name: 'My Template' });
        expect(templateMetadataOption).not.toHaveAttribute('aria-disabled');
        await userEvent.click(templateMetadataOption);

        // Check if currently open template is disabled in dropdown
        await userEvent.click(addTemplateButton);
        const templateMetadataOptionDisabled = canvas.getByRole('option', { name: 'My Template' });
        expect(templateMetadataOptionDisabled).toHaveAttribute('aria-disabled');

        // Check if template available again after cancelling
        const cancelButton = await canvas.findByRole('button', { name: 'Cancel' });
        await userEvent.click(cancelButton);
        await userEvent.click(addTemplateButton);
        const templateMetadataOptionEnabled = canvas.getByRole('option', { name: 'My Template' });
        expect(templateMetadataOptionEnabled).not.toHaveAttribute('aria-disabled');
    },
};

export const SwitchEditingTemplateInstances: StoryObj<typeof MetadataSidebarRedesign> = {
    args: {
        fileId: '416047501580',
        metadataSidebarProps: defaultMetadataSidebarProps,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // open and edit a new template
        const addTemplateButton = await canvas.findByRole('button', { name: 'Add template' });

        await userEvent.click(addTemplateButton);

        const templateMetadataOption = canvas.getByRole('option', { name: 'My Template' });

        await userEvent.click(templateMetadataOption);

        const input = await canvas.findByRole('textbox');

        await userEvent.type(input, 'Lorem ipsum dolor.');

        // open another template while editing the first one (with discarding changes)
        await userEvent.click(addTemplateButton);

        const templateMetadataOptionA = canvas.getByRole('option', { name: 'My Template' });
        const templateMetadataOptionB = canvas.getByRole('option', { name: 'Virus Scan' });

        expect(templateMetadataOptionA).toHaveAttribute('aria-disabled');
        expect(templateMetadataOptionB).not.toHaveAttribute('aria-disabled');

        await userEvent.click(templateMetadataOptionB);

        const unsavedChangesModal = await screen.findByRole(
            'heading',
            { level: 2, name: 'Unsaved Changes' },
            { timeout: 5000 },
        );
        expect(unsavedChangesModal).toBeInTheDocument();

        const unsavedChangesModalDiscardButton = await screen.findByRole('button', { name: 'Discard Changes' });

        await userEvent.click(unsavedChangesModalDiscardButton);

        const newTemplateHeader = await canvas.findByRole('heading', { name: 'Virus Scan' });
        expect(newTemplateHeader).toBeInTheDocument();

        // check if template buttons disabled correctly after switching editors
        await userEvent.click(addTemplateButton);

        const templateMetadataOptionAAfterSwitch = canvas.getByRole('option', { name: 'My Template' });
        const templateMetadataOptionBAfterSwitch = canvas.getByRole('option', { name: 'Virus Scan' });

        expect(templateMetadataOptionAAfterSwitch).not.toHaveAttribute('aria-disabled');
        expect(templateMetadataOptionBAfterSwitch).toHaveAttribute('aria-disabled');
    },
};

export const MetadataInstanceEditorAIEnabled: StoryObj<typeof MetadataSidebarRedesign> = {
    args: {
        features: {
            ...mockFeatures,
            'metadata.aiSuggestions.enabled': true,
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const autofillWithBoxAI = await canvas.findAllByRole('button', { name: /Autofill .+ with Box AI/ });
        expect(autofillWithBoxAI).toHaveLength(2);

        const editButton = await canvas.findByRole('button', { name: 'Edit My Template' });
        await userEvent.click(editButton);

        const autofillButton = await canvas.findByRole('button', { name: 'Autofill' });
        expect(autofillButton).toBeInTheDocument();
    },
};

export const ShowErrorWhenAIAPIIsUnavailable: StoryObj<typeof MetadataSidebarRedesign> = {
    args: {
        features: {
            ...mockFeatures,
            'metadata.aiSuggestions.enabled': true,
        },
    },
    parameters: {
        msw: {
            handlers: [
                ...defaultMockHandlers,
                http.post(aiSuggestionsForMyAttribute.url, () => {
                    return new HttpResponse('Internal Server Error', { status: 500 });
                }),
            ],
        },
        test: {
            dangerouslyIgnoreUnhandledErrors: true,
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const autofillButton = await canvas.findByRole('button', { name: 'Autofill My Template with Box AI' });
        await userEvent.click(autofillButton);

        const errorAlert = await canvas.findByText('We’re sorry, something went wrong.');
        expect(errorAlert).toBeInTheDocument();
    },
};

export const SuggestionsWhenAIAPIResponses: StoryObj<typeof MetadataSidebarRedesign> = {
    args: {
        features: {
            ...mockFeatures,
            'metadata.aiSuggestions.enabled': true,
        },
    },
    parameters: {
        msw: {
            handlers: [
                ...defaultMockHandlers,
                http.post(aiSuggestionsForMyAttribute.url, () =>
                    HttpResponse.json(aiSuggestionsForMyAttribute.response),
                ),
            ],
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const autofillButton = await canvas.findByRole('button', { name: 'Autofill My Template with Box AI' });
        userEvent.click(autofillButton);

        const suggestion = await canvas.findByText('it works fine');
        expect(suggestion).toBeInTheDocument();

        const replaceButton = await canvas.findByRole('button', { name: 'Clear and Replace' });
        expect(replaceButton).toBeInTheDocument();

        await userEvent.click(replaceButton);

        const input = canvas.getByLabelText('My Attribute');
        expect(input).toHaveValue('it works fine');
    },
};

export const SuggestionForNewlyCreatedTemplateInstance: StoryObj<typeof MetadataSidebarRedesign> = {
    args: {
        features: {
            ...mockFeatures,
            'metadata.aiSuggestions.enabled': true,
        },
    },
    parameters: {
        msw: {
            handlers: [
                ...defaultMockHandlers,
                http.post(aiSuggestionsForMyAttribute.url, () => HttpResponse.json(aiSuggestionForDateField.response)),
            ],
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const addTemplateButton = await canvas.findByRole('button', { name: 'Add template' });
        expect(addTemplateButton).toBeInTheDocument();
        await userEvent.click(addTemplateButton);

        const customMetadataOption = canvas.getByRole('option', { name: 'Date Template' });
        expect(customMetadataOption).toBeInTheDocument();
        await userEvent.click(customMetadataOption);

        const templateHeader = await canvas.findByRole('heading', { name: 'Date Template' });
        expect(templateHeader).toBeInTheDocument();

        const autofillButton = await canvas.findByRole('button', { name: 'Autofill' });
        userEvent.click(autofillButton);

        const suggestion = await canvas.findByText('4/1/2024');
        expect(suggestion).toBeInTheDocument();
    },
};

export const ShowErrorOnDelete: StoryObj<typeof MetadataSidebarRedesign> = {
    parameters: {
        msw: {
            handlers: [
                ...defaultMockHandlers,
                http.delete(mockErrorDeleteMyTemplateMetadataRequest.url, () => {
                    return HttpResponse.json(mockErrorDeleteMyTemplateMetadataRequest.response, { status: 404 });
                }),
            ],
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const editButton = await canvas.findByRole('button', { name: 'Edit My Template' }, { timeout: 2000 });
        await userEvent.click(editButton);

        const deleteButton = await canvas.findByRole('button', { name: 'Delete' });
        await userEvent.click(deleteButton);

        const confirmModal = await screen.findByRole('dialog', { name: /delete.+/i }, { timeout: 2000 });

        const confirmInput = within(confirmModal).getByRole('textbox');
        await userEvent.type(confirmInput, 'My Template');

        const confirmButton = within(confirmModal).getByRole('button', { name: 'Confirm' });
        await userEvent.click(confirmButton);

        const errorAlert = await canvas.findByText(
            'An error has occurred while updating metadata. Please refresh the page and try again.',
        );
        expect(errorAlert).toBeInTheDocument();
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
        msw: {
            handlers: defaultMockHandlers,
        },
    },
};
