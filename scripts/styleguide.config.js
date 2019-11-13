const path = require('path');
const webpackConf = require('./webpack.config.js');

const webpackConfig = Array.isArray(webpackConf) ? webpackConf[0] : webpackConf;

// theme variables
const vars = require('../src/styles/variables.json');

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
            '../src/components/ghost/Ghost.js',
            '../src/components/flyout/Overlay.js',
            '../src/components/focus-trap/FocusTrap.js',
            '../src/components/footer-indicator/FooterIndicator.js',
            '../src/components/header/Header.js',
            '../src/components/hotkeys/HotkeyFriendlyModal.js',
            '../src/components/hotkeys/HotkeyLayer.js',
            '../src/components/hotkeys/Hotkeys.js',
            '../src/components/i18n/FormattedCompMessage.js',
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
        description: 'Box UI Elements components implement the reusable building blocks of the Box Design Language',
        sectionDepth: 2,
        usageMode: 'expand',
        sections: [
            {
                name: 'Media',
                components: [
                    '../src/components/media/Media.js',
                    '../src/components/media/MediaFigure.js',
                    '../src/components/media/MediaBody.js',
                    '../src/components/media/MediaMenu.js',
                ],
                description: 'Implements the "media object" layout',
                usageMode: 'expand',
            },
        ],
    },
    {
        name: 'Icons',
        components: () => [
            '../src/icons/adobe-sign/IconAdobeSign.js',
            '../src/icons/autocad/IconAutoCAD.js',
            // try not to add to this list but instead add new icons into the
            // families of icons below (or create new families where appropriate)
        ],
        sections: [
            {
                name: 'Annotations',
                content: '../src/icons/annotations/README.md',
            },
            {
                name: 'Avatars',
                content: '../src/icons/avatars/README.md',
            },
            {
                name: 'Badges',
                content: '../src/icons/badges/README.md',
            },
            {
                name: 'Box Tools',
                content: '../src/icons/box-tools/README.md',
            },
            {
                name: 'Collections',
                content: '../src/icons/collections/README.md',
            },
            {
                name: 'Files',
                content: '../src/icons/file/README.md',
            },
            {
                name: 'Folders',
                content: '../src/icons/folder/README.md',
            },
            {
                name: 'General',
                content: '../src/icons/general/README.md',
            },
            {
                name: 'Google Docs',
                components: '../src/icons/google-docs/GoogleDocsIcon.js',
            },
            {
                name: 'Illustrations',
                content: '../src/icons/illustrations/README.md',
            },
            {
                name: 'Items',
                components: ['../src/icons/bookmark-icon/BookmarkIcon.js', '../src/icons/item-icon/ItemIcon.js'],
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
                name: 'Metadata View',
                content: '../src/icons/metadata-view/README.md',
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
                content: '../src/icons/placeholders/README.md',
            },
            {
                name: 'States',
                content: '../src/icons/states/README.md',
            },
            {
                name: 'Two-Toned',
                content: '../src/icons/two-toned/README.md',
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
        name: 'Formik Elements',
        content: '../src/components/form-elements/formik/README.md',
    },
    {
        name: 'Features',
        components: () => [
            '../src/features/classification/Classification.js',
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
    getComponentPathLine(componentPath) {
        const name = path.basename(componentPath, '.js');
        const dir = path.dirname(componentPath);
        const packageRelativePath = dir.replace(/.*\/src\//, '');
        return `import ${name} from 'box-ui-elements/es/${packageRelativePath}/${name}';`;
    },
    pagePerSection: true,
    require: [path.resolve(__dirname, 'styleguide.setup.js'), path.resolve(__dirname, 'styleguide.styles.scss')],
    showSidebar: process.env.BROWSERSLIST_ENV !== 'test',
    styleguideDir: path.join(__dirname, '../styleguide'),
    sections: allSections,
    styles: {
        Heading: {
            heading: {
                lineHeight: 2,
            },
        },
        Pathline: {
            pathline: {
                background: vars['bdl-box-blue-05'],
                borderRadius: 3,
                color: vars['bdl-gray'],
                display: 'inline',
                fontSize: 12,
                padding: 10,
            },
        },
        Code: {
            code: {
                fontSize: 12,
            },
        },
        Type: {
            type: {
                fontSize: 12,
            },
        },
        Name: {
            name: {
                fontSize: 12,
            },
        },
        TabButton: {
            isActive: {
                borderBottomColor: vars['bdl-box-blue'],
            },
            button: {
                borderBottom: `2px solid ${vars['bdl-gray-20']}`,
            },
        },
        Blockquote: {
            blockquote: {
                borderLeft: `3px solid ${vars['bdl-yellow']}`,
                borderRadius: 3,
                fontSize: 'inherit',
                marginLeft: 0,
                paddingTop: 10,
                paddingLeft: 10,
                paddingBottom: 1,
                background: vars['bdl-yellow-10'],
            },
        },
    },
    title: 'Box UI Elements',
    theme: {
        buttonTextTransform: 'capitalize',
        color: {
            base: vars['bdl-gray'],
            link: vars['bdl-gray-62'],
            linkHover: vars['bdl-box-blue'],
            error: vars['bdl-watermelon-red'],
            type: vars['bdl-gray-80'],
            name: vars['bdl-gray-80'],
            border: vars['bdl-gray-10'],
            sidebarBackground: vars['bdl-gray-02'],
            light: vars['bdl-gray-80'],
            lightest: vars['bdl-gray-20'],
            focus: vars['bdl-light-blue-50'],
            codeBase: vars['bdl-gray'],
        },
        fontFamily: {
            base: 'Lato, "Helvetica Neue", Helvetica, Arial, sans-serif',
        },
        fontSize: {
            base: 13,
            text: 13,
            small: 13,
            h1: 30,
            h2: 24,
            h3: 20,
            h4: 16,
            h5: 14,
            h6: 12,
        },
        lineHeight: 'inherit',
        maxWidth: '100%',
        spaceFactor: 6,
    },
    webpackConfig,
};
