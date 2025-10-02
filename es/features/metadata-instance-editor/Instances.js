import * as React from 'react';
import Instance from './Instance';
const Instances = ({
  canUseAIFolderExtraction = false,
  isCascadingPolicyApplicable = false,
  editors = [],
  onModification,
  onRemove,
  onSave,
  selectedTemplateKey
}) => editors.map(({
  isDirty = false,
  instance,
  hasError = false,
  template
}) => {
  const {
    templateKey
  } = template;
  const isOpen = editors.length === 1 || templateKey === selectedTemplateKey;
  return /*#__PURE__*/React.createElement(Instance, {
    canEdit: instance.canEdit,
    canUseAIFolderExtraction: canUseAIFolderExtraction,
    cascadePolicy: instance.cascadePolicy,
    data: instance.data,
    hasError: hasError,
    id: instance.id,
    isCascadingPolicyApplicable: isCascadingPolicyApplicable,
    isDirty: isDirty,
    isOpen: isOpen,
    key: `${instance.id}-${templateKey}`,
    onModification: onModification,
    onSave: onSave,
    onRemove: onRemove,
    template: template
  });
});
export default Instances;
//# sourceMappingURL=Instances.js.map