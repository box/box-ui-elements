import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import IconAddMetadataEmptyState from '../../icons/general/IconAddMetadataEmptyState';
import messages from './messages';
import './EmptyContent.scss';
const EmptyContent = ({
  canAdd
}) => /*#__PURE__*/React.createElement("div", {
  className: "metadata-instance-editor-no-instances"
}, /*#__PURE__*/React.createElement(IconAddMetadataEmptyState, null), /*#__PURE__*/React.createElement("p", {
  className: "metadata-instance-editor-no-instances--call-out"
}, /*#__PURE__*/React.createElement(FormattedMessage, messages.noMetadata)), canAdd && /*#__PURE__*/React.createElement("p", {
  className: "metadata-instance-editor-no-instances--how-add-template"
}, /*#__PURE__*/React.createElement(FormattedMessage, messages.noMetadataAddTemplate)));
export default EmptyContent;
//# sourceMappingURL=EmptyContent.js.map