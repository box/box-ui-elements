function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';
import AsyncLoad from '../../elements/common/async-load';
import ClassifiedBadge from './ClassifiedBadge';
import Label from '../../components/label/Label';
import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
import SecurityControls from './security-controls';
import { isValidDate } from '../../utils/datetime';
import messages from './messages';
import './Classification.scss';
const STYLE_INLINE = 'inline';
const STYLE_TOOLTIP = 'tooltip';
const LoadableAppliedByAiClassificationReason = AsyncLoad({
  loader: () => import(/* webpackMode: "lazy", webpackChunkName: "applied-by-ai-classification-reason" */'./applied-by-ai-classification-reason/AppliedByAiClassificationReason')
});
const Classification = ({
  aiClassificationReason,
  className = '',
  color,
  controls,
  controlsFormat,
  definition,
  isImportedClassification = false,
  isLoadingAppliedBy = false,
  isLoadingControls,
  itemName = '',
  maxAppCount,
  messageStyle,
  modifiedAt,
  modifiedBy,
  name,
  onClick,
  shouldDisplayAppsAsIntegrations = false,
  shouldUseAppliedByLabels = false
}) => {
  const isClassified = !!name;
  const hasDefinition = !!definition;
  const hasModifiedAt = !!modifiedAt;
  const hasModifiedBy = !!modifiedBy;
  const hasSecurityControls = !!controls;
  const isTooltipMessageEnabled = isClassified && hasDefinition && messageStyle === STYLE_TOOLTIP;
  const isInlineMessageEnabled = isClassified && hasDefinition && messageStyle === STYLE_INLINE;
  const isNotClassifiedMessageVisible = !isClassified && messageStyle === STYLE_INLINE;
  const isControlsIndicatorEnabled = isClassified && isLoadingControls && messageStyle === STYLE_INLINE;
  const isSecurityControlsEnabled = isClassified && !isLoadingControls && hasSecurityControls && messageStyle === STYLE_INLINE;
  const modifiedDate = new Date(modifiedAt || 0);
  const isModifiedMessageVisible = isClassified && hasModifiedAt && isValidDate(modifiedDate) && hasModifiedBy && messageStyle === STYLE_INLINE;
  const hasAiClassificationReason = messageStyle === STYLE_INLINE && isClassified && (isLoadingAppliedBy || Boolean(aiClassificationReason));
  const shouldRenderModificationDetails = isModifiedMessageVisible || hasAiClassificationReason;
  const formattedModifiedAt = isModifiedMessageVisible && /*#__PURE__*/React.createElement(FormattedDate, {
    value: modifiedDate,
    month: "long",
    year: "numeric",
    day: "numeric"
  });
  const modifiedByMessage = isImportedClassification ? messages.importedBy : messages.modifiedBy;
  const modificationTitleLabel = shouldUseAppliedByLabels || hasAiClassificationReason ? messages.appliedByTitle : messages.modifiedByLabel;
  const modifiedByDetails = shouldUseAppliedByLabels ? /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, messages.appliedByDetails, {
    values: {
      appliedAt: formattedModifiedAt,
      appliedBy: modifiedBy
    }
  })) : /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, modifiedByMessage, {
    values: {
      modifiedAt: formattedModifiedAt,
      modifiedBy
    }
  }));
  const renderModificationDetails = () => {
    if (isLoadingAppliedBy) {
      return /*#__PURE__*/React.createElement(LoadingIndicator, null);
    }
    if (aiClassificationReason) {
      return /*#__PURE__*/React.createElement(LoadableAppliedByAiClassificationReason, {
        answer: aiClassificationReason.answer,
        citations: aiClassificationReason.citations,
        className: "bdl-Classification-appliedByAiDetails",
        modifiedAt: aiClassificationReason.modifiedAt
      });
    }
    return /*#__PURE__*/React.createElement("p", {
      className: "bdl-Classification-modifiedBy",
      "data-testid": "classification-modifiedby"
    }, modifiedByDetails);
  };
  return /*#__PURE__*/React.createElement("article", {
    className: `bdl-Classification ${className}`
  }, isClassified && /*#__PURE__*/React.createElement(ClassifiedBadge, {
    color: color,
    name: name,
    onClick: onClick,
    tooltipText: isTooltipMessageEnabled ? definition : undefined
  }), isInlineMessageEnabled && /*#__PURE__*/React.createElement(Label, {
    text: /*#__PURE__*/React.createElement(FormattedMessage, messages.definition)
  }, /*#__PURE__*/React.createElement("p", {
    className: "bdl-Classification-definition"
  }, definition)), isNotClassifiedMessageVisible && /*#__PURE__*/React.createElement("span", {
    className: "bdl-Classification-missingMessage"
  }, /*#__PURE__*/React.createElement(FormattedMessage, messages.missing)), shouldRenderModificationDetails && /*#__PURE__*/React.createElement(Label, {
    text: /*#__PURE__*/React.createElement(FormattedMessage, modificationTitleLabel)
  }, renderModificationDetails()), isSecurityControlsEnabled && /*#__PURE__*/React.createElement(SecurityControls, {
    classificationColor: color,
    classificationName: name,
    controls: controls,
    controlsFormat: controlsFormat,
    definition: definition,
    itemName: itemName,
    maxAppCount: maxAppCount,
    shouldRenderLabel: true,
    shouldDisplayAppsAsIntegrations: shouldDisplayAppsAsIntegrations
  }), isControlsIndicatorEnabled && /*#__PURE__*/React.createElement(LoadingIndicator, null));
};
export { STYLE_INLINE, STYLE_TOOLTIP };
export default Classification;
//# sourceMappingURL=Classification.js.map