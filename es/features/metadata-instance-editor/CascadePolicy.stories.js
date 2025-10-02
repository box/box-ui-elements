import * as React from 'react';
import CascadePolicy from './CascadePolicy';
export const withoutAIMetadataExtraction = () => /*#__PURE__*/React.createElement(CascadePolicy, {
  canEdit: true,
  isCascadingEnabled: true,
  onCascadeModeChange: () => {},
  onCascadeToggle: () => {},
  shouldShowCascadeOptions: true
});
export const withAIMetadataExtraction = () => /*#__PURE__*/React.createElement(CascadePolicy, {
  canEdit: true,
  canUseAIFolderExtraction: true,
  isAIFolderExtractionEnabled: true,
  isCascadingEnabled: true,
  onAIFolderExtractionToggle: () => {},
  onCascadeModeChange: () => {},
  onCascadeToggle: () => {},
  shouldShowCascadeOptions: true
});
export default {
  title: 'Features/Metadata Instance Editor/CascadePolicy',
  component: CascadePolicy
};
//# sourceMappingURL=CascadePolicy.stories.js.map