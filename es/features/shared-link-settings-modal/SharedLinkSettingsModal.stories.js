/* eslint-disable react-hooks/rules-of-hooks */
import * as React from 'react';
import Button from '../../components/button/Button';
import SharedLinkSettingsModal from './SharedLinkSettingsModal';
import notes from './SharedLinkSettingsModal.stories.md';
export const basic = () => {
  const [isOpen, setIsOpen] = React.useState(false);
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
  return /*#__PURE__*/React.createElement("div", null, isOpen && /*#__PURE__*/React.createElement(SharedLinkSettingsModal, {
    accessLevel: "peopleWithTheLink",
    canChangeVanityName: true,
    item: {
      bannerPolicy: {
        body: 'test'
      },
      classification: 'internal',
      grantedPermissions: {
        itemShare: true
      },
      hideCollaborators: false,
      id: 12345,
      name: 'My Example Folder',
      type: 'folder',
      typedID: 'd_12345'
    },
    isOpen: true,
    onRequestClose: () => setIsOpen(false),
    onSubmit: fakeRequest,
    serverURL: "https://box.com/v/",
    submitting: submitting,
    vanityName: "vanity",
    canChangePassword: true,
    isPasswordAvailable: true,
    isPasswordEnabled: false,
    canChangeExpiration: true,
    isDownloadAvailable: true,
    canChangeDownload: true,
    isDownloadEnabled: false,
    directLink: "https://box.com/download/path",
    isDirectLinkAvailable: true,
    isDirectLinkUnavailableDueToDownloadSettings: false,
    isDirectLinkUnavailableDueToAccessPolicy: true,
    vanityNameInputProps: {
      'data-resin-target': 'test'
    },
    passwordCheckboxProps: {
      'data-resin-target': 'test'
    },
    passwordInputProps: {
      'data-resin-target': 'test'
    },
    expirationCheckboxProps: {
      'data-resin-target': 'test'
    },
    expirationInputProps: {
      'data-resin-target': 'test'
    },
    downloadCheckboxProps: {
      'data-resin-target': 'test'
    },
    directLinkInputProps: {
      'data-resin-target': 'test'
    },
    saveButtonProps: {
      'data-resin-target': 'test'
    },
    cancelButtonProps: {
      'data-resin-target': 'test'
    },
    modalProps: {
      'data-resin-feature': 'test'
    },
    warnOnPublic: false
  }), /*#__PURE__*/React.createElement(Button, {
    onClick: () => setIsOpen(true)
  }, "Shared Link Settings Modal"));
};
export default {
  title: 'Features/SharedLinkSettingsModal',
  component: SharedLinkSettingsModal,
  parameters: {
    notes
  }
};
//# sourceMappingURL=SharedLinkSettingsModal.stories.js.map