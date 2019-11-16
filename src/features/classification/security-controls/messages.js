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
    shortApplication: {
        defaultMessage: 'Application restrictions apply',
        description: 'TODO',
        id: 'boxui.securityControls.shortApplication',
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
        defaultMessage: 'Sharing, download and app and app and app and restrictions apply',
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
    downloadOwners: {
        defaultMessage: 'Download restricted on {platform}, except Owners/Co-Owners.',
        description: 'TODO',
        id: 'boxui.securityControls.downloadOwners',
    },
    downloadOwnersEditors: {
        defaultMessage: 'Download restricted on {platform}, except Owners/Co-Owners/Editors.',
        description: 'TODO',
        id: 'boxui.securityControls.downloadOwnersEditors',
    },
    downloadExternal: {
        defaultMessage: 'Download restricted on {platform} for external users.',
        description: 'TODO',
        id: 'boxui.securityControls.downloadExternal',
    },
    downloadExternalOwners: {
        defaultMessage: 'Download restricted on {platform} for external users, except Owners/Co-Owners.',
        description: 'TODO',
        id: 'boxui.securityControls.downloadExternalOwners',
    },
    downloadExternalOwnersEditors: {
        defaultMessage: 'Download restricted on {platform} for external users, except Owners/Co-Owners/Editors.',
        description: 'TODO',
        id: 'boxui.securityControls.downloadExternalOwnersEditors',
    },
});

export default messages;
