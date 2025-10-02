import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import NoTagsIcon from './NoTagsIcon';
// @ts-ignore: no ts definition
import messages from './messages';
const EmptyTags = () => /*#__PURE__*/React.createElement("div", {
  className: "bcs-DocGen-emptyState"
}, /*#__PURE__*/React.createElement(NoTagsIcon, {
  className: "bcs-DocGen-emptyState--icon"
}), /*#__PURE__*/React.createElement("strong", null, /*#__PURE__*/React.createElement(FormattedMessage, messages.noTags)));
export default EmptyTags;
//# sourceMappingURL=EmptyTags.js.map