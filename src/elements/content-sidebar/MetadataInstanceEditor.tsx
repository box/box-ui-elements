import { AutofillContextProvider, MetadataInstanceForm, type MetadataTemplateInstance } from '@box/metadata-editor';
import { JSONPatchOperations } from '@box/metadata-editor/types/lib/components/metadata-instance-editor/subcomponents/metadata-instance-form/types';
import { FormValues } from '@box/metadata-editor/types/lib/components/metadata-instance-editor/types';
import React from 'react';

export interface MetadataInstanceEditorProps {
    isBoxAiSuggestionsEnabled: boolean;
    isUnsavedChangesModalOpen: boolean;
    onCancel: () => void;
    onDelete: (metadataInstance: MetadataTemplateInstance) => void;
    template: MetadataTemplateInstance;
    onSubmit: (values: FormValues, operations: JSONPatchOperations) => void;
    setIsUnsavedChangesModalOpen: (isUnsavedChangesModalOpen: boolean) => void;
}

const MetadataInstanceEditor: React.FC<MetadataInstanceEditorProps> = ({
    isBoxAiSuggestionsEnabled,
    isUnsavedChangesModalOpen,
    onDelete,
    onSubmit,
    setIsUnsavedChangesModalOpen,
    template,
    onCancel,
}) => {
    const handleCancel = () => {
        onCancel();
    };

    return (
        <AutofillContextProvider isAiSuggestionsFeatureEnabled={isBoxAiSuggestionsEnabled}>
            <MetadataInstanceForm
                isAiSuggestionsFeatureEnabled={isBoxAiSuggestionsEnabled}
                isLoading={false}
                isUnsavedChangesModalOpen={isUnsavedChangesModalOpen}
                selectedTemplateInstance={template}
                onCancel={handleCancel}
                onSubmit={onSubmit}
                setIsUnsavedChangesModalOpen={setIsUnsavedChangesModalOpen}
                onDelete={onDelete}
            />
        </AutofillContextProvider>
    );
};

export default MetadataInstanceEditor;
