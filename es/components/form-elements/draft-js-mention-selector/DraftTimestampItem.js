import * as React from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';
import './DraftTimestamp.scss';
const DraftTimestampItem = ({
  children
}) => {
  const {
    formatMessage
  } = useIntl();
  const videoTimestampLabel = formatMessage(messages.commentTimestampLabel);
  return /*#__PURE__*/React.createElement("div", {
    className: "bcs-CommentTimestamp-entity",
    "aria-label": videoTimestampLabel,
    contentEditable: false,
    suppressContentEditableWarning: true
  }, children);
};
export default DraftTimestampItem;
//# sourceMappingURL=DraftTimestampItem.js.map