import { defineMessages } from 'react-intl';

const messages = defineMessages({
    allowDownloadLabel: {
        defaultMessage: 'Allow users with the Shared Link to download this item',
        description: 'Label for option to enable downloads on a Shared Link',
        id: 'boxui.share.sharedLinkSettings.allowDownloadLabel',
    },
    allowDownloadTitle: {
        defaultMessage: 'Allow Download',
        description: 'Title for Allow Download section',
        id: 'boxui.share.sharedLinkSettings.allowDownloadTitle',
    },
    directLinkLabel: {
        defaultMessage: 'Direct Link',
        description: 'Title for Direct Link section',
        id: 'boxui.share.sharedLinkSettings.directLinkLabel',
    },
    inaccessibleSettingsNotice: {
        defaultMessage: 'Certain settings may not be available for this item due to permissions.',
        description:
            'Notice shown at top of modal when one or more settings are unavailable due to permission settings',
        id: 'boxui.share.sharedLinkSettings.inaccessibleSettingsNotice',
    },
    modalTitle: {
        defaultMessage: 'Shared Link Settings',
        description: 'Title for Shared Link Settings modal',
        id: 'boxui.share.sharedLinkSettings.modalTitle',
    },
    customURLLabel: {
        defaultMessage: 'Custom URL',
        description: 'Label for Custom URL text input field',
        id: 'boxui.share.sharedLinkSettings.customURLLabel',
    },
    expirationTitle: {
        defaultMessage: 'Link Expiration',
        description: 'Title for Link Expiration section',
        id: 'boxui.share.sharedLinkSettings.expirationTitle',
    },
    expirationLabel: {
        defaultMessage: 'Disable Shared Link on',
        description: 'Label for option to enable expiration on a Shared Link',
        id: 'boxui.share.sharedLinkSettings.expirationLabel',
    },
    passwordLabel: {
        defaultMessage: 'Require password',
        description: 'Label for checkbox to enable password on shared link',
        id: 'boxui.share.sharedLinkSettings.passwordLabel',
    },
    passwordPlaceholder: {
        defaultMessage: 'Enter a password',
        description: 'Placeholder for text input to enter a password',
        id: 'boxui.share.sharedLinkSettings.passwordPlaceholder',
    },
    passwordTitle: {
        defaultMessage: 'Password Protect',
        description: 'Title for section to add password to shared link',
        id: 'boxui.share.sharedLinkSettings.passwordTitle',
    },
    vanityNamePlaceholder: {
        defaultMessage: 'Enter a custom path',
        description: 'Placeholder for Custom URL text input field',
        id: 'boxui.share.sharedLinkSettings.vanityNamePlaceholder',
    },
    vanityNameNotSet: {
        defaultMessage: 'The custom URL has not been set',
        description: 'Text to show when a custom URL has not been set',
        id: 'boxui.share.sharedLinkSettings.vanityNameNotSet',
    },
});

export default messages;
