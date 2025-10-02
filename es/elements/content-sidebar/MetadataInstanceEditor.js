import { MetadataInstanceForm } from '@box/metadata-editor';
import React, { useContext } from 'react';
import PreviewContext from '../content-preview/PreviewContext';
const MetadataInstanceEditor = ({
  areAiSuggestionsAvailable,
  errorCode,
  isBetaLanguageEnabled,
  isBoxAiSuggestionsEnabled,
  isDeleteButtonDisabled,
  isDeleteConfirmationModalCheckboxEnabled,
  isLargeFile,
  isMetadataMultiLevelTaxonomyFieldEnabled,
  isUnsavedChangesModalOpen,
  onCancel,
  onDelete,
  onDiscardUnsavedChanges,
  onSubmit,
  setIsUnsavedChangesModalOpen,
  taxonomyOptionsFetcher,
  template,
  isAdvancedExtractAgentEnabled = false
}) => {
  const previewContext = useContext(PreviewContext);
  const customRef = previewContext?.previewBodyRef?.current;
  return /*#__PURE__*/React.createElement(MetadataInstanceForm
  // TODO investigate if this property should be optional and by default false
  , {
    isMultilevelTaxonomyFieldEnabled: isMetadataMultiLevelTaxonomyFieldEnabled,
    areAiSuggestionsAvailable: areAiSuggestionsAvailable,
    errorCode: errorCode,
    isAiSuggestionsFeatureEnabled: isBoxAiSuggestionsEnabled,
    isBetaLanguageEnabled: isBetaLanguageEnabled,
    isDeleteButtonDisabled: isDeleteButtonDisabled,
    isDeleteConfirmationModalCheckboxEnabled: isDeleteConfirmationModalCheckboxEnabled,
    isLargeFile: isLargeFile,
    isUnsavedChangesModalOpen: isUnsavedChangesModalOpen,
    onCancel: onCancel,
    onDelete: onDelete,
    onDiscardUnsavedChanges: onDiscardUnsavedChanges,
    onSubmit: onSubmit,
    selectedTemplateInstance: template,
    setIsUnsavedChangesModalOpen: setIsUnsavedChangesModalOpen,
    taxonomyOptionsFetcher: taxonomyOptionsFetcher,
    isAdvancedExtractAgentEnabled: isAdvancedExtractAgentEnabled,
    customRef: customRef
  });
};
export default MetadataInstanceEditor;
//# sourceMappingURL=MetadataInstanceEditor.js.map