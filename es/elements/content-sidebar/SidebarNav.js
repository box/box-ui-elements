/**
 * 
 * @file Preview sidebar nav component
 * @author Box
 */

import * as React from 'react';
import { injectIntl } from 'react-intl';
import noop from 'lodash/noop';
// $FlowFixMe
import { BoxAiLogo } from '@box/blueprint-web-assets/icons/Logo';
// $FlowFixMe
import { Size6 } from '@box/blueprint-web-assets/tokens/tokens';
import { usePromptFocus } from '@box/box-ai-content-answers';
import AdditionalTabs from './additional-tabs';
import DocGenIcon from '../../icon/fill/DocGenIcon';
import IconChatRound from '../../icons/general/IconChatRound';
import IconDocInfo from '../../icons/general/IconDocInfo';
import IconMagicWand from '../../icons/general/IconMagicWand';
import IconMetadataThick from '../../icons/general/IconMetadataThick';
import SidebarNavButton from './SidebarNavButton';
import SidebarNavSign from './SidebarNavSign';
import SidebarNavTablist from './SidebarNavTablist';
import SidebarToggle from './SidebarToggle';
import messages from '../common/messages';
import { SIDEBAR_NAV_TARGETS } from '../common/interactionTargets';
import { SIDEBAR_VIEW_ACTIVITY, SIDEBAR_VIEW_BOXAI, SIDEBAR_VIEW_DETAILS, SIDEBAR_VIEW_DOCGEN, SIDEBAR_VIEW_METADATA, SIDEBAR_VIEW_SKILLS } from '../../constants';
import { useFeatureConfig } from '../common/feature-checking';
import './SidebarNav.scss';
const SidebarNav = ({
  additionalTabs,
  elementId,
  fileId,
  hasActivity,
  hasAdditionalTabs,
  hasBoxAI,
  hasDetails,
  hasMetadata,
  hasSkills,
  hasDocGen = false,
  internalSidebarNavigation,
  internalSidebarNavigationHandler,
  intl,
  isOpen,
  onNavigate,
  onPanelChange = noop,
  routerDisabled,
  signSidebarProps
}) => {
  const {
    enabled: hasBoxSign
  } = signSidebarProps || {};
  const {
    disabledTooltip: boxAIDisabledTooltip,
    showOnlyNavButton: showOnlyBoxAINavButton
  } = useFeatureConfig('boxai.sidebar');
  const {
    focusPrompt
  } = usePromptFocus('.be.bcs');
  const handleSidebarNavButtonClick = sidebarview => {
    onPanelChange(sidebarview, false);

    // If the Box AI sidebar is enabled, focus the Box AI sidebar prompt
    if (sidebarview === SIDEBAR_VIEW_BOXAI) {
      focusPrompt();
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "bcs-SidebarNav",
    "aria-label": intl.formatMessage(messages.sidebarNavLabel)
  }, /*#__PURE__*/React.createElement("div", {
    className: "bcs-SidebarNav-tabs"
  }, /*#__PURE__*/React.createElement(SidebarNavTablist, {
    elementId: elementId,
    internalSidebarNavigation: internalSidebarNavigation,
    internalSidebarNavigationHandler: internalSidebarNavigationHandler,
    isOpen: isOpen,
    onNavigate: onNavigate,
    routerDisabled: routerDisabled
  }, hasBoxAI && /*#__PURE__*/React.createElement(SidebarNavButton, {
    "data-resin-target": SIDEBAR_NAV_TARGETS.BOXAI,
    "data-target-id": "SidebarNavButton-boxAI",
    "data-testid": "sidebarboxai",
    isDisabled: showOnlyBoxAINavButton,
    onClick: handleSidebarNavButtonClick,
    sidebarView: SIDEBAR_VIEW_BOXAI,
    tooltip: showOnlyBoxAINavButton ? boxAIDisabledTooltip : intl.formatMessage(messages.sidebarBoxAITitle)
  }, /*#__PURE__*/React.createElement(BoxAiLogo, {
    height: Size6,
    width: Size6
  })), hasActivity && /*#__PURE__*/React.createElement(SidebarNavButton, {
    "data-resin-target": SIDEBAR_NAV_TARGETS.ACTIVITY,
    "data-target-id": "SidebarNavButton-activity",
    "data-testid": "sidebaractivity",
    onClick: handleSidebarNavButtonClick,
    sidebarView: SIDEBAR_VIEW_ACTIVITY,
    tooltip: intl.formatMessage(messages.sidebarActivityTitle)
  }, /*#__PURE__*/React.createElement(IconChatRound, {
    className: "bcs-SidebarNav-icon"
  })), hasDetails && /*#__PURE__*/React.createElement(SidebarNavButton, {
    "data-resin-target": SIDEBAR_NAV_TARGETS.DETAILS,
    "data-target-id": "SidebarNavButton-details",
    "data-testid": "sidebardetails",
    onClick: handleSidebarNavButtonClick,
    sidebarView: SIDEBAR_VIEW_DETAILS,
    tooltip: intl.formatMessage(messages.sidebarDetailsTitle)
  }, /*#__PURE__*/React.createElement(IconDocInfo, {
    className: "bcs-SidebarNav-icon"
  })), hasSkills && /*#__PURE__*/React.createElement(SidebarNavButton, {
    "data-resin-target": SIDEBAR_NAV_TARGETS.SKILLS,
    "data-target-id": "SidebarNavButton-skills",
    "data-testid": "sidebarskills",
    onClick: handleSidebarNavButtonClick,
    sidebarView: SIDEBAR_VIEW_SKILLS,
    tooltip: intl.formatMessage(messages.sidebarSkillsTitle)
  }, /*#__PURE__*/React.createElement(IconMagicWand, {
    className: "bcs-SidebarNav-icon"
  })), hasMetadata && /*#__PURE__*/React.createElement(SidebarNavButton, {
    "data-resin-target": SIDEBAR_NAV_TARGETS.METADATA,
    "data-target-id": "SidebarNavButton-metadata",
    "data-testid": "sidebarmetadata",
    onClick: handleSidebarNavButtonClick,
    sidebarView: SIDEBAR_VIEW_METADATA,
    tooltip: intl.formatMessage(messages.sidebarMetadataTitle)
  }, /*#__PURE__*/React.createElement(IconMetadataThick, {
    className: "bcs-SidebarNav-icon"
  })), hasDocGen && /*#__PURE__*/React.createElement(SidebarNavButton, {
    "data-resin-target": SIDEBAR_NAV_TARGETS.DOCGEN,
    "data-target-id": "SidebarNavButton-docGen",
    "data-testid": "sidebardocgen",
    onClick: handleSidebarNavButtonClick,
    sidebarView: SIDEBAR_VIEW_DOCGEN,
    tooltip: intl.formatMessage(messages.sidebarDocGenTooltip)
  }, /*#__PURE__*/React.createElement(DocGenIcon, {
    className: "bcs-SidebarNav-icon"
  }))), hasBoxSign && /*#__PURE__*/React.createElement("div", {
    className: "bcs-SidebarNav-secondary"
  }, /*#__PURE__*/React.createElement(SidebarNavSign, signSidebarProps)), hasAdditionalTabs && /*#__PURE__*/React.createElement("div", {
    className: "bcs-SidebarNav-overflow",
    "data-testid": "additional-tabs-overflow"
  }, /*#__PURE__*/React.createElement(AdditionalTabs, {
    key: fileId,
    tabs: additionalTabs
  }))), /*#__PURE__*/React.createElement("div", {
    className: "bcs-SidebarNav-footer"
  }, /*#__PURE__*/React.createElement(SidebarToggle, {
    internalSidebarNavigation: internalSidebarNavigation,
    internalSidebarNavigationHandler: internalSidebarNavigationHandler,
    isOpen: isOpen,
    routerDisabled: routerDisabled
  })));
};
export default injectIntl(SidebarNav);
//# sourceMappingURL=SidebarNav.js.map