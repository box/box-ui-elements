// @flow
import { defineMessages } from 'react-intl';

const messages = defineMessages({
    shortSharing: {
        defaultMessage: 'Sharing restriction applies',
        description: 'TODO',
        id: 'boxui.securityControls.shortSharing',
    },
    shortDownload: {
        defaultMessage: 'Download restrictions apply',
        description: 'TODO',
        id: 'boxui.securityControls.shortDownload',
    },
    shortApp: {
        defaultMessage: 'Application restrictions apply',
        description: 'TODO',
        id: 'boxui.securityControls.shortApp',
    },
    shortSharingDownload: {
        defaultMessage: 'Sharing and download restrictions apply',
        description: 'TODO',
        id: 'boxui.securityControls.shortSharingDownload',
    },
    shortSharingApp: {
        defaultMessage: 'Sharing and app restrictions apply',
        description: 'TODO',
        id: 'boxui.securityControls.shortSharingApp',
    },
    shortDownloadApp: {
        defaultMessage: 'Download and app restrictions apply',
        description: 'TODO',
        id: 'boxui.securityControls.shortDownloadApp',
    },
    shortAllRestrictions: {
        defaultMessage: 'Sharing, download and app and restrictions apply',
        description: 'TODO',
        id: 'boxui.securityControls.shortAllRestrictions',
    },
    sharingCollabOnly: {
        defaultMessage: 'Shared links cannot be made publicly accessible.',
        description: 'TODO',
        id: 'boxui.securityControls.sharingCollabOnly',
    },
    sharingCollabAndCompanyOnly: {
        defaultMessage: 'Shared links allowed for collaborators only.',
        description: 'TODO',
        id: 'boxui.securityControls.sharingCollabAndCompanyOnly',
    },
    externalCollabBlock: {
        defaultMessage: 'External collaboration restricted.',
        description: 'TODO',
        id: 'boxui.securityControls.externalCollabBlock',
    },
    externalCollabDomainList: {
        defaultMessage: 'External collaboration limited to approved domains.',
        description: 'TODO',
        id: 'boxui.securityControls.externalCollabDomainList',
    },
    appDownloadBlock: {
        defaultMessage: 'Some application restrictions apply.',
        description: 'TODO',
        id: 'boxui.securityControls.appDownloadBlock',
    },
    appDownloadList: {
        defaultMessage: 'Some applications will be restricted; {appNames}',
        description: 'TODO',
        id: 'boxui.securityControls.appDownloadList',
    },
    appDownloadListOverflow: {
        defaultMessage: 'Only select applications are allowed; {appNames} +{remainingAppCount} more',
        description: 'TODO',
        id: 'boxui.securityControls.appDownloadListOverflow',
    },
    // Web Download Restrictions
    webDownloadOwners: {
        defaultMessage: 'Download restricted on {platform}, except Owners/Co-Owners.',
        description: 'TODO',
        id: 'boxui.securityControls.webDownloadOwners',
    },
    webDownloadOwnersEditors: {
        defaultMessage: 'Download restricted on {platform}, except Owners/Co-Owners/Editors.',
        description: 'TODO',
        id: 'boxui.securityControls.webDownloadOwnersEditors',
    },
    webDownloadExternalOwners: {
        defaultMessage: 'Download restricted on web for external users, except Owners/Co-Owners.',
        description: 'TODO',
        id: 'boxui.securityControls.webDownloadExternalOwners',
    },
    webDownloadExternalOwnersEditors: {
        defaultMessage: 'Download restricted on web for external users, except Owners/Co-Owners/Editors.',
        description: 'TODO',
        id: 'boxui.securityControls.webDownloadExternalOwnersEditors',
    },
    webDownloadExternal: {
        defaultMessage: 'Download restricted on Box Desktop for external users.',
        description: 'TODO',
        id: 'boxui.securityControls.webDownloadExternal',
    },
    // Mobile Download Restrictions
    mobileDownloadOwners: {
        defaultMessage: 'Download restricted on mobile, except Owners/Co-Owners.',
        description: 'TODO',
        id: 'boxui.securityControls.mobileDownloadOwners',
    },
    mobileDownloadOwnersEditors: {
        defaultMessage: 'Download restricted on mobile, except Owners/Co-Owners/Editors.',
        description: 'TODO',
        id: 'boxui.securityControls.mobileDownloadOwnersEditors',
    },
    mobileDownloadExternalOwners: {
        defaultMessage: 'Download restricted on mobile for external users, except Owners/Co-Owners.',
        description: 'TODO',
        id: 'boxui.securityControls.mobileDownloadExternalOwners',
    },
    mobileDownloadExternalOwnersEditors: {
        defaultMessage: 'Download restricted on mobile for external users, except Owners/Co-Owners/Editors.',
        description: 'TODO',
        id: 'boxui.securityControls.mobileDownloadExternalOwnersEditors',
    },
    mobileDownloadExternal: {
        defaultMessage: 'Download restricted on Box Desktop for external users.',
        description: 'TODO',
        id: 'boxui.securityControls.mobileDownloadExternal',
    },
    // Desktop Download Restrictions
    desktopDownloadOwners: {
        defaultMessage: 'Download restricted on Box Drive, except Owners/Co-Owners.',
        description: 'TODO',
        id: 'boxui.securityControls.desktopDownloadOwners',
    },
    desktopDownloadOwnersEditors: {
        defaultMessage: 'Download restricted on Box Drive, except Owners/Co-Owners/Editors.',
        description: 'TODO',
        id: 'boxui.securityControls.desktopDownloadOwnersEditors',
    },
    desktopDownloadExternalOwners: {
        defaultMessage: 'Download restricted on Box Drive for external users, except Owners/Co-Owners.',
        description: 'TODO',
        id: 'boxui.securityControls.desktopDownloadExternalOwners',
    },
    desktopDownloadExternalOwnersEditors: {
        defaultMessage: 'Download restricted on Box Drive for external users, except Owners/Co-Owners/Editors.',
        description: 'TODO',
        id: 'boxui.securityControls.desktopDownloadExternalOwnersEditors',
    },
    desktopDownloadExternal: {
        defaultMessage: 'Download restricted on Box Drive for external users.',
        description: 'TODO',
        id: 'boxui.securityControls.downloadExternal',
    },
});

export default messages;
