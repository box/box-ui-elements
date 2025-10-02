const _excluded = ["className", "tooltip"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BetaBadge } from '../../components/badge';
import { Link } from '../../components/link';
import Tooltip from '../../components/tooltip/Tooltip';
import messages from './messages';
import './styles/BetaFeedbackBadge.scss';
const BetaFeedbackBadge = _ref => {
  let {
      className = '',
      tooltip = false
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  const classes = classNames('bdl-HeaderFeedbackBadge', className);
  const {
    formUrl
  } = rest;
  const badge = tooltip ? /*#__PURE__*/React.createElement(Tooltip, {
    text: /*#__PURE__*/React.createElement(FormattedMessage, messages.feedbackCtaText),
    position: "middle-right"
  }, /*#__PURE__*/React.createElement(BetaBadge, {
    "aria-hidden": true,
    className: "bdl-HeaderFeedbackBadge-betaBadge"
  })) : /*#__PURE__*/React.createElement(BetaBadge, {
    className: "bdl-HeaderFeedbackBadge-betaBadge"
  });

  // TODO: tooltip may require constrainToScrollParent & constrainToWindow in some contexts
  return /*#__PURE__*/React.createElement("span", {
    className: classes
  }, /*#__PURE__*/React.createElement("span", {
    id: "bdl-HeaderFeedbackBadge-ariaLabel",
    "aria-hidden": "true",
    hidden: true
  }, /*#__PURE__*/React.createElement(FormattedMessage, messages.feedbackFormDescription)), /*#__PURE__*/React.createElement(Link, {
    href: formUrl,
    target: "_blank",
    "aria-labelledby": "bdl-HeaderFeedbackBadge-ariaLabel"
  }, badge));
};
export default BetaFeedbackBadge;
//# sourceMappingURL=BetaFeedbackBadge.js.map