import * as React from 'react';
import classNames from 'classnames';
import LabelPill from '../../../../../components/label-pill';
import './styles/MessageTags.scss';
const generateTags = tags => {
  const tagArray = tags.split(',');
  return tagArray.filter(tag => !!tag).map(tag => {
    return /*#__PURE__*/React.createElement(LabelPill.Pill, {
      key: `${tag}`,
      className: "MessageTags-tag"
    }, /*#__PURE__*/React.createElement(LabelPill.Text, null, tag.trim()));
  });
};
function MessageTags({
  tags,
  className
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: classNames('MessageTags', className)
  }, generateTags(tags));
}
export default MessageTags;
//# sourceMappingURL=MessageTags.js.map