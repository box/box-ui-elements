import * as React from 'react';
import ScrollWrapper from '../../components/scroll-wrapper';
import Header from './Header';
import Instances from './Instances';
import EmptyContent from './EmptyContent';
import MetadataInstanceEditorContext from './MetadataInstanceEditorContext';
import './MetadataInstanceEditor.scss';
const MetadataInstanceEditor = ({
  blurExceptionClassNames,
  canAdd,
  canUseAIFolderExtraction = false,
  isCascadingPolicyApplicable = false,
  isDropdownBusy,
  editors = [],
  onModification,
  onRemove,
  onAdd,
  onSave,
  selectedTemplateKey,
  templates,
  title
}) => /*#__PURE__*/React.createElement(MetadataInstanceEditorContext.Provider, {
  value: {
    blurExceptionClassNames
  }
}, /*#__PURE__*/React.createElement("div", {
  className: "metadata-instance-editor"
}, /*#__PURE__*/React.createElement(Header, {
  canAdd: canAdd,
  editors: editors,
  isDropdownBusy: isDropdownBusy,
  onAdd: onAdd,
  templates: templates,
  title: title
}), editors.length === 0 ? /*#__PURE__*/React.createElement(EmptyContent, {
  canAdd: canAdd
}) : /*#__PURE__*/React.createElement(ScrollWrapper, null, /*#__PURE__*/React.createElement(Instances, {
  canUseAIFolderExtraction: canUseAIFolderExtraction,
  editors: editors,
  isCascadingPolicyApplicable: isCascadingPolicyApplicable,
  onModification: onModification,
  onRemove: onRemove,
  onSave: onSave,
  selectedTemplateKey: selectedTemplateKey
}))));
export default MetadataInstanceEditor;
//# sourceMappingURL=MetadataInstanceEditor.js.map