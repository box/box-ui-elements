function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { AnswerContent, References } from '@box/box-ai-content-answers';
import { Card, Text } from '@box/blueprint-web';
import BoxAIIconColor from '@box/blueprint-web-assets/icons/Logo/BoxAiLogo';
import { Size5 } from '@box/blueprint-web-assets/tokens/tokens';
import { isValidDate } from '../../../utils/datetime';
import messages from './messages';
import './AppliedByAiClassificationReason.scss';
const AppliedByAiClassificationReason = ({
  answer,
  citations,
  className = '',
  modifiedAt
}) => {
  const modifiedDate = new Date(modifiedAt);
  const isModifiedDateAvailable = Boolean(modifiedAt) && isValidDate(modifiedDate);
  const formattedModifiedAt = isModifiedDateAvailable && /*#__PURE__*/React.createElement(FormattedDate, {
    value: modifiedDate,
    month: "long",
    year: "numeric",
    day: "numeric"
  });
  const hasContent = Boolean(answer) || Boolean(citations);
  return /*#__PURE__*/React.createElement(Card, {
    className: classNames('bdl-AppliedByAiClassificationReason', {
      'bdl-AppliedByAiClassificationReason--noContent': !hasContent
    }, className)
  }, /*#__PURE__*/React.createElement("h3", {
    className: "bdl-AppliedByAiClassificationReason-header"
  }, /*#__PURE__*/React.createElement(BoxAIIconColor, {
    "data-testid": "box-ai-icon",
    height: Size5,
    width: Size5
  }), /*#__PURE__*/React.createElement(Text, {
    className: "bdl-AppliedByAiClassificationReason-headerText",
    as: "span",
    color: "textOnLightSecondary",
    variant: "bodyDefaultSemibold"
  }, isModifiedDateAvailable ? /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, messages.appliedByBoxAiOnDate, {
    values: {
      modifiedAt: formattedModifiedAt
    }
  })) : /*#__PURE__*/React.createElement(FormattedMessage, messages.appliedByBoxAi))), answer && /*#__PURE__*/React.createElement(AnswerContent, {
    className: "bdl-AppliedByAiClassificationReason-answer",
    answer: answer
  }), citations && /*#__PURE__*/React.createElement("div", {
    className: "bdl-AppliedByAiClassificationReason-references"
  }, /*#__PURE__*/React.createElement(References, {
    citations: citations
  })));
};
export default AppliedByAiClassificationReason;
//# sourceMappingURL=AppliedByAiClassificationReason.js.map