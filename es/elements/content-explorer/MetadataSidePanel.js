import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { IconButton, SidePanel, Text, useNotification } from '@box/blueprint-web';
import { XMark } from '@box/blueprint-web-assets/icons/Fill/index';
import { FileDefault } from '@box/blueprint-web-assets/icons/Line/index';
import { AutofillContextProvider, MetadataInstance, MetadataInstanceForm } from '@box/metadata-editor';
import { useTemplateInstance, useSelectedItemText } from './utils';
import messages from '../common/messages';
import './MetadataSidePanel.scss';
const MetadataSidePanel = ({
  currentCollection,
  metadataTemplate,
  onClose,
  onUpdate,
  refreshCollection,
  selectedItemIds
}) => {
  const {
    addNotification
  } = useNotification();
  const {
    formatMessage
  } = useIntl();
  const [isEditing, setIsEditing] = useState(false);
  const [isUnsavedChangesModalOpen, setIsUnsavedChangesModalOpen] = useState(false);
  const selectedItemText = useSelectedItemText(currentCollection, selectedItemIds);
  const selectedItems = selectedItemIds === 'all' ? currentCollection.items : currentCollection.items.filter(item => selectedItemIds.has(item.id));
  const templateInstance = useTemplateInstance(metadataTemplate, selectedItems, isEditing);
  const handleMetadataInstanceEdit = () => {
    setIsEditing(true);
  };
  const handleMetadataInstanceFormCancel = () => {
    setIsEditing(false);
  };
  const handleMetadataInstanceFormDiscardUnsavedChanges = () => {
    setIsUnsavedChangesModalOpen(false);
    setIsEditing(false);
  };
  const handleUpdateMetadataSuccess = () => {
    addNotification({
      closeButtonAriaLabel: formatMessage(messages.close),
      sensitivity: 'foreground',
      styledText: formatMessage(messages.metadataUpdateSuccessNotification, {
        numSelected: selectedItems.length
      }),
      typeIconAriaLabel: formatMessage(messages.success),
      variant: 'success'
    });
    setIsEditing(false);
    refreshCollection();
  };
  const handleUpdateMetadataError = () => {
    addNotification({
      closeButtonAriaLabel: formatMessage(messages.close),
      sensitivity: 'foreground',
      styledText: formatMessage(messages.metadataUpdateErrorNotification),
      typeIconAriaLabel: formatMessage(messages.error),
      variant: 'error'
    });
  };
  const handleMetadataInstanceFormSubmit = async (values, operations) => {
    const {
      fields: templateNewFields
    } = values.metadata;
    const {
      fields: templateOldFields
    } = templateInstance;
    await onUpdate(selectedItems, operations, templateOldFields, templateNewFields, handleUpdateMetadataSuccess, handleUpdateMetadataError);
  };
  return /*#__PURE__*/React.createElement(SidePanel, {
    variant: "persistent"
  }, /*#__PURE__*/React.createElement(SidePanel.Header, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Text, {
    as: "span",
    variant: "titleLarge"
  }, formatMessage(messages.sidebarMetadataTitle)), /*#__PURE__*/React.createElement("div", {
    className: "bce-MetadataSidePanel-subtitle"
  }, /*#__PURE__*/React.createElement(FileDefault, null), /*#__PURE__*/React.createElement(Text, {
    as: "span",
    color: "textOnLightSecondary",
    variant: "subtitle"
  }, selectedItemText))), /*#__PURE__*/React.createElement(IconButton, {
    "aria-label": formatMessage(messages.close),
    icon: XMark,
    onClick: onClose,
    size: "large"
  })), /*#__PURE__*/React.createElement(SidePanel.ScrollableContainer, null, /*#__PURE__*/React.createElement("div", {
    className: "bce-MetadataSidePanel-content"
  }, /*#__PURE__*/React.createElement(AutofillContextProvider, {
    fetchSuggestions: null,
    isAiSuggestionsFeatureEnabled: false
  }, isEditing ? /*#__PURE__*/React.createElement(MetadataInstanceForm, {
    areAiSuggestionsAvailable: false,
    isAiSuggestionsFeatureEnabled: false,
    isBetaLanguageEnabled: false,
    isDeleteButtonDisabled: true,
    isDeleteConfirmationModalCheckboxEnabled: false,
    isLargeFile: false,
    isMultilevelTaxonomyFieldEnabled: false,
    isUnsavedChangesModalOpen: isUnsavedChangesModalOpen,
    selectedTemplateInstance: templateInstance,
    onCancel: handleMetadataInstanceFormCancel,
    onChange: null,
    onDelete: null,
    onDiscardUnsavedChanges: handleMetadataInstanceFormDiscardUnsavedChanges,
    onSubmit: handleMetadataInstanceFormSubmit,
    setIsUnsavedChangesModalOpen: setIsUnsavedChangesModalOpen,
    taxonomyOptionsFetcher: null
  }) : /*#__PURE__*/React.createElement(MetadataInstance, {
    areAiSuggestionsAvailable: false,
    isAiSuggestionsFeatureEnabled: false,
    isBetaLanguageEnabled: false,
    onEdit: handleMetadataInstanceEdit,
    templateInstance: templateInstance,
    taxonomyNodeFetcher: null
  })))));
};
export default MetadataSidePanel;
//# sourceMappingURL=MetadataSidePanel.js.map