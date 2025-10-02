import { defineMessages } from 'react-intl';
const messages = defineMessages({
  customTitle: {
    "id": "boxui.metadataInstanceEditor.customTitle",
    "defaultMessage": "Custom Metadata"
  },
  customAdd: {
    "id": "boxui.metadataInstanceEditor.customAdd",
    "defaultMessage": "Add"
  },
  customRemove: {
    "id": "boxui.metadataInstanceEditor.customRemove",
    "defaultMessage": "Remove"
  },
  customKey: {
    "id": "boxui.metadataInstanceEditor.customKey",
    "defaultMessage": "Key"
  },
  customKeyPlaceholder: {
    "id": "boxui.metadataInstanceEditor.customKeyPlaceholder",
    "defaultMessage": "e.g. Order Number"
  },
  customValue: {
    "id": "boxui.metadataInstanceEditor.customValue",
    "defaultMessage": "Value"
  },
  customValuePlaceholder: {
    "id": "boxui.metadataInstanceEditor.customValuePlaceholder",
    "defaultMessage": "e.g. 42"
  },
  customNewField: {
    "id": "boxui.metadataInstanceEditor.customNewField",
    "defaultMessage": "New Field"
  },
  customNewFieldMessage: {
    "id": "boxui.metadataInstanceEditor.customNewFieldMessage",
    "defaultMessage": "Add a custom metadata field. Other people will be able to see and search for this field."
  },
  customErrorRequired: {
    "id": "boxui.metadataInstanceEditor.customErrorRequired",
    "defaultMessage": "A key is required."
  },
  customErrorDuplicateKey: {
    "id": "boxui.metadataInstanceEditor.customErrorDuplicateKey",
    "defaultMessage": "A field with that key already exists."
  },
  customErrorInternalKey: {
    "id": "boxui.metadataInstanceEditor.customErrorInternalKey",
    "defaultMessage": "Keys cannot begin with a $."
  },
  invalidInput: {
    "id": "boxui.metadataInstanceEditor.invalidValue",
    "defaultMessage": "Invalid Input!"
  },
  metadataEditTooltip: {
    "id": "boxui.metadataInstanceEditor.editTooltip",
    "defaultMessage": "Edit Metadata"
  },
  metadataRemoveTemplate: {
    "id": "boxui.metadataInstanceEditor.removeTemplate",
    "defaultMessage": "Remove"
  },
  fileMetadataRemoveTemplateConfirm: {
    "id": "boxui.metadataInstanceEditor.fileMetadataRemoveTemplateConfirm",
    "defaultMessage": "Are you sure you want to delete \"{metadataName}\" and all of its values from this file?"
  },
  folderMetadataRemoveTemplateConfirm: {
    "id": "boxui.metadataInstanceEditor.folderMetadataRemoveTemplateConfirm",
    "defaultMessage": "Are you sure you want to delete \"{metadataName}\" and all of its values? Any metadata template values already applied to files in this folder will not be deleted."
  },
  fileMetadataRemoveCustomTemplateConfirm: {
    "id": "boxui.metadataInstanceEditor.fileMetadataRemoveCustomTemplateConfirm",
    "defaultMessage": "Are you sure you want to delete this custom metadata and all of its values from this file?"
  },
  folderMetadataRemoveCustomTemplateConfirm: {
    "id": "boxui.metadataInstanceEditor.folderMetadataRemoveCustomTemplateConfirm",
    "defaultMessage": "Are you sure you want to delete this custom metadata and all of its values? Any metadata template values already applied to files in this folder will not be deleted."
  },
  metadataTemplateSearchPlaceholder: {
    "id": "boxui.metadataInstanceEditor.templateSearchPlaceholder",
    "defaultMessage": "Search all templates"
  },
  metadataTemplateAdd: {
    "id": "boxui.metadataInstanceEditor.templateAdd",
    "defaultMessage": "Add"
  },
  metadataTemplatesTitle: {
    "id": "boxui.metadataInstanceEditor.templatesTitle",
    "defaultMessage": "Templates"
  },
  metadataTemplatesNoResults: {
    "id": "boxui.metadataInstanceEditor.templatesNoResults",
    "defaultMessage": "No Results"
  },
  metadataTemplatesFetchFailed: {
    "id": "boxui.metadataInstanceEditor.templatesFetchFailed",
    "defaultMessage": "Sorry! We could not fetch templates. Please contact your administrator"
  },
  metadataTemplatesNoRemainingTemplates: {
    "id": "boxui.metadataInstanceEditor.templatesNoRemainingTemplates",
    "defaultMessage": "All templates have been added"
  },
  metadataTemplatesServerHasNoTemplates: {
    "id": "boxui.metadataInstanceEditor.templatesServerHasNoTemplates",
    "defaultMessage": "Zero templates"
  },
  metadataSave: {
    "id": "boxui.metadataInstanceEditor.metadataSave",
    "defaultMessage": "Save"
  },
  metadataCancel: {
    "id": "boxui.metadataInstanceEditor.metadataCancel",
    "defaultMessage": "Cancel"
  },
  metadataCascadePolicyEnabledInfo: {
    "id": "boxui.metadataInstanceEditor.metadataCascadePolicyEnabledInfo",
    "defaultMessage": "This template and its values are being cascaded to all items in this folder and its subfolders."
  },
  noMetadata: {
    "id": "boxui.metadataInstanceEditor.noMetadata",
    "defaultMessage": "No Metadata Applied"
  },
  noMetadataAddTemplate: {
    "id": "boxui.metadataInstanceEditor.noMetadataAddTemplate",
    "defaultMessage": "Click 'Add' in the top right to add metadata to this item"
  },
  enableCascadePolicy: {
    "id": "boxui.metadataInstanceEditor.enableCascadePolicy",
    "defaultMessage": "Enable Cascade Policy"
  },
  enableAIAutofill: {
    "id": "boxui.metadataInstanceEditor.enableAIAutofill",
    "defaultMessage": "Box AI Autofill"
  },
  aiAutofillDescription: {
    "id": "boxui.metadataInstanceEditor.aiAutofillDescription",
    "defaultMessage": "Use Box AI to automatically extract metadata values."
  },
  aiAutofillLearnMore: {
    "id": "boxui.metadataInstanceEditor.aiAutofillLearnMore",
    "defaultMessage": "Learn more"
  },
  applyCascadePolicyText: {
    "id": "boxui.metadataInstanceEditor.applyCascadePolicyText",
    "defaultMessage": "Apply template and its values to all new and existing items in this folder and its subfolders."
  },
  cannotApplyCascadePolicyText: {
    "id": "boxui.metadataInstanceEditor.cannotApplyCascadePolicyText",
    "defaultMessage": "Cascade policy cannot be applied to custom metadata at this time."
  },
  cascadePolicyLearnMore: {
    "id": "boxui.metadataInstanceEditor.cascadePolicyLearnMore",
    "defaultMessage": "Learn more"
  },
  cascadePolicyModeQuestion: {
    "id": "boxui.metadataInstanceEditor.cascadePolicyModeQuestion",
    "defaultMessage": "In the case of conflicts when applying this template and its values to existing items, what would you like to do? This is a one time action."
  },
  cascadePolicyOptionsDisabledNotice: {
    "id": "boxui.metadataInstanceEditor.cascadePolicyOptionsDisabledNotice",
    "defaultMessage": "This cascade policy cannot be edited. To modify it, deactivate the current policy and then re-enable it to set up a new one."
  },
  cascadePolicyOptionsDisabledNoticeIconAriaLabel: {
    "id": "boxui.metadataInstanceEditor.cascadePolicyOptionsDisabledNoticeIconAriaLabel",
    "defaultMessage": "Disabled cascade options information"
  },
  cascadePolicySkipMode: {
    "id": "boxui.metadataInstanceEditor.cascadePolicySkipMode",
    "defaultMessage": "Skip and keep all existing template values"
  },
  cascadePolicyOverwriteMode: {
    "id": "boxui.metadataInstanceEditor.cascadePolicyOverwriteMode",
    "defaultMessage": "Overwrite all existing template values"
  },
  allAttributesAreHidden: {
    "id": "boxui.metadataInstanceEditor.allAttributesAreHidden",
    "defaultMessage": "All attributes in this template have been hidden."
  },
  noAttributesForTemplate: {
    "id": "boxui.metadataInstanceEditor.noAttributesForTemplate",
    "defaultMessage": "There are no attributes in this template."
  },
  operationNotImmediate: {
    "id": "boxui.metadataInstanceEditor.operationNotImmediate",
    "defaultMessage": "This operation is not immediate and may take some time."
  },
  standardAgentName: {
    "id": "boxui.metadataInstanceEditor.standardAgentName",
    "defaultMessage": "Standard"
  },
  enhancedAgentName: {
    "id": "boxui.metadataInstanceEditor.enhancedAgentName",
    "defaultMessage": "Enhanced"
  }
});
export default messages;
//# sourceMappingURL=messages.js.map