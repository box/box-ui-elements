function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { useArgs } from 'storybook/preview-api';
import { Button } from '@box/blueprint-web';
import { addRootElement } from '../../../utils/storybook';
import DeleteConfirmationDialog from '../DeleteConfirmationDialog';
export const deleteDialog = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(DeleteConfirmationDialog, _extends({
      appElement: appElement,
      item: {
        id: '123456',
        name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eget nulla facilisi etiam dignissim diam quis enim lobortis scelerisque. Aliquam faucibus purus in massa tempor nec. Ut consequat semper viverra nam libero justo laoreet sit amet. Purus gravida quis blandit turpis cursus in hac. Dui ut ornare lectus sit amet est. Nisl condimentum id venenatis a condimentum vitae sapien.'
      },
      onCancel: handleCloseModal,
      parentElement: rootElement
    }, args)), /*#__PURE__*/React.createElement(Button, {
      onClick: handleOpenModal,
      variant: "primary"
    }, "Launch DeleteConfirmationDialog"));
  }
};
export default {
  title: 'Elements/ContentExplorer',
  component: DeleteConfirmationDialog,
  args: {
    isLoading: false,
    isOpen: false
  }
};
//# sourceMappingURL=DeleteConfirmationDialog.stories.js.map