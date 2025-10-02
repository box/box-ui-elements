function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { useArgs } from 'storybook/preview-api';
import { Button } from '@box/blueprint-web';
import { addRootElement } from '../../../utils/storybook';
import RenameDialog from '../RenameDialog';
export const renameDialog = {
  render: args => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [, setArgs] = useArgs();
    const handleOpenModal = () => setArgs({
      isOpen: true
    });
    const handleCloseModal = () => {
      setArgs({
        isOpen: false
      });
    };
    const {
      appElement,
      rootElement
    } = addRootElement();
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(RenameDialog, _extends({
      appElement: appElement,
      item: {
        id: '123456',
        name: 'mockItem'
      },
      onCancel: handleCloseModal,
      parentElement: rootElement
    }, args)), /*#__PURE__*/React.createElement(Button, {
      onClick: handleOpenModal,
      variant: "primary"
    }, "Launch RenameDialog"));
  }
};
export default {
  title: 'Elements/ContentExplorer',
  component: RenameDialog,
  args: {
    isLoading: false,
    isOpen: false
  }
};
//# sourceMappingURL=RenameDialog.stories.js.map