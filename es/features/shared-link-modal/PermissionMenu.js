import * as React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import DropdownMenu, { MenuToggle } from '../../components/dropdown-menu';
import PlainButton from '../../components/plain-button';
import { Menu, SelectMenuItem } from '../../components/menu';
import { permissionLevelPropType } from './propTypes';
import { CAN_VIEW, CAN_EDIT } from './constants';
import messages from './messages';
const permissionLevels = [CAN_VIEW, CAN_EDIT];
const PermissionMenu = props => {
  const {
    changePermissionLevel,
    permissionLevel,
    submitting
  } = props;
  if (!changePermissionLevel || !permissionLevel) {
    return null;
  }
  const permissionLabels = {
    [CAN_VIEW]: /*#__PURE__*/React.createElement(FormattedMessage, messages.canView),
    [CAN_EDIT]: /*#__PURE__*/React.createElement(FormattedMessage, messages.canEdit)
  };
  return /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(PlainButton, {
    className: classNames('lnk', {
      'is-disabled bdl-is-disabled': submitting
    }),
    disabled: submitting
  }, /*#__PURE__*/React.createElement(MenuToggle, null, permissionLabels[permissionLevel])), /*#__PURE__*/React.createElement(Menu, null, permissionLevels.map(level => /*#__PURE__*/React.createElement(SelectMenuItem, {
    key: level,
    isSelected: level === permissionLevel,
    onClick: () => changePermissionLevel(level)
  }, permissionLabels[level]))));
};
PermissionMenu.displayName = 'PermissionMenu';
export default PermissionMenu;
//# sourceMappingURL=PermissionMenu.js.map