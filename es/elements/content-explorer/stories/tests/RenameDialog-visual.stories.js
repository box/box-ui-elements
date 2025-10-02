function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { addRootElement } from '../../../../utils/storybook';
import RenameDialog from '../../RenameDialog';
import { ERROR_CODE_ITEM_NAME_IN_USE, ERROR_CODE_ITEM_NAME_INVALID, ERROR_CODE_ITEM_NAME_TOO_LONG } from '../../../../constants';
import '../../../common/modal.scss';
const item = {
  id: '123456',
  name: 'mockItem'
};
const itemWithLongName = {
  id: '123456',
  name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eget nulla facilisi etiam dignissim diam quis enim lobortis scelerisque. Aliquam faucibus purus in massa tempor nec. Ut consequat semper viverra nam libero justo laoreet sit amet. Purus gravida quis blandit turpis cursus in hac. Dui ut ornare lectus sit amet est. Nisl condimentum id venenatis a condimentum vitae sapien '
};
export const renameDialogNotLoading = {
  render: args => {
    const {
      appElement,
      rootElement
    } = addRootElement();
    return /*#__PURE__*/React.createElement(RenameDialog, _extends({
      appElement: appElement,
      isLoading: false,
      isOpen: true,
      item: item,
      parentElement: rootElement
    }, args));
  }
};
export const renameDialogIsLoading = {
  render: args => {
    const {
      appElement,
      rootElement
    } = addRootElement();
    return /*#__PURE__*/React.createElement(RenameDialog, _extends({
      appElement: appElement,
      isLoading: true,
      isOpen: true,
      item: item,
      parentElement: rootElement
    }, args));
  }
};
export const renameDialogNameInvalidError = {
  render: args => {
    const {
      appElement,
      rootElement
    } = addRootElement();
    return /*#__PURE__*/React.createElement(RenameDialog, _extends({
      appElement: appElement,
      errorCode: ERROR_CODE_ITEM_NAME_INVALID,
      isLoading: false,
      isOpen: true,
      item: item,
      parentElement: rootElement
    }, args));
  }
};
export const renameDialogNameInUseError = {
  render: args => {
    const {
      appElement,
      rootElement
    } = addRootElement();
    return /*#__PURE__*/React.createElement(RenameDialog, _extends({
      appElement: appElement,
      errorCode: ERROR_CODE_ITEM_NAME_IN_USE,
      isLoading: false,
      isOpen: true,
      item: item,
      parentElement: rootElement
    }, args));
  }
};
export const renameDialogNameTooLongError = {
  render: args => {
    const {
      appElement,
      rootElement
    } = addRootElement();
    return /*#__PURE__*/React.createElement(RenameDialog, _extends({
      appElement: appElement,
      errorCode: ERROR_CODE_ITEM_NAME_TOO_LONG,
      isLoading: false,
      isOpen: true,
      item: itemWithLongName,
      parentElement: rootElement
    }, args));
  }
};
export default {
  title: 'Elements/ContentExplorer/tests/RenameDialog/visual',
  component: RenameDialog
};
//# sourceMappingURL=RenameDialog-visual.stories.js.map