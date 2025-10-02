import * as React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from '../../components/table';
import { Flyout, Overlay } from '../../components/flyout';
import IconInfo from '../../icons/general/IconInfo';
import messages from './messages';
import './PermissionFlyout.scss';
const PermissionFlyout = ({
  intl: {
    formatMessage
  }
}) => {
  const columnHeaders = [formatMessage(messages.permissionLevelsTableHeaderText), formatMessage(messages.uploadTableHeaderText), formatMessage(messages.downloadTableHeaderText), formatMessage(messages.previewTableHeaderText), formatMessage(messages.getLinkTableHeaderText), formatMessage(messages.editTableHeaderText), formatMessage(messages.deleteTableHeaderText), formatMessage(messages.ownerTableHeaderText)];
  const data = [[formatMessage(messages.coownerLevelText), '●', '●', '●', '●', '●', '●', '●'], [formatMessage(messages.editorLevelText), '●', '●', '●', '●', '●', '●', ''], [formatMessage(messages.viewerUploaderLevelText), '●', '●', '●', '●', '●', '', ''], [formatMessage(messages.previewerUploaderLevelText), '●', '', '●', '', '', '', ''], [formatMessage(messages.viewerLevelText), '', '●', '●', '●', '', '', ''], [formatMessage(messages.previewerLevelText), '', '', '●', '', '', '', ''], [formatMessage(messages.uploaderLevelText), '●', '', '', '', '', '', '']];
  return /*#__PURE__*/React.createElement(Flyout, {
    className: "invitation-permission-flyout-overlay",
    position: "top-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "invitation-permission-flyout-target",
    "data-resin-target": "learnmore"
  }, /*#__PURE__*/React.createElement(IconInfo, {
    height: 16,
    with: 16
  }), /*#__PURE__*/React.createElement(FormattedMessage, messages.inviteePermissionsLearnMore)), /*#__PURE__*/React.createElement(Overlay, null, /*#__PURE__*/React.createElement(Table, {
    isCompact: true
  }, /*#__PURE__*/React.createElement(TableHeader, null, columnHeaders.map(header => /*#__PURE__*/React.createElement(TableHeaderCell, {
    key: header
  }, header))), /*#__PURE__*/React.createElement(TableBody, null, data.map((row, rowIndex) => /*#__PURE__*/React.createElement(TableRow, {
    key: rowIndex
  }, row.map((cell, colIndex) => /*#__PURE__*/React.createElement(TableCell, {
    key: `${rowIndex}${colIndex}`
  }, cell))))))));
};
PermissionFlyout.displayName = 'PermissionFlyout';
PermissionFlyout.propTypes = {
  intl: PropTypes.any
};
export { PermissionFlyout as PermissionFlyoutBase };
export default injectIntl(PermissionFlyout);
//# sourceMappingURL=PermissionFlyout.js.map