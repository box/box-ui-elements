import {
    MetadataInstanceForm,
    type FormValues,
    type JSONPatchOperations,
    type MetadataTemplateInstance,
} from '@box/metadata-editor';
import React from 'react';

export interface MetadataInstanceEditorProps {
    areAiSuggestionsAvailable: boolean;
    isBoxAiSuggestionsEnabled: boolean;
    isDeleteButtonDisabled: boolean;
    isUnsavedChangesModalOpen: boolean;
    onCancel: () => void;
    onDelete: (metadataInstance: MetadataTemplateInstance) => void;
    onDiscardUnsavedChanges: () => void;
    onSubmit: (values: FormValues, operations: JSONPatchOperations) => Promise<void>;
    setIsUnsavedChangesModalOpen: (isUnsavedChangesModalOpen: boolean) => void;
    template: MetadataTemplateInstance;
}

const MetadataInstanceEditor: React.FC<MetadataInstanceEditorProps> = ({
    areAiSuggestionsAvailable,
    isBoxAiSuggestionsEnabled,
    isDeleteButtonDisabled,
    isUnsavedChangesModalOpen,
    onCancel,
    onDelete,
    onDiscardUnsavedChanges,
    onSubmit,
    setIsUnsavedChangesModalOpen,
    template,
}) => {
    const handleCancel = () => {
        onCancel();
    };

    return (
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
            taxonomyOptionsFetcher={null}
        />
    );
};

export default MetadataInstanceEditor;
