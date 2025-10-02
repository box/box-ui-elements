function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { InlineNotice } from '@box/blueprint-web';
import { useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

// $FlowFixMe
import { BoxAiAdvancedLogo24, BoxAiLogo24 } from '@box/blueprint-web-assets/icons/Logo';
// $FlowFixMe
import { BoxAiAgentSelectorWithApiContainer } from '@box/box-ai-agent-selector';
import Toggle from '../../components/toggle';
import { RadioButton, RadioGroup } from '../../components/radio';
import Link from '../../components/link/Link';
import IconAlertDefault from '../../icons/general/IconAlertDefault';
import messages from './messages';
import './CascadePolicy.scss';
import { STANDARD_AGENT_ID, ENHANCED_AGENT_ID, ENHANCED_AGENT_CONFIGURATION } from './constants';
const COMMUNITY_LINK = 'https://support.box.com/hc/en-us/articles/360044195873-Cascading-metadata-in-folders';
const AI_LINK = 'https://www.box.com/ai';
const CascadePolicy = ({
  canEdit,
  canUseAIFolderExtraction,
  cascadePolicyConfiguration,
  isCascadingEnabled,
  isCascadingOverwritten,
  isCustomMetadata,
  isAIFolderExtractionEnabled,
  isExistingCascadePolicy,
  onAIFolderExtractionToggle,
  onAIAgentSelect,
  onCascadeToggle,
  onCascadeModeChange,
  shouldShowCascadeOptions
}) => {
  const {
    formatMessage
  } = useIntl();
  const readOnlyState = isCascadingEnabled ? /*#__PURE__*/React.createElement("div", {
    className: "metadata-cascade-notice"
  }, /*#__PURE__*/React.createElement(FormattedMessage, messages.metadataCascadePolicyEnabledInfo)) : null;
  const isEnhancedAgentSelected = cascadePolicyConfiguration?.agent === ENHANCED_AGENT_CONFIGURATION;
  const agents = React.useMemo(() => [{
    id: STANDARD_AGENT_ID,
    name: formatMessage(messages.standardAgentName),
    isEnterpriseDefault: true
  }, {
    id: ENHANCED_AGENT_ID,
    name: formatMessage(messages.enhancedAgentName),
    isEnterpriseDefault: false,
    customIcon: BoxAiAdvancedLogo24,
    isSelected: isEnhancedAgentSelected
  }], [formatMessage, isEnhancedAgentSelected]);

  // BoxAiAgentSelectorWithApiContainer expects a function that returns a Promise<AgentListResponse>
  // Since we're passing in our own agents, we don't need to make an API call,
  // so we wrap the store data in a Promise to satisfy the component's interface requirements.
  const agentFetcher = useCallback(() => {
    return Promise.resolve({
      agents
    });
  }, [agents]);
  const handleAgentSelect = useCallback(agent => {
    if (onAIAgentSelect) {
      onAIAgentSelect(agent);
    }
  }, [onAIAgentSelect]);
  return canEdit ? /*#__PURE__*/React.createElement(React.Fragment, null, isExistingCascadePolicy && /*#__PURE__*/React.createElement(InlineNotice, {
    variant: "info",
    variantIconAriaLabel: formatMessage(messages.cascadePolicyOptionsDisabledNoticeIconAriaLabel)
  }, /*#__PURE__*/React.createElement(FormattedMessage, messages.cascadePolicyOptionsDisabledNotice)), /*#__PURE__*/React.createElement("div", {
    className: "metadata-cascade-editor"
  }, /*#__PURE__*/React.createElement("div", {
    className: "metadata-cascade-enable",
    "data-testid": "metadata-cascade-enable"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(FormattedMessage, _extends({
    tagName: "strong"
  }, messages.enableCascadePolicy)), !isCustomMetadata && /*#__PURE__*/React.createElement(Toggle, {
    "aria-label": formatMessage(messages.enableCascadePolicy),
    className: `metadata-cascade-toggle ${isCascadingEnabled ? 'cascade-on' : 'cascade-off'}`,
    isOn: isCascadingEnabled,
    label: "",
    onChange: e => onCascadeToggle(e.target.checked)
  })), !isCustomMetadata ? /*#__PURE__*/React.createElement("div", {
    className: "cascade-policy-text"
  }, /*#__PURE__*/React.createElement(FormattedMessage, messages.applyCascadePolicyText), "\xA0", /*#__PURE__*/React.createElement(Link, {
    className: "cascade-policy-link",
    href: COMMUNITY_LINK,
    target: "_blank"
  }, /*#__PURE__*/React.createElement(FormattedMessage, messages.cascadePolicyLearnMore))) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(FormattedMessage, messages.cannotApplyCascadePolicyText)))), shouldShowCascadeOptions && /*#__PURE__*/React.createElement("div", {
    className: "metadata-cascade-editor"
  }, /*#__PURE__*/React.createElement("div", {
    className: "metadata-cascading-mode"
  }, /*#__PURE__*/React.createElement(FormattedMessage, messages.cascadePolicyModeQuestion), /*#__PURE__*/React.createElement("div", {
    className: "metadata-operation-not-immediate"
  }, /*#__PURE__*/React.createElement(IconAlertDefault, null), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(FormattedMessage, messages.operationNotImmediate))), /*#__PURE__*/React.createElement(RadioGroup, {
    className: "metadata-cascading-options",
    onChange: e => onCascadeModeChange(e.target.value === 'overwrite'),
    value: isCascadingOverwritten ? 'overwrite' : 'skip'
  }, /*#__PURE__*/React.createElement(RadioButton, {
    isDisabled: isExistingCascadePolicy,
    label: /*#__PURE__*/React.createElement(FormattedMessage, messages.cascadePolicySkipMode),
    value: "skip"
  }), /*#__PURE__*/React.createElement(RadioButton, {
    isDisabled: isExistingCascadePolicy,
    label: /*#__PURE__*/React.createElement(FormattedMessage, messages.cascadePolicyOverwriteMode),
    value: "overwrite"
  })))), shouldShowCascadeOptions && canUseAIFolderExtraction && /*#__PURE__*/React.createElement("div", {
    className: "metadata-cascade-editor",
    "data-testid": "ai-folder-extraction"
  }, /*#__PURE__*/React.createElement("div", {
    className: "metadata-cascade-enable"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(BoxAiLogo24, {
    className: "metadata-cascade-ai-logo",
    width: 16,
    height: 16
  }), /*#__PURE__*/React.createElement(FormattedMessage, _extends({
    tagName: "strong"
  }, messages.enableAIAutofill)), /*#__PURE__*/React.createElement(Toggle, {
    "aria-label": formatMessage(messages.enableAIAutofill),
    className: "metadata-cascade-toggle",
    isOn: isAIFolderExtractionEnabled,
    isDisabled: isExistingCascadePolicy,
    label: "",
    onChange: e => onAIFolderExtractionToggle(e.target.checked)
  })), /*#__PURE__*/React.createElement("div", {
    className: "cascade-policy-text"
  }, /*#__PURE__*/React.createElement(FormattedMessage, messages.aiAutofillDescription), "\xA0", /*#__PURE__*/React.createElement(Link, {
    className: "cascade-policy-link",
    href: AI_LINK,
    target: "_blank"
  }, /*#__PURE__*/React.createElement(FormattedMessage, messages.aiAutofillLearnMore))), isAIFolderExtractionEnabled && /*#__PURE__*/React.createElement("div", {
    className: "metadata-cascade-ai-agent-selector"
  }, /*#__PURE__*/React.createElement(BoxAiAgentSelectorWithApiContainer, {
    disabled: isExistingCascadePolicy,
    fetcher: agentFetcher,
    onSelectAgent: handleAgentSelect,
    recordAction: () => {},
    selectorAlignment: "left"
  }))))) : readOnlyState;
};
export default CascadePolicy;
//# sourceMappingURL=CascadePolicy.js.map