import {
    AutofillContextProvider,
    AutofillContextProviderProps,
    MetadataInstanceForm,
    type FormValues,
    type JSONPatchOperations,
    type MetadataTemplateInstance,
    type BaseOptionType,
    type FetcherResponse,
    type PaginationQueryInput,
} from '@box/metadata-editor';
import React from 'react';

export interface MetadataInstanceEditorProps {
    areAiSuggestionsAvailable: boolean;
    fetchSuggestions: AutofillContextProviderProps['fetchSuggestions'];
    isBoxAiSuggestionsEnabled: boolean;
    isDeleteButtonDisabled: boolean;
    isUnsavedChangesModalOpen: boolean;
    onCancel: () => void;
    onDelete: (metadataInstance: MetadataTemplateInstance) => void;
    onDiscardUnsavedChanges: () => void;
    onSubmit: (values: FormValues, operations: JSONPatchOperations) => Promise<void>;
    setIsUnsavedChangesModalOpen: (isUnsavedChangesModalOpen: boolean) => void;
    taxonomyOptionsFetcher: (
        scope: string,
        templateKey: string,
        fieldKey: string,
        level: number,
        options: PaginationQueryInput,
    ) => Promise<FetcherResponse<BaseOptionType>>;
    template: MetadataTemplateInstance;
}

const MetadataInstanceEditor: React.FC<MetadataInstanceEditorProps> = ({
    areAiSuggestionsAvailable,
    fetchSuggestions,
    isBoxAiSuggestionsEnabled,
    isDeleteButtonDisabled,
    isUnsavedChangesModalOpen,
    onCancel,
    onDelete,
    onDiscardUnsavedChanges,
    onSubmit,
    setIsUnsavedChangesModalOpen,
    taxonomyOptionsFetcher,
    template,
}) => {
    const handleCancel = () => {
        onCancel();
    };

    return (
        <AutofillContextProvider
            fetchSuggestions={fetchSuggestions}
            isAiSuggestionsFeatureEnabled={isBoxAiSuggestionsEnabled}
        >
            <MetadataInstanceForm
                areAiSuggestionsAvailable={areAiSuggestionsAvailable}
                isAiSuggestionsFeatureEnabled={isBoxAiSuggestionsEnabled}
                isDeleteButtonDisabled={isDeleteButtonDisabled}
                isUnsavedChangesModalOpen={isUnsavedChangesModalOpen}
                onCancel={handleCancel}
                onDelete={onDelete}
                onDiscardUnsavedChanges={onDiscardUnsavedChanges}
                onSubmit={onSubmit}
                selectedTemplateInstance={template}
                setIsUnsavedChangesModalOpen={setIsUnsavedChangesModalOpen}
                taxonomyOptionsFetcher={taxonomyOptionsFetcher}
            />
        </AutofillContextProvider>
    );
};

export default MetadataInstanceEditor;
