// @flow
import { defineMessages } from 'react-intl';

const messages = defineMessages({
    securityControlsLabel: {
        defaultMessage: 'Restrictions',
        description:
            'Label displayed above the security restrictions on the file due to the classification label and associated policies.',
        id: 'boxui.securityControls.securityControlsLabel',
    },
    shortSharing: {
        defaultMessage: 'Sharing restriction applies',
        description: 'Short summary displayed for classification when a sharing restriction is applied to it',
        id: 'boxui.securityControls.shortSharing',
    },
    shortDownload: {
        defaultMessage: 'Download restrictions apply',
        description: 'Short summary displayed for classification when a download restriction is applied to it',
        id: 'boxui.securityControls.shortDownload',
    },
    shortApp: {
        defaultMessage: 'Application restrictions apply',
        description:
            'Short summary displayed for classification when an application download restriction is applied to it',
        id: 'boxui.securityControls.shortApp',
    },
    shortSharingDownload: {
        defaultMessage: 'Sharing and download restrictions apply',
        description:
            'Short summary displayed for classification when both sharing and download restrictions are applied to it',
        id: 'boxui.securityControls.shortSharingDownload',
    },
    shortSharingApp: {
        defaultMessage: 'Sharing and app restrictions apply',
        description:
            'Short summary displayed for classification when both sharing and app download restrictions are applied to it',
        id: 'boxui.securityControls.shortSharingApp',
    },
    shortDownloadApp: {
        defaultMessage: 'Download and app restrictions apply',
        description:
            'Short summary displayed for classification when both download and app download restrictions are applied to it',
        id: 'boxui.securityControls.shortDownloadApp',
    },
    shortAllRestrictions: {
        defaultMessage: 'Sharing, download and app restrictions apply',
        description:
            'Short summary displayed for classification when sharing, download and app download restrictions are applied to it',
        id: 'boxui.securityControls.shortAllRestrictions',
    },
    sharingCollabOnly: {
        defaultMessage: 'Shared links allowed for collaborators only.',
        description: 'Bullet point that summarizes shared link restriction applied to classification',
        id: 'boxui.securityControls.sharingCollabOnly',
    },
    sharingCollabAndCompanyOnly: {
        defaultMessage: 'Shared links cannot be made publicly accessible.',
        description: 'Bullet point that summarizes collaborators shared link restriction applied to classification',
        id: 'boxui.securityControls.sharingCollabAndCompanyOnly',
    },
    externalCollabBlock: {
        defaultMessage: 'External collaboration restricted.',
        description:
            'Bullet point that summarizes external collaboration blocked restriction applied to classification',
        id: 'boxui.securityControls.externalCollabBlock',
    },
    externalCollabDomainList: {
        defaultMessage: 'External collaboration limited to approved domains.',
        description: 'Bullet point that summarizes external collaboration restriction applied to classification',
        id: 'boxui.securityControls.externalCollabDomainList',
    },
    appDownloadBlock: {
        defaultMessage: 'Some application restrictions apply.',
        description: 'Bullet point that summarizes application download blocked restriction applied to classification',
        id: 'boxui.securityControls.appDownloadBlock',
    },
    appDownloadBlacklist: {
        defaultMessage: 'Download restricted for some applications: {appNames}',
        description: 'Bullet point that summarizes application download restriction applied to classification',
        id: 'boxui.securityControls.appDownloadBlacklist',
    },
    appDownloadBlacklistOverflow: {
        defaultMessage: 'Download restricted for some applications: {appNames} +{remainingAppCount} more',
        description:
            'Bullet point that summarizes application download restriction applied to classification. This variation is used when the list of applications is longer than the configured threshold',
        id: 'boxui.securityControls.appDownloadBlacklistOverflow',
    },
    appDownloadWhitelist: {
        defaultMessage: 'Only select applications are allowed: {appNames}',
        description: 'Bullet point that summarizes application download restriction applied to classification',
        id: 'boxui.securityControls.appDownloadWhitelist',
    },
    appDownloadWhitelistOverflow: {
        defaultMessage: 'Only select applications are allowed: {appNames} +{remainingAppCount} more',
        description:
            'Bullet point that summarizes application download restriction applied to classification. This variation is used when the list of applications is longer than the configured threshold',
        id: 'boxui.securityControls.appDownloadWhitelistOverflow',
    },
    allAppNames: {
        defaultMessage: 'All applications: {appsList}',
        description: 'Name list of all applications download restriction applied to classification',
        id: 'boxui.securityControls.allAppNames',
    },
    // Web Download Restrictions
    webDownloadOwners: {
        defaultMessage: 'Download restricted on web, except Owners/Co-Owners.',
        description:
            'Bullet point that summarizes web download restrictions applied to classification, when restriction applies to managed users except Owners/Co-Owners',
        id: 'boxui.securityControls.webDownloadOwners',
    },
    webDownloadOwnersEditors: {
        defaultMessage: 'Download restricted on web, except Owners/Co-Owners/Editors.',
        description:
            'Bullet point that summarizes web download restrictions applied to classification, when restriction applies to managed users except Owners/Co-Owners/Editors',
        id: 'boxui.securityControls.webDownloadOwnersEditors',
    },
    webDownloadExternalOwners: {
        defaultMessage: 'Download restricted on web, except Owners/Co-Owners. Also restricted for external users.',
        description:
            'Bullet point that summarizes web download restrictions applied to classification, when restriction applies to external users and managed users except Owners/Co-Owners',
        id: 'boxui.securityControls.webDownloadExternalOwners',
    },
    webDownloadExternalOwnersEditors: {
        defaultMessage:
            'Download restricted on web, except Owners/Co-Owners/Editors. Also restricted for external users.',
        description:
            'Bullet point that summarizes web download restrictions applied to classification, when restriction applies to external users and managed users except Owners/Co-Owners/Editors',
        id: 'boxui.securityControls.webDownloadExternalOwnersEditors',
    },
    webDownloadExternal: {
        defaultMessage: 'Download restricted on web for external users.',
        description:
            'Bullet point that summarizes web download restrictions applied to classification, when restriction applies to external users',
        id: 'boxui.securityControls.webDownloadExternal',
    },
    // Mobile Download Restrictions
    mobileDownloadOwners: {
        defaultMessage: 'Download restricted on mobile, except Owners/Co-Owners.',
        description:
            'Bullet point that summarizes mobile download restrictions applied to classification, when restriction applies to managed users except Owners/Co-Owners',
        id: 'boxui.securityControls.mobileDownloadOwners',
    },
    mobileDownloadOwnersEditors: {
        defaultMessage: 'Download restricted on mobile, except Owners/Co-Owners/Editors.',
        description:
            'Bullet point that summarizes mobile download restrictions applied to classification, when restriction applies to managed users except Owners/Co-Owners/Editors',
        id: 'boxui.securityControls.mobileDownloadOwnersEditors',
    },
    mobileDownloadExternalOwners: {
        defaultMessage: 'Download restricted on mobile, except Owners/Co-Owners. Also restricted for external users.',
        description:
            'Bullet point that summarizes mobile download restrictions applied to classification, when restriction applies to external users and managed users except Owners/Co-Owners',
        id: 'boxui.securityControls.mobileDownloadExternalOwners',
    },
    mobileDownloadExternalOwnersEditors: {
        defaultMessage:
            'Download restricted on mobile, except Owners/Co-Owners/Editors. Also restricted for external users.',
        description:
            'Bullet point that summarizes mobile download restrictions applied to classification, when restriction applies to external users and managed users except Owners/Co-Owners/Editors',
        id: 'boxui.securityControls.mobileDownloadExternalOwnersEditors',
    },
    mobileDownloadExternal: {
        defaultMessage: 'Download restricted on mobile for external users.',
        description:
            'Bullet point that summarizes mobile download restrictions applied to classification, when restriction applies to external users',
        id: 'boxui.securityControls.mobileDownloadExternal',
    },
    // Desktop Download Restrictions
    desktopDownloadOwners: {
        defaultMessage: 'Download restricted on Box Drive, except Owners/Co-Owners.',
        description:
            'Bullet point that summarizes desktop download restrictions applied to classification, when restriction applies to managed users except Owners/Co-Owners. Box Drive is a product name and not translated',
        id: 'boxui.securityControls.desktopDownloadOwners',
    },
    desktopDownloadOwnersEditors: {
        defaultMessage: 'Download restricted on Box Drive, except Owners/Co-Owners/Editors.',
        description:
            'Bullet point that summarizes desktop download restrictions applied to classification, when restriction applies to managed users except Owners/Co-Owners/Editors. Box Drive is a product name and not translated',
        id: 'boxui.securityControls.desktopDownloadOwnersEditors',
    },
    desktopDownloadExternalOwners: {
        defaultMessage:
            'Download restricted on Box Drive, except Owners/Co-Owners. Also restricted for external users.',
        description:
            'Bullet point that summarizes desktop download restrictions applied to classification, when restriction applies to external users and managed users except Owners/Co-Owners. Box Drive is a product name and not translated',
        id: 'boxui.securityControls.desktopDownloadExternalOwners',
    },
    desktopDownloadExternalOwnersEditors: {
        defaultMessage:
            'Download restricted on Box Drive, except Owners/Co-Owners/Editors. Also restricted for external users.',
        description:
            'Bullet point that summarizes desktop download restrictions applied to classification, when restriction applies to external users and managed users except Owners/Co-Owners/Editors. Box Drive is a product name and not translated',
        id: 'boxui.securityControls.desktopDownloadExternalOwnersEditors',
    },
    desktopDownloadExternal: {
        defaultMessage: 'Download restricted on Box Drive for external users.',
        description:
            'Bullet point that summarizes desktop download restrictions applied to classification, when restriction applies to external users. Box Drive is a product name and not translated',
        id: 'boxui.securityControls.downloadExternal',
    },
    // Security Constrols Modal
    viewAll: {
        defaultMessage: 'View All',
        description: 'Button to display security controls modal',
        id: 'boxui.securityControls.viewAll',
    },
    modalTitle: {
        defaultMessage: "View Classification for '{itemName}'",
        description: 'Title for modal to display classification and security controls details',
        id: 'boxui.securityControls.modalTitle',
    },
    modalDescription: {
        defaultMessage:
            'Classification labels defined by your administrator can be used to label content and apply security policies.',
        description: 'Description for modal to display classification and security controls details',
        id: 'boxui.securityControls.modalDescription',
    },
});

export default messages;
