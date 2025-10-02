import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '../../components/button/Button';
import PlainButton from '../../components/plain-button/PlainButton';
import PrimaryButton from '../../components/primary-button/PrimaryButton';
import messages from './messages';
import './Footer.scss';
const Footer = ({
  onCancel,
  onRemove,
  showSave
}) => /*#__PURE__*/React.createElement("div", {
  className: "metadata-instance-editor-footer"
}, /*#__PURE__*/React.createElement("div", {
  className: "metadata-instance-editor-footer-delete"
}, /*#__PURE__*/React.createElement(PlainButton, {
  "data-resin-target": "metadata-instanceremove",
  onClick: onRemove,
  type: "button"
}, /*#__PURE__*/React.createElement(FormattedMessage, messages.metadataRemoveTemplate))), /*#__PURE__*/React.createElement("div", {
  className: "metadata-instance-editor-footer-save-cancel"
}, /*#__PURE__*/React.createElement(Button, {
  "data-resin-target": "metadata-instancecancel",
  onClick: onCancel,
  type: "button"
}, /*#__PURE__*/React.createElement(FormattedMessage, messages.metadataCancel)), showSave && /*#__PURE__*/React.createElement(PrimaryButton, {
  "data-resin-target": "metadata-instancesave"
}, /*#__PURE__*/React.createElement(FormattedMessage, messages.metadataSave))));
export default Footer;
//# sourceMappingURL=Footer.js.map