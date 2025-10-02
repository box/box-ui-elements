const _excluded = ["className", "onViewModeChange", "viewMode"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import noop from 'lodash/noop';
import { Tooltip, IconButton } from '@box/blueprint-web';
import { Grid, Hamburger } from '@box/blueprint-web-assets/icons/Fill';
import { VIEW_MODE_GRID, VIEW_MODE_LIST } from '../../../constants';
import './ViewModeChangeButton.scss';
import messages from '../messages';
const ViewModeChangeButton = _ref => {
  let {
      className = '',
      onViewModeChange = noop,
      viewMode
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  const {
    formatMessage
  } = useIntl();
  const isGridView = viewMode === VIEW_MODE_GRID;
  const viewMessage = isGridView ? formatMessage(messages.listView) : formatMessage(messages.gridView);
  const onClick = () => {
    onViewModeChange(isGridView ? VIEW_MODE_LIST : VIEW_MODE_GRID);
  };
  return /*#__PURE__*/React.createElement(Tooltip, {
    content: viewMessage
  }, /*#__PURE__*/React.createElement(IconButton, _extends({
    "aria-label": viewMessage,
    "data-testid": "view-mode-change-button",
    className: classNames('bdl-ViewModeChangeButton', className),
    icon: isGridView ? Hamburger : Grid,
    onClick: onClick
  }, rest)));
};
export default ViewModeChangeButton;
//# sourceMappingURL=ViewModeChangeButton.js.map