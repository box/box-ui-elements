import {
    MetadataInstanceForm,
    type FormValues,
    type JSONPatchOperations,
    type MetadataTemplateField,
    type MetadataTemplateInstance,
} from '@box/metadata-editor';
import {
    CreateTaxonomyItemsService,
    TaxonomyOptionsFetcher,
} from '@box/metadata-editor/lib/components/metadata-editor-fields/components/metadata-taxonomy-field/types.js';
import React, { useContext } from 'react';
import PreviewContext, { type PreviewContextType } from '../content-preview/PreviewContext';
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
    isDeleteConfirmationModalCheckboxEnabled: boolean;
    isLargeFile: boolean;
    isMetadataMultiLevelTaxonomyFieldEnabled: boolean;
    isMetadataTaxonomyPickerEnabled?: boolean;
    isUnsavedChangesModalOpen: boolean;
    onCancel: () => void;
    onDelete: (metadataInstance: MetadataTemplateInstance) => void;
    onDiscardUnsavedChanges: () => void;
    onSubmit: (values: FormValues, operations: JSONPatchOperations) => Promise<void>;
    onToggleReviewFilter?: () => void;
    setIsUnsavedChangesModalOpen: (isUnsavedChangesModalOpen: boolean) => void;
    shouldShowOnlyReviewFields?: boolean;
    taxonomyOptionsFetcher: TaxonomyOptionsFetcher;
    createTaxonomyItemsService?: CreateTaxonomyItemsService;
    template: MetadataTemplateInstance;
    isAdvancedExtractAgentEnabled?: boolean;
    isConfidenceScoreReviewEnabled?: boolean;
    onSelectMetadataField?: (field: MetadataTemplateField | null) => void;
    selectedMetadataFieldId?: string | null;
    trackEvent?: (eventName: string, data?: Record<string, unknown>) => void;
    isBoundingBoxEnabled?: boolean;
}

const MetadataInstanceEditor: React.FC<MetadataInstanceEditorProps> = ({
    areAiSuggestionsAvailable,
    errorCode,
    isBetaLanguageEnabled,
    isBoxAiSuggestionsEnabled,
    isDeleteButtonDisabled,
    isDeleteConfirmationModalCheckboxEnabled,
    isLargeFile,
    isMetadataMultiLevelTaxonomyFieldEnabled,
    isMetadataTaxonomyPickerEnabled = false,
    isUnsavedChangesModalOpen,
    onCancel,
    onDelete,
    onDiscardUnsavedChanges,
    onSubmit,
    onToggleReviewFilter,
    setIsUnsavedChangesModalOpen,
    shouldShowOnlyReviewFields = false,
    taxonomyOptionsFetcher,
    createTaxonomyItemsService,
    template,
    isAdvancedExtractAgentEnabled = false,
    isConfidenceScoreReviewEnabled = false,
    isBoundingBoxEnabled = false,
    onSelectMetadataField,
    selectedMetadataFieldId,
    trackEvent,
}) => {
    const previewContext: PreviewContextType | null = useContext(PreviewContext);
    const customRef = previewContext?.previewBodyRef?.current;

    return (
        <MetadataInstanceForm
            // TODO investigate if this property should be optional and by default false
            isMultilevelTaxonomyFieldEnabled={isMetadataMultiLevelTaxonomyFieldEnabled}
            isTaxonomyPickerEnabled={isMetadataTaxonomyPickerEnabled}
            createTaxonomyItemsService={createTaxonomyItemsService}
            areAiSuggestionsAvailable={areAiSuggestionsAvailable}
            errorCode={errorCode}
            isAiSuggestionsFeatureEnabled={isBoxAiSuggestionsEnabled}
            isBetaLanguageEnabled={isBetaLanguageEnabled}
            isDeleteButtonDisabled={isDeleteButtonDisabled}
            isDeleteConfirmationModalCheckboxEnabled={isDeleteConfirmationModalCheckboxEnabled}
            isLargeFile={isLargeFile}
            isUnsavedChangesModalOpen={isUnsavedChangesModalOpen}
            onCancel={onCancel}
            onDelete={onDelete}
            onDiscardUnsavedChanges={onDiscardUnsavedChanges}
            onSubmit={onSubmit}
            onToggleReviewFilter={onToggleReviewFilter}
            selectedTemplateInstance={template}
            setIsUnsavedChangesModalOpen={setIsUnsavedChangesModalOpen}
            shouldShowOnlyReviewFields={shouldShowOnlyReviewFields}
            taxonomyOptionsFetcher={taxonomyOptionsFetcher}
            isAdvancedExtractAgentEnabled={isAdvancedExtractAgentEnabled}
            isConfidenceScoreReviewEnabled={isConfidenceScoreReviewEnabled}
            onSelectMetadataField={onSelectMetadataField}
            selectedMetadataFieldId={selectedMetadataFieldId}
            customRef={customRef}
            trackEvent={trackEvent}
            isBoundingBoxEnabled={isBoundingBoxEnabled}
        />
    );
};

export default MetadataInstanceEditor;
