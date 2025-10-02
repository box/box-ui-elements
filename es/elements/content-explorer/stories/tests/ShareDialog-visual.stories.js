function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { ACCESS_COLLAB, ACCESS_COMPANY, ACCESS_OPEN } from '../../../../constants';
import { addRootElement } from '../../../../utils/storybook';
import ShareDialog from '../../ShareDialog';

// need to import this into the story because it's usually in ContentExplorer
import '../../../common/modal.scss';
const item = {
  id: 'abcdefg',
  shared_link: {
    access: ACCESS_OPEN,
    url: 'https://cloud.box.com/s/abcdefg'
  }
};
export const shareDialogNotLoading = {
  render: args => {
    const {
      appElement,
      rootElement
    } = addRootElement();
    return /*#__PURE__*/React.createElement(ShareDialog, _extends({
      appElement: appElement,
      isLoading: false,
      isOpen: true,
      item: item,
      parentElement: rootElement
    }, args));
  }
};
export const shareDialogIsLoading = {
  render: args => {
    const {
      appElement,
      rootElement
    } = addRootElement();
    return /*#__PURE__*/React.createElement(ShareDialog, _extends({
      appElement: appElement,
      isLoading: true,
      isOpen: true,
      item: item,
      parentElement: rootElement
    }, args));
  }
};
export const shareDialogShareAccessSelect = {
  render: args => {
    const {
      appElement,
      rootElement
    } = addRootElement();
    return /*#__PURE__*/React.createElement(ShareDialog, _extends({
      appElement: appElement,
      canSetShareAccess: true,
      isOpen: true,
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
      },
      parentElement: rootElement
    }, args));
  }
};
export default {
  title: 'Elements/ContentExplorer/tests/ShareDialog/visual',
  component: ShareDialog
};
//# sourceMappingURL=ShareDialog-visual.stories.js.map