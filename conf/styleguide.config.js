const path = require('path');
const webpackConf = require('./webpack.config.js');

const webpackConfig = Array.isArray(webpackConf) ? webpackConf[0] : webpackConf;

const allSections = [
    {
        name: 'Elements',
        components: () => [
            '../src/elements/content-explorer/ContentExplorer.js',
            '../src/elements/content-open-with/ContentOpenWith.js',
            '../src/elements/content-picker/ContentPicker.js',
            '../src/elements/content-preview/ContentPreview.js',
            '../src/elements/content-sidebar/ContentSidebar.js',
            '../src/elements/content-uploader/ContentUploader.js',
        ],
        content: '../src/elements/README.md',
        sectionDepth: 2,
    },
    {
        name: 'Colors',
        content: '../examples/colors.md',
    },
    {
        name: 'Typography',
        content: '../examples/typography.md',
    },
    {
        name: 'Components',
        components: () => [
            '../src/components/avatar/Avatar.js',
            '../src/components/badge/Badge.js',
            '../src/components/badgeable/Badgeable.js',
            '../src/components/breadcrumb/Breadcrumb.js',
            '../src/components/button/Button.js',
            '../src/components/button-group/ButtonGroup.js',
            '../src/components/checkbox/Checkbox.js',
            '../src/components/collapsible/Collapsible.js',
            '../src/components/context-menu/ContextMenu.js',
            '../src/components/count-badge/CountBadge.js',
            '../src/components/datalist-item/DatalistItem.js',
            '../src/components/date-picker/DatePicker.js',
            '../src/components/draggable-list/DraggableList.js',
            '../src/components/dropdown-menu/DropdownMenu.js',
            '../src/components/error-mask/ErrorMask.js',
            '../src/components/flyout/Flyout.js',
            '../src/components/flyout/Overlay.js',
            '../src/components/focus-trap/FocusTrap.js',
            '../src/components/header/Header.js',
            '../src/components/hotkeys/HotkeyFriendlyModal.js',
            '../src/components/hotkeys/HotkeyLayer.js',
            '../src/components/hotkeys/Hotkeys.js',
            '../src/components/infinite-scroll/InfiniteScroll.js',
            '../src/components/inline-error/InlineError.js',
            '../src/components/inline-notice/InlineNotice.js',
            '../src/components/label/Label.js',
            '../src/components/link/Link.js',
            '../src/components/link/LinkButton.js',
            '../src/components/link/LinkGroup.js',
            '../src/components/link/LinkPrimaryButton.js',
            '../src/components/loading-indicator/LoadingIndicator.js',
            '../src/components/loading-indicator/LoadingIndicatorWrapper.js',
            '../src/components/logo/Logo.js',
            '../src/components/menu/Menu.js',
            '../src/components/menu/SelectMenuLinkItem.js',
            '../src/components/modal/Modal.js',
            '../src/components/modal/ModalActions.js',
            '../src/components/modal/ModalDialog.js',
            '../src/components/nav-sidebar/NavSidebar.js',
            '../src/components/notification/Notification.js',
            '../src/components/notification/NotificationsWrapper.js',
            '../src/components/pill-cloud/PillCloud.js',
            '../src/components/pill-selector-dropdown/PillSelectorDropdown.js',
            '../src/components/plain-button/PlainButton.js',
            '../src/components/primary-button/PrimaryButton.js',
            '../src/components/progress-bar/ProgressBar.js',
            '../src/components/radar/RadarAnimation.js',
            '../src/components/radio/RadioButton.js',
            '../src/components/radio/RadioGroup.js',
            '../src/components/time/ReadableTime.js',
            '../src/components/scroll-wrapper/ScrollWrapper.js',
            '../src/components/search-form/SearchForm.js',
            '../src/components/section/Section.js',
            '../src/components/select/Select.js',
            '../src/components/select-field/MultiSelectField.js',
            '../src/components/select-field/SingleSelectField.js',
            '../src/components/selector-dropdown/SelectorDropdown.js',
            '../src/components/slide-carousel/SlideCarousel.js',
            '../src/components/tab-view/TabView.js',
            '../src/components/table/Table.js',
            '../src/components/text-area/TextArea.js',
            '../src/components/text-input/TextInput.js',
            '../src/components/text-input-with-copy-button/TextInputWithCopyButton.js',
            '../src/components/thumbnail-card/ThumbnailCard.js',
            '../src/components/toggle/Toggle.js',
            '../src/components/tooltip/Tooltip.js',
        ],
    },
    {
        name: 'Icons',
        components: () => [
            '../src/icons/item-icon/ItemIcon.js',
            '../src/icons/folder-icon/FolderIcon.js',
            '../src/icons/file-icon/FileIcon.js',
            '../src/icons/bookmark-icon/BookmarkIcon.js',
            '../src/icons/adobe-sign/IconAdobeSign.js',
            '../src/icons/google-docs/GoogleDocsIcon.js',
            '../src/icons/autocad/IconAutoCAD.js',
        ],
        sections: [
            {
                name: 'Annotations',
                components: '../src/icons/annotations/[A-Z]*.js',
            },
            {
                name: 'Avatar',
                components: '../src/icons/avatars/[A-Z]*.js',
            },
            {
                name: 'Badges',
                components: '../src/icons/badges/[A-Z]*.js',
            },
            {
                name: 'Box Tools',
                components: '../src/icons/box-tools/[A-Z]*.js',
            },
            {
                name: 'General',
                components: '../src/icons/general/[A-Z]*.js',
            },
            {
                name: 'File',
                content: '../src/icons/file/index.md',
            },
            {
                name: 'Folder',
                content: '../src/icons/folder/index.md',
            },
            {
                name: 'Illustrations',
                components: '../src/icons/illustrations/[A-Z]*.js',
            },
            {
                name: 'iWork',
                components: () => [
                    '../src/icons/iwork/IconIWorkTrio.js',
                    '../src/icons/iwork/IWorkIcon.js',
                    '../src/icons/iwork/IWorkDesktopIcon.js',
                ],
            },
            {
                name: 'Microsoft Office',
                components: () => [
                    '../src/icons/microsoft-office/IconOfficeWordmark.js',
                    '../src/icons/microsoft-office/OfficeOnlineIcon.js',
                    '../src/icons/microsoft-office/OfficeDesktopIcon.js',
                ],
            },
            {
                name: 'Placeholders',
                components: '../src/icons/placeholders/[A-Z]*.js',
            },
            {
                name: 'States',
                components: '../src/icons/states/[A-Z]*.js',
            },
            {
                name: 'Two-Toned',
                components: '../src/icons/two-toned/[A-Z]*.js',
            },
            {
                name: 'Metadata View',
                components: '../src/icons/metadata-view/[A-Z]*.js',
            },
        ],
    },
    {
        name: 'Form Elements',
        components: () => [
            '../src/components/form-elements/draft-js-mention-selector/DraftJSMentionSelector.js',
            '../src/components/form-elements/form/Form.js',
            '../src/components/form-elements/text-area/TextArea.js',
            '../src/components/form-elements/text-input/TextInput.js',
        ],
    },
    {
        name: 'Features',
        components: () => [
            '../src/features/activity-feed/activity-feed/ActivityFeed.js',
            '../src/features/in-app-message/create-message-form/CreateMessageForm.js',
            '../src/features/in-app-message/targeting-expression-editor/TargetingExpressionEditor.js',
            '../src/features/invite-collaborators-modal/InviteCollaboratorsModal.js',
            '../src/features/left-sidebar/LeftSidebar.js',
            '../src/features/header-flyout/HeaderFlyout.js',
            '../src/features/presence/Presence.js',
            '../src/features/presence/PresenceLink.js',
            '../src/features/security-cloud-game/SecurityCloudGame.js',
            '../src/features/share/ShareMenu.js',
            '../src/features/shared-link-modal/SharedLink.js',
            '../src/features/shared-link-modal/SharedLinkModal.js',
            '../src/features/shared-link-settings-modal/SharedLinkSettingsModal.js',
            '../src/features/unified-share-modal/UnifiedShareModal.js',
            '../src/features/version-history-modal/VersionHistoryModal.js',
        ],
        sections: [
            {
                name: 'Metadata',
                components: () => ['../src/features/metadata-instance-editor/MetadataInstanceEditor.js'],
            },
            {
                name: 'Metadata View',
                components: () => ['../src/features/query-bar/QueryBar.js', '../src/features/list-view/ListView.js'],
            },
            {
                name: 'Content Explorer',
                components: () => [
                    '../src/features/content-explorer/content-explorer-modal-container/ContentExplorerModalContainer.js',
                    '../src/features/content-explorer/content-explorer/ContentExplorer.js',
                    '../src/features/content-explorer/new-folder-modal/NewFolderModal.js',
                ],
            },
            {
                name: 'Item Details',
                components: () => [
                    '../src/features/item-details/VersionHistoryLink.js',
                    '../src/features/item-details/ItemExpirationNotice.js',
                    '../src/features/item-details/SharedLinkExpirationNotice.js',
                    '../src/features/item-details/ItemProperties.js',
                ],
            },
            {
                name: 'Access Stats',
                components: () => ['../src/features/access-stats/AccessStats.js'],
            },
            {
                name: 'Quick Search',
                components: () => [
                    '../src/features/quick-search/QuickSearch.js',
                    '../src/features/quick-search/QuickSearchItem.js',
                ],
            },
        ],
    },
];

module.exports = {
    pagePerSection: true,
    require: [path.resolve(__dirname, 'styleguide.setup.js'), path.resolve(__dirname, 'styleguide.styles.scss')],
    styleguideDir: path.join(__dirname, '../styleguide'),
    sections: allSections,
    styles: {
        Heading: {
            heading: {
                lineHeight: 1,
            },
        },
    },
    title: 'Box UI Elements',
    theme: {
        color: {
            link: '#777',
            linkHover: '#0061d5',
        },
        fontFamily: {
            base: 'Lato, "Helvetica Neue", Helvetica, Arial, sans-serif',
        },
        lineHeight: 'inherit',
        maxWidth: '100%',
    },
    webpackConfig,
};
