// @flow
import { defineMessages } from 'react-intl';

const messages = defineMessages({
    securityControlsLabel: {
        defaultMessage: 'Restrictions',
        description:
            'Label displayed above the security restrictions on the file due to the classification label and associated policies.',
        id: 'boxui.securityControls.securityControlsLabel',
    },
    // Short summary messages - 1 restriction
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
    shortIntegration: {
        defaultMessage: 'Integration restrictions apply',
        description:
            'Short summary displayed for classification when an integration download restriction is applied to it',
        id: 'boxui.securityControls.shortIntegration',
    },
    shortWatermarking: {
        defaultMessage: 'Watermarking applies',
        description: 'Short summary displayed for classification when watermarking is applied to it',
        id: 'boxui.securityControls.shortWatermarking',
    },
    shortSign: {
        defaultMessage: 'Sign restrictions apply',
        description:
            'Short summary displayed for items when Sign restriction is applied to them. Box Sign is a product name',
        id: 'boxui.securityControls.shortSign',
    },
    shortAutoExpiration: {
        defaultMessage: 'Sharing Auto-Expiration restriction applies',
        description:
            'Short summary displayed for items when Shared Link Auto-Expiration restriction is applied to them.',
        id: 'boxui.securityControls.shortAutoExpiration',
    },
    // Short summary messages - 2 restrictions
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
    shortSharingIntegration: {
        defaultMessage: 'Sharing and integration restrictions apply',
        description:
            'Short summary displayed for classification when both sharing and integration download restrictions are applied to it',
        id: 'boxui.securityControls.shortSharingIntegration',
    },
    shortDownloadApp: {
        defaultMessage: 'Download and app restrictions apply',
        description:
            'Short summary displayed for classification when both download and app download restrictions are applied to it',
        id: 'boxui.securityControls.shortDownloadApp',
    },
    shortDownloadIntegration: {
        defaultMessage: 'Download and integration restrictions apply',
        description:
            'Short summary displayed for classification when both download and integration download restrictions are applied to it',
        id: 'boxui.securityControls.shortDownloadIntegration',
    },
    shortSharingSign: {
        defaultMessage: 'Sharing and Sign restrictions apply',
        description:
            'Short summary displayed for items when both sharing and Sign restrictions are applied to them. Box Sign is a product name',
        id: 'boxui.securityControls.shortSharingSign',
    },
    shortDownloadSign: {
        defaultMessage: 'Download and Sign restrictions apply',
        description:
            'Short summary displayed for items when both download and Sign restrictions are applied to them. Box Sign is a product name',
        id: 'boxui.securityControls.shortDownloadSign',
    },
    shortAppSign: {
        defaultMessage: 'App and Sign restrictions apply',
        description:
            'Short summary displayed for items when both app download and Sign restrictions are applied to them. Box Sign is a product name',
        id: 'boxui.securityControls.shortAppSign',
    },
    shortIntegrationSign: {
        defaultMessage: 'Integration and Sign restrictions apply',
        description:
            'Short summary displayed for items when both integration download and Sign restrictions are applied to them. Box Sign is a product name',
        id: 'boxui.securityControls.shortIntegrationSign',
    },
    shortSharingAutoExpiration: {
        defaultMessage: 'Sharing and sharing Auto-Expiration restrictions apply',
        description:
            'Short summary displayed for items when both sharing and sharing Auto-Expiration restrictions are applied to them.',
        id: 'boxui.securityControls.shortSharingAutoExpiration',
    },
    shortDownloadAutoExpiration: {
        defaultMessage: 'Download and sharing Auto-Expiration restrictions apply',
        description:
            'Short summary displayed for items when both download and sharing Auto-Expiration restrictions are applied to them.',
        id: 'boxui.securityControls.shortDownloadAutoExpiration',
    },
    shortAppAutoExpiration: {
        defaultMessage: 'App and sharing Auto-Expiration restrictions apply',
        description:
            'Short summary displayed for items when both app and sharing Auto-Expiration restrictions are applied to them.',
        id: 'boxui.securityControls.shortAppAutoExpiration',
    },
    shortIntegrationAutoExpiration: {
        defaultMessage: 'Integration and sharing Auto-Expiration restrictions apply',
        description:
            'Short summary displayed for items when both integration and sharing Auto-Expiration restrictions are applied to them.',
        id: 'boxui.securityControls.shortIntegrationAutoExpiration',
    },
    shortSignAutoExpiration: {
        defaultMessage: 'Sign and sharing Auto-Expiration restrictions apply',
        description:
            'Short summary displayed for items when both Sign and sharing Auto-Expiration restrictions are applied to them. Box Sign is a product name',
        id: 'boxui.securityControls.shortSignAutoExpiration',
    },
    // Short summary messages - 3 restrictions
    shortDownloadAppSign: {
        defaultMessage: 'Download, app and Sign restrictions apply',
        description:
            'Short summary displayed for items when download, app download and Sign restrictions are applied to them. Box Sign is a product name',
        id: 'boxui.securityControls.shortDownloadAppSign',
    },
    shortDownloadIntegrationSign: {
        defaultMessage: 'Download, integration and Sign restrictions apply',
        description:
            'Short summary displayed for items when download, integration download and Sign restrictions are applied to them. Box Sign is a product name',
        id: 'boxui.securityControls.shortDownloadIntegrationSign',
    },
    shortSharingAppSign: {
        defaultMessage: 'Sharing, app and Sign restrictions apply',
        description:
            'Short summary displayed for items when sharing, app download and Sign restrictions are applied to them. Box Sign is a product name',
        id: 'boxui.securityControls.shortSharingAppSign',
    },
    shortSharingIntegrationSign: {
        defaultMessage: 'Sharing, integration and Sign restrictions apply',
        description:
            'Short summary displayed for items when sharing, integration download and Sign restrictions are applied to them. Box Sign is a product name',
        id: 'boxui.securityControls.shortSharingIntegrationSign',
    },
    shortSharingDownloadSign: {
        defaultMessage: 'Sharing, download and Sign restrictions apply',
        description:
            'Short summary displayed for items when sharing, download and Sign restrictions are applied to them. Box Sign is a product name',
        id: 'boxui.securityControls.shortSharingDownloadSign',
    },
    shortSharingDownloadApp: {
        defaultMessage: 'Sharing, download and app restrictions apply',
        description:
            'Short summary displayed for items when sharing, download and app download restrictions are applied to them.',
        id: 'boxui.securityControls.shortSharingDownloadApp',
    },
    shortSharingDownloadIntegration: {
        defaultMessage: 'Sharing, download and integration restrictions apply',
        description:
            'Short summary displayed for items when sharing, download and integration download restrictions are applied to them.',
        id: 'boxui.securityControls.shortSharingDownloadIntegration',
    },
    shortSharingDownloadAutoExpiration: {
        defaultMessage: 'Sharing, download and sharing Auto-Expiration restrictions apply',
        description:
            'Short summary displayed for items when sharing, download and sharing Auto-Expiration restrictions are applied to them.',
        id: 'boxui.securityControls.shortSharingDownloadAutoExpiration',
    },
    shortSharingAppAutoExpiration: {
        defaultMessage: 'Sharing, app and sharing Auto-Expiration restrictions apply',
        description:
            'Short summary displayed for items when sharing, app and sharing Auto-Expiration restrictions are applied to them.',
        id: 'boxui.securityControls.shortSharingAppAutoExpiration',
    },
    shortSharingIntegrationAutoExpiration: {
        defaultMessage: 'Sharing, integration and sharing Auto-Expiration restrictions apply',
        description:
            'Short summary displayed for items when sharing, integration and sharing Auto-Expiration restrictions are applied to them.',
        id: 'boxui.securityControls.shortSharingIntegrationAutoExpiration',
    },
    shortSharingSignAutoExpiration: {
        defaultMessage: 'Sharing, Sign and sharing Auto-Expiration restrictions apply',
        description:
            'Short summary displayed for items when sharing, Sign and sharing Auto-Expiration restrictions are applied to them. Box Sign is a product name',
        id: 'boxui.securityControls.shortSharingSignAutoExpiration',
    },
    shortDownloadAppAutoExpiration: {
        defaultMessage: 'Download, app and sharing Auto-Expiration restrictions apply',
        description:
            'Short summary displayed for items when download, app and sharing Auto-Expiration restrictions are applied to them.',
        id: 'boxui.securityControls.shortDownloadAppAutoExpiration',
    },
    shortDownloadIntegrationAutoExpiration: {
        defaultMessage: 'Download, integration and sharing Auto-Expiration restrictions apply',
        description:
            'Short summary displayed for items when download, integration and sharing Auto-Expiration restrictions are applied to them.',
        id: 'boxui.securityControls.shortDownloadIntegrationAutoExpiration',
    },
    shortDownloadSignAutoExpiration: {
        defaultMessage: 'Download, Sign and sharing Auto-Expiration restrictions apply',
        description:
            'Short summary displayed for items when download, Sign and sharing Auto-Expiration restrictions are applied to them. Box Sign is a product name',
        id: 'boxui.securityControls.shortDownloadSignAutoExpiration',
    },
    shortAppSignAutoExpiration: {
        defaultMessage: 'App, Sign and sharing Auto-Expiration restrictions apply',
        description:
            'Short summary displayed for items when app, Sign and sharing Auto-Expiration restrictions are applied to them. Box Sign is a product name',
        id: 'boxui.securityControls.shortAppSignAutoExpiration',
    },
    shortIntegrationSignAutoExpiration: {
        defaultMessage: 'Integration, Sign and sharing Auto-Expiration restrictions apply',
        description:
            'Short summary displayed for items when integration, Sign and sharing Auto-Expiration restrictions are applied to them. Box Sign is a product name',
        id: 'boxui.securityControls.shortIntegrationSignAutoExpiration',
    },
    // Short summary messages - 4 restrictions
    shortSharingDownloadAppSign: {
        defaultMessage: 'Sharing, download, app and Sign restrictions apply',
        description:
            'Short summary displayed for items when sharing, download, app download and Sign restrictions are applied to them. Box Sign is a product name',
        id: 'boxui.securityControls.shortSharingDownloadAppSign',
    },
    shortSharingDownloadIntegrationSign: {
        defaultMessage: 'Sharing, download, integration and Sign restrictions apply',
        description:
            'Short summary displayed for items when sharing, download, integration download and Sign restrictions are applied to them. Box Sign is a product name',
        id: 'boxui.securityControls.shortSharingDownloadIntegrationSign',
    },
    shortSharingDownloadAppAutoExpiration: {
        defaultMessage: 'Sharing, download, app and sharing Auto-Expiration restrictions apply',
        description:
            'Short summary displayed for items when sharing, download, app and sharing Auto-Expiration restrictions are applied to them.',
        id: 'boxui.securityControls.shortSharingDownloadAppAutoExpiration',
    },
    shortSharingDownloadIntegrationAutoExpiration: {
        defaultMessage: 'Sharing, download, integration and sharing Auto-Expiration restrictions apply',
        description:
            'Short summary displayed for items when sharing, download, integration and sharing Auto-Expiration restrictions are applied to them.',
        id: 'boxui.securityControls.shortSharingDownloadIntegrationAutoExpiration',
    },
    shortSharingDownloadSignAutoExpiration: {
        defaultMessage: 'Sharing, download, Sign and sharing Auto-Expiration restrictions apply',
        description:
            'Short summary displayed for items when sharing, download, Sign and sharing Auto-Expiration restrictions are applied to them. Box Sign is a product name',
        id: 'boxui.securityControls.shortSharingDownloadSignAutoExpiration',
    },
    shortSharingAppIntegrationAutoExpiration: {
        defaultMessage: 'Sharing, app, integration and sharing Auto-Expiration restrictions apply',
        description:
            'Short summary displayed for items when sharing, app, integration and sharing Auto-Expiration restrictions are applied to them.',
        id: 'boxui.securityControls.shortSharingAppIntegrationAutoExpiration',
    },
    shortSharingAppSignAutoExpiration: {
        defaultMessage: 'Sharing, app, Sign and sharing Auto-Expiration restrictions apply',
        description:
            'Short summary displayed for items when sharing, app, Sign and sharing Auto-Expiration restrictions are applied to them. Box Sign is a product name',
        id: 'boxui.securityControls.shortSharingAppSignAutoExpiration',
    },
    shortSharingIntegrationSignAutoExpiration: {
        defaultMessage: 'Sharing, integration, Sign and sharing Auto-Expiration restrictions apply',
        description:
            'Short summary displayed for items when sharing, integration, Sign and sharing Auto-Expiration restrictions are applied to them. Box Sign is a product name',
        id: 'boxui.securityControls.shortSharingIntegrationSignAutoExpiration',
    },
    shortDownloadAppIntegrationAutoExpiration: {
        defaultMessage: 'Download, app, integration and sharing Auto-Expiration restrictions apply',
        description:
            'Short summary displayed for items when download, app, integration and sharing Auto-Expiration restrictions are applied to them.',
        id: 'boxui.securityControls.shortDownloadAppIntegrationAutoExpiration',
    },
    shortDownloadAppSignAutoExpiration: {
        defaultMessage: 'Download, app, Sign and sharing Auto-Expiration restrictions apply',
        description:
            'Short summary displayed for items when download, app, Sign and sharing Auto-Expiration restrictions are applied to them. Box Sign is a product name',
        id: 'boxui.securityControls.shortDownloadAppSignAutoExpiration',
    },
    shortDownloadIntegrationSignAutoExpiration: {
        defaultMessage: 'Download, integration, Sign and sharing Auto-Expiration restrictions apply',
        description:
            'Short summary displayed for items when download, integration, Sign and sharing Auto-Expiration restrictions are applied to them. Box Sign is a product name',
        id: 'boxui.securityControls.shortDownloadIntegrationSignAutoExpiration',
    },
    shortAppIntegrationSignAutoExpiration: {
        defaultMessage: 'App, integration, Sign and sharing Auto-Expiration restrictions apply',
        description:
            'Short summary displayed for items when app, integration, Sign and sharing Auto-Expiration restrictions are applied to them. Box Sign is a product name',
        id: 'boxui.securityControls.shortAppIntegrationSignAutoExpiration',
    },
    // Full list individual restriction bullets
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
    watermarkingApplied: {
        defaultMessage: 'Watermarking will be applied.',
        description: 'Bullet point that summarizes watermarking applied to classification',
        id: 'boxui.securityControls.watermarkingApplied',
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
    appDownloadRestricted: {
        defaultMessage: 'Download restricted for some applications.',
        description: 'Bullet point that summarizes application download restriction applied to classification',
        id: 'boxui.securityControls.appDownloadRestricted',
    },
    integrationDownloadRestricted: {
        defaultMessage: 'Download restricted for some integrations.',
        description: 'Bullet point that summarizes integration download restriction applied to classification',
        id: 'boxui.securityControls.integrationDownloadRestricted',
    },
    appDownloadBlacklist: {
        defaultMessage: 'Download restricted for some applications: {appNames}',
        description: 'Bullet point that summarizes application download restriction applied to classification',
        id: 'boxui.securityControls.appDownloadBlacklist',
    },
    integrationDownloadDenylist: {
        defaultMessage: 'Download restricted for some integrations: {appNames}',
        description: 'Bullet point that summarizes integration download restriction applied to classification',
        id: 'boxui.securityControls.integrationDownloadDenylist',
    },
    appDownloadBlacklistOverflow: {
        defaultMessage: 'Download restricted for some applications: {appNames} +{remainingAppCount} more',
        description:
            'Bullet point that summarizes application download restriction applied to classification. This variation is used when the list of applications is longer than the configured threshold',
        id: 'boxui.securityControls.appDownloadBlacklistOverflow',
    },
    integrationDownloadDenylistOverflow: {
        defaultMessage: 'Download restricted for some integrations: {appNames} +{remainingAppCount} more',
        description:
            'Bullet point that summarizes integration download restriction applied to classification. This variation is used when the list of integrations is longer than the configured threshold',
        id: 'boxui.securityControls.integrationDownloadDenylistOverflow',
    },
    appDownloadWhitelist: {
        defaultMessage: 'Only select applications are allowed: {appNames}',
        description: 'Bullet point that summarizes application download restriction applied to classification',
        id: 'boxui.securityControls.appDownloadWhitelist',
    },
    integrationDownloadAllowlist: {
        defaultMessage: 'Only select integrations are allowed: {appNames}',
        description: 'Bullet point that summarizes integration download restriction applied to classification',
        id: 'boxui.securityControls.integrationDownloadAllowlist',
    },
    appDownloadWhitelistOverflow: {
        defaultMessage: 'Only select applications are allowed: {appNames} +{remainingAppCount} more',
        description:
            'Bullet point that summarizes application download restriction applied to classification. This variation is used when the list of applications is longer than the configured threshold',
        id: 'boxui.securityControls.appDownloadWhitelistOverflow',
    },
    integrationDownloadAllowlistOverflow: {
        defaultMessage: 'Only select integrations are allowed: {appNames} +{remainingAppCount} more',
        description:
            'Bullet point that summarizes integration download restriction applied to classification. This variation is used when the list of integrations is longer than the configured threshold',
        id: 'boxui.securityControls.integrationDownloadAllowlistOverflow',
    },
    allAppNames: {
        defaultMessage: 'All applications: {appsList}',
        description: 'Name list of all applications download restriction applied to classification',
        id: 'boxui.securityControls.allAppNames',
    },
    allIntegrationNames: {
        defaultMessage: 'All integrations: {appsList}',
        description: 'Name list of all integrations download restriction applied to classification',
        id: 'boxui.securityControls.allIntegrationNames',
    },
    sharedLinkAutoExpirationApplied: {
        defaultMessage: 'Sharing Auto-Expiration restriction applies.',
        description:
            'Bullet point that summarizes sharing Auto-Expiration enabled restriction applied to classification',
        id: 'boxui.securityControls.sharingAutoExpirationEnabled',
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
    boxSignRequestRestricted: {
        defaultMessage: 'Sign restrictions apply.',
        description:
            'Bullet point that summarizes Box Sign request restrictions applied to items. Box Sign is a product name',
        id: 'boxui.securityControls.boxSignRequestRestricted',
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
    // Security Controls Modal
    viewAll: {
        defaultMessage: 'View All',
        description: 'Button to display security controls modal',
        id: 'boxui.securityControls.viewAll',
    },
    modalTitle: {
        defaultMessage: 'View Classification for “{itemName}”',
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
