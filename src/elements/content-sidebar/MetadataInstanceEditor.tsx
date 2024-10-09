import {
    AutofillContextProvider,
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
    isBoxAiSuggestionsEnabled: boolean;
    isDeleteButtonDisabled: boolean;
    isUnsavedChangesModalOpen: boolean;
    onCancel: () => void;
    onDelete: (metadataInstance: MetadataTemplateInstance) => void;
    template: MetadataTemplateInstance;
    onSubmit: (values: FormValues, operations: JSONPatchOperations) => Promise<void>;
    setIsUnsavedChangesModalOpen: (isUnsavedChangesModalOpen: boolean) => void;
    onDiscardUnsavedChanges: () => void;
    taxonomyOptionsFetcher: (
        scope: string,
        templateKey: string,
        fieldKey: string,
        level: number,
        options: PaginationQueryInput,
    ) => Promise<FetcherResponse<BaseOptionType>>;
}

const MetadataInstanceEditor: React.FC<MetadataInstanceEditorProps> = ({
    isBoxAiSuggestionsEnabled,
    isDeleteButtonDisabled,
    isUnsavedChangesModalOpen,
    onDelete,
    onSubmit,
    setIsUnsavedChangesModalOpen,
    taxonomyOptionsFetcher,
    template,
    onCancel,
    onDiscardUnsavedChanges,
}) => {
    const handleCancel = () => {
        onCancel();
    };

    return (
        <AutofillContextProvider
            fetchSuggestions={() => Promise.resolve([])}
            isAiSuggestionsFeatureEnabled={isBoxAiSuggestionsEnabled}
        >
            <MetadataInstanceForm
                areAiSuggestionsAvailable={true}
                isAiSuggestionsFeatureEnabled={isBoxAiSuggestionsEnabled}
                isDeleteButtonDisabled={isDeleteButtonDisabled}
                isUnsavedChangesModalOpen={isUnsavedChangesModalOpen}
                selectedTemplateInstance={template}
                onCancel={handleCancel}
                onSubmit={onSubmit}
                setIsUnsavedChangesModalOpen={setIsUnsavedChangesModalOpen}
                onDelete={onDelete}
                onDiscardUnsavedChanges={onDiscardUnsavedChanges}
                taxonomyOptionsFetcher={taxonomyOptionsFetcher}
            />
        </AutofillContextProvider>
    );
};

export default MetadataInstanceEditor;
