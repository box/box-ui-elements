function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { useArgs } from 'storybook/preview-api';
import { Button } from '@box/blueprint-web';
import { ACCESS_COLLAB, ACCESS_COMPANY, ACCESS_OPEN } from '../../../constants';
import { addRootElement } from '../../../utils/storybook';
import ShareDialog from '../ShareDialog';

// need to import this into the story because it's usually in ContentExplorer
import '../../common/modal.scss';
export const shareDialog = {
  render: args => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [, setArgs] = useArgs();
    const handleOpenModal = () => setArgs({
      isOpen: true
    });
    const handleCloseModal = () => setArgs({
      isOpen: false
    });
    const {
      appElement,
      rootElement
    } = addRootElement();
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(ShareDialog, _extends({
      appElement: appElement,
      item: {
        id: 'abcdefg',
        shared_link: {
          access: ACCESS_OPEN,
          url: 'https://cloud.box.com/s/abcdefg'
        }
      },
      onCancel: handleCloseModal,
      parentElement: rootElement
    }, args)), /*#__PURE__*/React.createElement(Button, {
      onClick: handleOpenModal,
      variant: "primary"
    }, "Launch ShareDialog"));
  }
};
export default {
  title: 'Elements/ContentExplorer',
  component: ShareDialog,
  args: {
    canSetShareAccess: true,
    isLoading: false,
    isOpen: false,
    item: {
      allowed_shared_link_access_levels: [ACCESS_COLLAB, ACCESS_COMPANY, ACCESS_OPEN],
      id: 'abcdefg',
      permissions: {
        can_set_share_access: true
      },
      shared_link: {
        access: ACCESS_OPEN,
        url: 'https://cloud.box.com/s/abcdefg'
      }
    }
  }
};
//# sourceMappingURL=ShareDialog.stories.js.map