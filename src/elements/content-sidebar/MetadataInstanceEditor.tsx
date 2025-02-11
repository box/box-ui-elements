import {
    MetadataInstanceForm,
    type FormValues,
    type JSONPatchOperations,
    type MetadataTemplateInstance,
    type FetcherResponse,
    type BaseOptionType,
    type PaginationQueryInput,
} from '@box/metadata-editor';
import React from 'react';
import {
    ERROR_CODE_METADATA_AUTOFILL_TIMEOUT,
    ERROR_CODE_UNKNOWN,
    ERROR_CODE_METADATA_PRECONDITION_FAILED,
} from '../../constants';

export interface MetadataInstanceEditorProps {
    areAiSuggestionsAvailable: boolean;
    errorCode?: ERROR_CODE_METADATA_AUTOFILL_TIMEOUT | ERROR_CODE_METADATA_PRECONDITION_FAILED | ERROR_CODE_UNKNOWN;
    isBetaLanguageEnabled: boolean;
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
    errorCode,
    isBetaLanguageEnabled,
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
    return (
        <MetadataInstanceForm
            areAiSuggestionsAvailable={areAiSuggestionsAvailable}
            isAiSuggestionsFeatureEnabled={isBoxAiSuggestionsEnabled}
            isBetaLanguageEnabled={isBetaLanguageEnabled}
            isDeleteButtonDisabled={isDeleteButtonDisabled}
            isUnsavedChangesModalOpen={isUnsavedChangesModalOpen}
            onCancel={onCancel}
            onDelete={onDelete}
            onDiscardUnsavedChanges={onDiscardUnsavedChanges}
            onSubmit={onSubmit}
            selectedTemplateInstance={template}
            setIsUnsavedChangesModalOpen={setIsUnsavedChangesModalOpen}
            taxonomyOptionsFetcher={taxonomyOptionsFetcher}
            errorCode={errorCode}
        />
    );
};

export default MetadataInstanceEditor;
