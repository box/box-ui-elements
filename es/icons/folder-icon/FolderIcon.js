import * as React from 'react';
import { FolderExternal, FolderPersonal, FolderShared } from '@box/blueprint-web-assets/icons/Content';
import { useIntl } from 'react-intl';
import messages from '../../elements/common/messages';
const FolderIcon = ({
  dimension = 32,
  isCollab = false,
  isExternal = false,
  title
}) => {
  const {
    formatMessage
  } = useIntl();
  if (isExternal) {
    return /*#__PURE__*/React.createElement(FolderExternal, {
      "aria-label": title || formatMessage(messages.externalFolder),
      height: dimension,
      width: dimension
    });
  }
  if (isCollab) {
    return /*#__PURE__*/React.createElement(FolderShared, {
      "aria-label": title || formatMessage(messages.collaboratedFolder),
      height: dimension,
      width: dimension
    });
  }
  return /*#__PURE__*/React.createElement(FolderPersonal, {
    "aria-label": title || formatMessage(messages.personalFolder),
    height: dimension,
    width: dimension
  });
};
export default FolderIcon;
//# sourceMappingURL=FolderIcon.js.map