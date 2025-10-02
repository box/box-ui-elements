import { type StoryObj, Meta } from '@storybook/react';
import type { HttpHandler } from 'msw';
import ContentSidebar from '../../ContentSidebar';
import MetadataSidebarRedesign from '../../MetadataSidebarRedesign';
export declare const AddTemplateDropdownMenuOn: {
    play: ({ canvasElement }: {
        canvasElement: any;
    }) => Promise<void>;
};
export declare const AddTemplateDropdownMenuOnEmpty: {
    args: {
        fileId: string;
        metadataSidebarProps: {
            isBoxAiSuggestionsEnabled: boolean;
            isBetaLanguageEnabled: boolean;
            isFeatureEnabled: boolean;
            onError: import("@vitest/spy").Mock<(...args: any[]) => any>;
            onSuccess: import("@vitest/spy").Mock<(...args: any[]) => any>;
        };
    };
    play: ({ canvasElement }: {
        canvasElement: any;
    }) => Promise<void>;
};
export declare const FilterInstancesDropdown: {
    play: ({ canvasElement }: {
        canvasElement: any;
    }) => Promise<void>;
};
export declare const AddingNewMetadataTemplate: StoryObj<typeof MetadataSidebarRedesign>;
export declare const UnsavedChangesModalWhenChoosingDifferentTemplate: StoryObj<typeof MetadataSidebarRedesign>;
export declare const EmptyStateWithBoxAiEnabled: StoryObj<typeof MetadataSidebarRedesign>;
export declare const EmptyStateWithBoxAiDisabled: StoryObj<typeof MetadataSidebarRedesign>;
export declare const MetadataInstanceEditorWithDefinedTemplate: StoryObj<typeof MetadataSidebarRedesign>;
export declare const MetadataInstanceEditorWithCustomTemplate: StoryObj<typeof MetadataSidebarRedesign>;
export declare const MetadataInstanceEditorCancelChanges: StoryObj<typeof MetadataSidebarRedesign>;
export declare const DeleteButtonIsDisabledWhenAddingNewMetadataTemplate: StoryObj<typeof MetadataSidebarRedesign>;
export declare const DeleteButtonIsEnabledWhenEditingMetadataTemplateInstance: StoryObj<typeof MetadataSidebarRedesign>;
export declare const MetadataInstanceEditorAddTemplateAgainAfterCancel: StoryObj<typeof MetadataSidebarRedesign>;
export declare const SwitchEditingTemplateInstances: StoryObj<typeof MetadataSidebarRedesign>;
export declare const MetadataInstanceEditorAIEnabled: StoryObj<typeof MetadataSidebarRedesign>;
export declare const MetadataInstanceEditorAIEnabledAdvancedExtractAgent: StoryObj<typeof MetadataSidebarRedesign>;
export declare const ShowErrorWhenAIAPIIsUnavailable: StoryObj<typeof MetadataSidebarRedesign>;
export declare const SuggestionsWhenAIAPIResponses: StoryObj<typeof MetadataSidebarRedesign>;
export declare const SuggestionForNewlyCreatedTemplateInstance: StoryObj<typeof MetadataSidebarRedesign>;
export declare const ShowErrorOnDelete: StoryObj<typeof MetadataSidebarRedesign>;
export declare const ViewMultilevelTaxonomy: StoryObj<typeof MetadataSidebarRedesign>;
export declare const ViewSinglelevelTaxonomy: StoryObj<typeof MetadataSidebarRedesign>;
export declare const EditMultilevelTaxonomy: StoryObj<typeof MetadataSidebarRedesign>;
export declare const EditSinglelevelTaxonomy: StoryObj<typeof MetadataSidebarRedesign>;
declare const meta: Meta<typeof ContentSidebar> & {
    parameters: {
        msw: {
            handlers: HttpHandler[];
        };
    };
};
export default meta;
