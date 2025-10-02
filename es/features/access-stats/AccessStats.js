function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import PlainButton from '../../components/plain-button/PlainButton';
import AccessStatsItemsList from './AccessStatsItemsList';
import messages from './messages';
import './AccessStats.scss';
const AccessStats = ({
  commentCount = 0,
  commentStatButtonProps = {},
  downloadCount = 0,
  downloadStatButtonProps = {},
  editCount = 0,
  editStatButtonProps = {},
  errorMessage,
  hasCountOverflowed = false,
  isBoxNote = false,
  openAccessStatsModal,
  previewCount = 0,
  previewStatButtonProps = {},
  viewMoreButtonProps = {},
  viewStatButtonProps = {}
}) => /*#__PURE__*/React.createElement("div", {
  className: "access-stats"
}, errorMessage ? /*#__PURE__*/React.createElement("p", null, errorMessage) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(AccessStatsItemsList, {
  commentCount: commentCount,
  commentStatButtonProps: commentStatButtonProps,
  downloadCount: downloadCount,
  downloadStatButtonProps: downloadStatButtonProps,
  editCount: editCount,
  editStatButtonProps: editStatButtonProps,
  hasCountOverflowed: hasCountOverflowed,
  isBoxNote: isBoxNote,
  openAccessStatsModal: openAccessStatsModal,
  previewCount: previewCount,
  previewStatButtonProps: previewStatButtonProps,
  viewStatButtonProps: viewStatButtonProps
}), openAccessStatsModal && /*#__PURE__*/React.createElement(PlainButton, _extends({
  className: "lnk access-stats-view-details",
  onClick: openAccessStatsModal
}, viewMoreButtonProps), /*#__PURE__*/React.createElement(FormattedMessage, messages.accessStatsViewDetails))));
export default AccessStats;
//# sourceMappingURL=AccessStats.js.map