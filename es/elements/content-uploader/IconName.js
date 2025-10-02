import * as React from 'react';
import { useIntl } from 'react-intl';
import { FolderPersonal } from '@box/blueprint-web-assets/icons/Content';
import { Size8 } from '@box/blueprint-web-assets/tokens/tokens';
import Badgeable from '../../components/badgeable';
import FileIcon from '../../icons/file-icon/FileIcon';
import IconAlertDefault from '../../icons/general/IconAlertDefault';
import ItemName from './ItemName';
import { STATUS_ERROR } from '../../constants';
import messages from '../common/messages';
import './IconName.scss';
const IconName = ({
  name,
  extension,
  isFolder = false,
  isResumableUploadsEnabled,
  status
}) => {
  const {
    formatMessage
  } = useIntl();
  let icon = isFolder ? /*#__PURE__*/React.createElement(FolderPersonal, {
    height: Size8,
    "aria-label": formatMessage(messages.folder),
    width: Size8
  }) : /*#__PURE__*/React.createElement(FileIcon, {
    extension: extension
  });
  if (isResumableUploadsEnabled && status === STATUS_ERROR) {
    icon = /*#__PURE__*/React.createElement(Badgeable, {
      className: "bcu-icon-badge",
      bottomRight: /*#__PURE__*/React.createElement(IconAlertDefault, {
        height: 18,
        title: formatMessage(messages.error),
        width: 18
      })
    }, icon);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "bcu-item-icon-name"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bcu-item-icon",
    "data-testid": "bcu-IconName-icon"
  }, icon), /*#__PURE__*/React.createElement("div", {
    className: "bcu-item-name"
  }, /*#__PURE__*/React.createElement(ItemName, {
    name: name
  })));
};
export default IconName;
//# sourceMappingURL=IconName.js.map