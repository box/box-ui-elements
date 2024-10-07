import {
    MetadataInstanceForm,
    withApiWrapper,
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

export const MetadataInstanceEditor: React.FC<MetadataInstanceEditorProps> = ({
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
    return (
        <MetadataInstanceForm
            areAiSuggestionsAvailable={areAiSuggestionsAvailable}
            isAiSuggestionsFeatureEnabled={isBoxAiSuggestionsEnabled}
            isDeleteButtonDisabled={isDeleteButtonDisabled}
            isUnsavedChangesModalOpen={isUnsavedChangesModalOpen}
            onCancel={onCancel}
            onDelete={onDelete}
            onDiscardUnsavedChanges={onDiscardUnsavedChanges}
            onSubmit={onSubmit}
            selectedTemplateInstance={template}
            setIsUnsavedChangesModalOpen={setIsUnsavedChangesModalOpen}
        />
    );
};

export default withApiWrapper(MetadataInstanceEditor);
