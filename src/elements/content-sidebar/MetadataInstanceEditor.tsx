import { AutofillContextProvider, MetadataInstanceForm, type MetadataTemplateInstance } from '@box/metadata-editor';
import noop from 'lodash/noop';
import React from 'react';

export interface MetadataInstanceEditorProps {
    isBoxAiSuggestionsEnabled: boolean;
    isUnsavedChangesModalOpen: boolean;
    onCancel: () => void;
    onDelete: (metadataInstance: MetadataTemplateInstance) => void;
    template: MetadataTemplateInstance;
}

const MetadataInstanceEditor: React.FC<MetadataInstanceEditorProps> = ({
    isBoxAiSuggestionsEnabled,
    isUnsavedChangesModalOpen,
    onDelete,
    template,
    onCancel,
}) => {
    const handleSubmit = () => {
        // TODO in a future PR
    };
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
                onDelete={onDelete}
                onSubmit={handleSubmit}
                setIsUnsavedChangesModalOpen={noop}
            />
        </AutofillContextProvider>
    );
};

export default MetadataInstanceEditor;
