function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from 'react';
import { useIntl } from 'react-intl';
import noop from 'lodash/noop';
import { ActionCell, Cell, DropdownMenu, GridList, IconButton } from '@box/blueprint-web';
import { Ellipsis } from '@box/blueprint-web-assets/icons/Fill';
import Browser from '../../../utils/Browser';
import { PERMISSION_CAN_DELETE, PERMISSION_CAN_DOWNLOAD, PERMISSION_CAN_PREVIEW, PERMISSION_CAN_RENAME, PERMISSION_CAN_SHARE, TYPE_FILE, TYPE_WEBLINK, VIEW_MODE_GRID, VIEW_MODE_LIST } from '../../../constants';
import messages from '../messages';
const ItemOptions = ({
  canDelete = false,
  canDownload = false,
  canPreview = false,
  canRename = false,
  canShare = false,
  item,
  itemActions = [],
  onItemDelete = noop,
  onItemDownload = noop,
  onItemPreview = noop,
  onItemRename = noop,
  onItemShare = noop,
  portalElement,
  viewMode
}) => {
  const {
    permissions,
    type: itemType
  } = item;
  const {
    formatMessage
  } = useIntl();
  const isListView = viewMode === VIEW_MODE_LIST;
  const isGridView = viewMode === VIEW_MODE_GRID;
  if (!permissions) {
    return isListView ? /*#__PURE__*/React.createElement(Cell, null) : null;
  }
  const isDeleteEnabled = canDelete && permissions[PERMISSION_CAN_DELETE];
  const isDownloadEnabled = itemType === TYPE_FILE && canDownload && permissions[PERMISSION_CAN_DOWNLOAD] && Browser.canDownload();
  const isOpenEnabled = itemType === TYPE_WEBLINK;
  const isPreviewEnabled = itemType === TYPE_FILE && canPreview && permissions[PERMISSION_CAN_PREVIEW];
  const isRenameEnabled = canRename && permissions[PERMISSION_CAN_RENAME];
  const isShareEnabled = canShare && permissions[PERMISSION_CAN_SHARE];
  const actions = itemActions.reduce((validActions, action) => {
    const {
      filter: actionFilter,
      label: actionLabel,
      onAction,
      type: actionType
    } = action;
    if (actionType && actionType !== itemType) {
      return validActions;
    }
    if (actionFilter && !actionFilter(item)) {
      return validActions;
    }
    return [...validActions, /*#__PURE__*/React.createElement(DropdownMenu.Item, {
      key: actionLabel + actionType,
      onClick: () => onAction(item)
    }, actionLabel)];
  }, []);
  const hasActions = !!actions.length;
  const hasOptions = isDeleteEnabled || isDownloadEnabled || isOpenEnabled || isPreviewEnabled || isRenameEnabled || isShareEnabled;
  if (!hasActions && !hasOptions) {
    return isListView ? /*#__PURE__*/React.createElement(Cell, null) : null;
  }
  const iconButtonProps = {
    onPointerDown: event => {
      event.stopPropagation();
    },
    size: 'large'
  };
  const OptionsGroup = isGridView ? GridList.Actions : ActionCell;
  const OptionsTrigger = isGridView ? GridList.ActionIconButton : IconButton;
  const optionsTriggerProps = isGridView ? {} : iconButtonProps;
  const OptionsDropdownMenu = ({
    onOpenChange = noop
  }) => /*#__PURE__*/React.createElement(DropdownMenu.Root, {
    onOpenChange: onOpenChange
  }, /*#__PURE__*/React.createElement(DropdownMenu.Trigger, null, /*#__PURE__*/React.createElement(OptionsTrigger, _extends({
    "aria-label": formatMessage(messages.moreOptions),
    icon: Ellipsis
  }, optionsTriggerProps))), /*#__PURE__*/React.createElement(DropdownMenu.Content, {
    align: "end",
    container: portalElement
  }, isPreviewEnabled && /*#__PURE__*/React.createElement(DropdownMenu.Item, {
    onClick: () => onItemPreview(item)
  }, formatMessage(messages.preview)), isOpenEnabled && /*#__PURE__*/React.createElement(DropdownMenu.Item, {
    onClick: () => onItemPreview(item)
  }, formatMessage(messages.open)), isDeleteEnabled && /*#__PURE__*/React.createElement(DropdownMenu.Item, {
    onClick: () => onItemDelete(item)
  }, formatMessage(messages.delete)), isDownloadEnabled && /*#__PURE__*/React.createElement(DropdownMenu.Item, {
    onClick: () => onItemDownload(item)
  }, formatMessage(messages.download)), isRenameEnabled && /*#__PURE__*/React.createElement(DropdownMenu.Item, {
    onClick: () => onItemRename(item)
  }, formatMessage(messages.rename)), isShareEnabled && /*#__PURE__*/React.createElement(DropdownMenu.Item, {
    onClick: () => onItemShare(item)
  }, formatMessage(messages.share)), hasActions && hasOptions && /*#__PURE__*/React.createElement(DropdownMenu.Separator, null), hasActions && actions));

  // TODO: Update to one `return` statement after ContentPicker has been migrated to Blueprint
  if (viewMode) {
    return /*#__PURE__*/React.createElement(OptionsGroup, null, onOpenChange => /*#__PURE__*/React.createElement(OptionsDropdownMenu, {
      onOpenChange: onOpenChange
    }));
  }
  return /*#__PURE__*/React.createElement(OptionsDropdownMenu, null);
};
export default ItemOptions;
//# sourceMappingURL=ItemOptions.js.map