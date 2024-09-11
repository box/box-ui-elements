import {
    MetadataInstanceForm,
    type MetadataTemplateInstance,
    UnsavedChangesModal,
    type MetadataTemplate,
} from '@box/metadata-editor';
import { JSONPatchOperations } from '@box/metadata-editor/types/lib/components/metadata-instance-editor/subcomponents/metadata-instance-form/types';
import React from 'react';

export interface MetadataInstanceEditorProps {
    isBoxAiSuggestionsEnabled: boolean;
    isUnsavedChangesModalOpen: boolean;
    onSubmit: (id: string, operations: JSONPatchOperations) => void;
    template: MetadataTemplateInstance | MetadataTemplate;
}

const MetadataInstanceEditor: React.FC<MetadataInstanceEditorProps> = ({
    isBoxAiSuggestionsEnabled,
    isUnsavedChangesModalOpen,
    onSubmit,
    template,
}) => {
    const handleCancel = () => {
        // TODO in a future PR
    };

    const handleDelete = () => {
        // TODO in a future PR
    };

    return (
        <>
            <MetadataInstanceForm
                isAiSuggestionsFeatureEnabled={isBoxAiSuggestionsEnabled}
                isLoading={false}
                // isUnsavedChangesModalOpen={isUnsavedChangesModalOpen} // to be implemented
                selectedTemplateInstance={template}
                onCancel={handleCancel}
                onDelete={handleDelete}
                onSubmit={onSubmit}
            />
            {/* to be removed from here and props for UnsavedChangesModal to be updated */}
            <UnsavedChangesModal
                onDismiss={handleCancel}
                // onSaveAndContinue={()=> onSubmit(template.id, [])}
                open={isUnsavedChangesModalOpen}
            />
        </>
    );
};

export default MetadataInstanceEditor;
