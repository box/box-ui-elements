function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { TooltipProvider } from '@box/blueprint-web';
import CascadePolicy from '../../CascadePolicy';
const baseProps = {
  canEdit: true,
  canUseAIFolderExtraction: true,
  isAIFolderExtractionEnabled: false,
  isCascadingEnabled: true,
  isCascadingOverwritten: false,
  isCustomMetadata: false,
  onAIFolderExtractionToggle: () => {},
  onCascadeModeChange: () => {},
  onCascadeToggle: () => {},
  shouldShowCascadeOptions: true
};
const Template = props => /*#__PURE__*/React.createElement(TooltipProvider, null, /*#__PURE__*/React.createElement(CascadePolicy, _extends({}, baseProps, props)));
const EnabledCascadePolicyOptionsFieldsOnly = () => /*#__PURE__*/React.createElement(Template, {
  isExistingCascadePolicy: false
});
EnabledCascadePolicyOptionsFieldsOnly.storyName = 'Enabled Cascade Policy Options';
const DisabledCascadePolicyOptionsFieldsOnly = () => /*#__PURE__*/React.createElement(Template, {
  isExistingCascadePolicy: true
});
DisabledCascadePolicyOptionsFieldsOnly.storyName = 'Disabled Cascade Policy Options';
export { EnabledCascadePolicyOptionsFieldsOnly, DisabledCascadePolicyOptionsFieldsOnly };
export default {
  title: 'Features/Metadata Instance Editor/CascadePolicy/Visual',
  component: CascadePolicy
};
//# sourceMappingURL=CascadePolicy-visual.stories.js.map