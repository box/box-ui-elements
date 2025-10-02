/* eslint-disable react-hooks/rules-of-hooks */
import * as React from 'react';
import Button from '../../../components/button/Button';
import Flyout from '../../../components/flyout/Flyout';
import Overlay from '../../../components/flyout/Overlay';
import SharedLink from '../SharedLink';
import notes from './SharedLink.stories.md';
export const basic = () => {
  const [accessLevel, setAccessLevel] = React.useState('peopleInYourCompany');
  const [submitting, setSubmitting] = React.useState(false);
  const fakeRequest = () => {
    setSubmitting(true);
    return new Promise(resolve => {
      setTimeout(() => {
        setSubmitting(false);
        resolve();
      }, 500);
    });
  };
  return /*#__PURE__*/React.createElement(Flyout, {
    className: "shared-link-flyout",
    closeOnClick: false,
    constrainToScrollParent: false,
    constrainToWindow: true,
    portaledClasses: ['modal', 'share-access-menu'],
    position: "bottom-right"
  }, /*#__PURE__*/React.createElement(Button, null, "Shared Link Flyout"), /*#__PURE__*/React.createElement(Overlay, {
    style: {
      width: '300px'
    }
  }, /*#__PURE__*/React.createElement(SharedLink, {
    accessDropdownMenuProps: {
      constrainToWindow: true
    },
    accessLevel: accessLevel,
    accessMenuButtonProps: {
      'data-resin-target': 'changepermissions'
    },
    allowedAccessLevels: {
      peopleWithTheLink: true,
      peopleInYourCompany: true,
      peopleInThisItem: true
    },
    canRemoveLink: true,
    changeAccessLevel: newLevel => fakeRequest().then(() => setAccessLevel(newLevel)),
    copyButtonProps: {
      'data-resin-target': 'copy'
    },
    enterpriseName: "Box",
    isDownloadAllowed: true,
    isEditAllowed: true,
    isPreviewAllowed: true,
    itemType: "folder",
    onSettingsClick: () => null,
    removeLink: fakeRequest,
    removeLinkButtonProps: {
      'data-resin-target': 'remove'
    },
    settingsButtonProps: {
      'data-resin-target': 'settings'
    },
    sharedLink: "http://box.com/s/abcdefg",
    submitting: submitting
  })));
};
export default {
  title: 'Features/SharedLink',
  component: SharedLink,
  parameters: {
    notes
  }
};
//# sourceMappingURL=SharedLink.stories.js.map