import * as React from 'react';
import AccessStatsItem from './AccessStatsItem';
const AccessStatsItemsList = ({
  commentCount,
  commentStatButtonProps,
  downloadCount,
  downloadStatButtonProps,
  editCount,
  editStatButtonProps,
  hasCountOverflowed = false,
  isBoxNote,
  openAccessStatsModal,
  previewCount,
  previewStatButtonProps,
  viewStatButtonProps
}) => /*#__PURE__*/React.createElement("ul", {
  className: "access-stats-list"
}, /*#__PURE__*/React.createElement(AccessStatsItem, {
  count: previewCount,
  hasCountOverflowed: hasCountOverflowed,
  openAccessStatsModal: openAccessStatsModal,
  statButtonProps: isBoxNote ? viewStatButtonProps : previewStatButtonProps,
  type: isBoxNote ? 'view' : 'preview'
}), /*#__PURE__*/React.createElement(AccessStatsItem, {
  count: editCount,
  hasCountOverflowed: hasCountOverflowed,
  openAccessStatsModal: openAccessStatsModal,
  statButtonProps: editStatButtonProps,
  type: "edit"
}), /*#__PURE__*/React.createElement(AccessStatsItem, {
  count: commentCount,
  hasCountOverflowed: hasCountOverflowed,
  openAccessStatsModal: openAccessStatsModal,
  statButtonProps: commentStatButtonProps,
  type: "comment"
}), !isBoxNote && /*#__PURE__*/React.createElement(AccessStatsItem, {
  count: downloadCount,
  hasCountOverflowed: hasCountOverflowed,
  openAccessStatsModal: openAccessStatsModal,
  statButtonProps: downloadStatButtonProps,
  type: "download"
}));
export default AccessStatsItemsList;
//# sourceMappingURL=AccessStatsItemsList.js.map