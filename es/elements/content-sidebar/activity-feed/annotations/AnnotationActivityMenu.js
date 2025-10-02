import * as React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import DropdownMenu from '../../../../components/dropdown-menu';
import Checkmark16 from '../../../../icon/fill/Checkmark16';
import IconEllipsis from '../../../../icons/general/IconEllipsis';
import Pencil16 from '../../../../icon/line/Pencil16';
import PlainButton from '../../../../components/plain-button';
import Trash16 from '../../../../icon/line/Trash16';
import X16 from '../../../../icon/fill/X16';
import { ButtonType } from '../../../../components/button';
import { Menu, MenuItem } from '../../../../components/menu';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
import { COMMENT_STATUS_OPEN, COMMENT_STATUS_RESOLVED } from '../../../../constants';
import { bdlGray50 } from '../../../../styles/variables';
import messages from './messages';
import './AnnotationActivityMenu.scss';
const AnnotationActivityMenu = ({
  canDelete,
  canEdit,
  canResolve,
  className,
  id,
  isDisabled,
  onDelete,
  onEdit,
  onMenuClose,
  onMenuOpen,
  onStatusChange,
  status
}) => {
  const menuProps = {
    'data-resin-component': 'preview',
    'data-resin-feature': 'annotations'
  };
  const isResolved = status === COMMENT_STATUS_RESOLVED;
  return /*#__PURE__*/React.createElement(DropdownMenu, {
    constrainToScrollParent: true,
    isRightAligned: true,
    onMenuClose: onMenuClose,
    onMenuOpen: onMenuOpen
  }, /*#__PURE__*/React.createElement(PlainButton, {
    className: classNames('bcs-AnnotationActivityMenu', className),
    "data-testid": "annotation-activity-actions-menu",
    isDisabled: isDisabled,
    type: ButtonType.BUTTON
  }, /*#__PURE__*/React.createElement(IconEllipsis, {
    color: bdlGray50,
    height: 16,
    width: 16
  })), /*#__PURE__*/React.createElement(Menu, menuProps, canResolve && isResolved && /*#__PURE__*/React.createElement(MenuItem, {
    className: "bcs-AnnotationActivityMenu-unresolveAnnotation",
    "data-resin-itemid": id,
    "data-resin-target": ACTIVITY_TARGETS.ANNOTATION_OPTIONS_UNRESOLVE,
    "data-testid": "unresolve-annotation-activity",
    onClick: () => onStatusChange(COMMENT_STATUS_OPEN)
  }, /*#__PURE__*/React.createElement(X16, null), /*#__PURE__*/React.createElement(FormattedMessage, messages.annotationActivityUnresolveMenuItem)), canResolve && !isResolved && /*#__PURE__*/React.createElement(MenuItem, {
    "data-resin-itemid": id,
    "data-resin-target": ACTIVITY_TARGETS.ANNOTATION_OPTIONS_RESOLVE,
    "data-testid": "resolve-annotation-activity",
    onClick: () => onStatusChange(COMMENT_STATUS_RESOLVED)
  }, /*#__PURE__*/React.createElement(Checkmark16, null), /*#__PURE__*/React.createElement(FormattedMessage, messages.annotationActivityResolveMenuItem)), canEdit && /*#__PURE__*/React.createElement(MenuItem, {
    "data-resin-itemid": id,
    "data-resin-target": ACTIVITY_TARGETS.ANNOTATION_OPTIONS_EDIT,
    "data-testid": "edit-annotation-activity",
    onClick: onEdit
  }, /*#__PURE__*/React.createElement(Pencil16, null), /*#__PURE__*/React.createElement(FormattedMessage, messages.annotationActivityEditMenuItem)), canDelete && /*#__PURE__*/React.createElement(MenuItem, {
    "data-resin-itemid": id,
    "data-resin-target": ACTIVITY_TARGETS.ANNOTATION_OPTIONS_DELETE,
    "data-testid": "delete-annotation-activity",
    onClick: onDelete
  }, /*#__PURE__*/React.createElement(Trash16, null), /*#__PURE__*/React.createElement(FormattedMessage, messages.annotationActivityDeleteMenuItem))));
};
export default AnnotationActivityMenu;
//# sourceMappingURL=AnnotationActivityMenu.js.map