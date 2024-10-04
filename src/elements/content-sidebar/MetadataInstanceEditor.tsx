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
    onUnsavedChangesModalCancel: () => void;
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
    template,
    onCancel,
    onUnsavedChangesModalCancel,
    taxonomyOptionsFetcher,
}) => {
    const handleCancel = () => {
        onCancel();
    };

    return (
        <AutofillContextProvider isAiSuggestionsFeatureEnabled={isBoxAiSuggestionsEnabled}>
            <MetadataInstanceForm
                isAiSuggestionsFeatureEnabled={isBoxAiSuggestionsEnabled}
                isDeleteButtonDisabled={isDeleteButtonDisabled}
                isUnsavedChangesModalOpen={isUnsavedChangesModalOpen}
                selectedTemplateInstance={template}
                onCancel={handleCancel}
                onSubmit={onSubmit}
                setIsUnsavedChangesModalOpen={setIsUnsavedChangesModalOpen}
                onDelete={onDelete}
                onUnsavedChangesModalCancel={onUnsavedChangesModalCancel}
                taxonomyOptionsFetcher={taxonomyOptionsFetcher}
            />
        </AutofillContextProvider>
    );
};

export default MetadataInstanceEditor;
