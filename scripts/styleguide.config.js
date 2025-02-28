const path = require('path');
// const typescriptDocGen = require('react-docgen-typescript');
// const reactDocGen = require('react-docgen');
const webpackConf = require('./webpack.config.js');

const webpackConfig = Array.isArray(webpackConf) ? webpackConf[0] : webpackConf;

// theme variables
const vars = require('../src/styles/variables.json');

const allSections = [
    {
        name: 'Elements',
        components: () => [
            '../src/elements/content-explorer/ContentExplorer.tsx',
            '../src/elements/content-picker/ContentPicker.js',
            '../src/elements/content-preview/ContentPreview.js',
            '../src/elements/content-sharing/ContentSharing.js',
            '../src/elements/content-sidebar/ContentSidebar.js',
            '../src/elements/content-uploader/ContentUploader.tsx',
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
            '../src/components/breadcrumb/Breadcrumb.js',
            '../src/components/dropdown-menu/DropdownMenu.js',
            '../src/components/flyout/Flyout.js',
            '../src/components/flyout/Overlay.js',
            '../src/components/hotkeys/HotkeyFriendlyModal.js',
            '../src/components/hotkeys/HotkeyLayer.js',
            '../src/components/hotkeys/Hotkeys.js',
            '../src/components/inline-error/InlineError.js',
            '../src/components/inline-notice/InlineNotice.js',
            '../src/components/modal/Modal.js',
            '../src/components/modal/ModalActions.js',
            '../src/components/modal/ModalDialog.js',
            '../src/components/nav-sidebar/NavSidebar.js',
            '../src/components/notification/Notification.js',
            '../src/components/notification/NotificationsWrapper.js',
            '../src/components/pill-cloud/PillCloud.js',
            '../src/components/pill-selector-dropdown/PillSelectorDropdown.js',
            '../src/components/popper/PopperComponent.js',
            '../src/components/time/ReadableTime.js',
            '../src/components/scroll-wrapper/ScrollWrapper.js',
            '../src/components/search-form/SearchForm.js',
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

            '../src/components/avatar/Avatar.tsx',
            '../src/components/badge/Badge.tsx',
            '../src/components/badgeable/Badgeable.tsx',
            '../src/components/button/Button.tsx',
            '../src/components/button-group/ButtonGroup.tsx',
            '../src/components/category-selector/CategorySelector.tsx',
            '../src/components/checkbox/Checkbox.tsx',
            '../src/components/collapsible/Collapsible.tsx',
            '../src/components/count-badge/CountBadge.tsx',
            '../src/components/context-menu/ContextMenu.tsx',
            '../src/components/datalist-item/DatalistItem.tsx',
            '../src/components/date-picker/DatePicker.tsx',
            '../src/components/error-mask/ErrorMask.tsx',
            '../src/components/focus-trap/FocusTrap.tsx',
            '../src/components/footer-indicator/FooterIndicator.tsx',
            '../src/components/ghost/Ghost.tsx',
            '../src/components/header/Header.tsx',
            '../src/components/infinite-scroll/InfiniteScroll.tsx',
            '../src/components/label/Label.tsx',
            '../src/components/link/Link.tsx',
            '../src/components/link/LinkButton.tsx',
            '../src/components/link/LinkGroup.tsx',
            '../src/components/link/LinkPrimaryButton.tsx',
            '../src/components/loading-indicator/LoadingIndicator.tsx',
            '../src/components/logo/Logo.tsx',
            '../src/components/menu/Menu.tsx',
            '../src/components/menu/SelectMenuLinkItem.tsx',
            '../src/components/plain-button/PlainButton.tsx',
            '../src/components/primary-button/PrimaryButton.tsx',
            '../src/components/progress-bar/ProgressBar.tsx',
            '../src/components/radio/RadioButton.tsx',
            '../src/components/radio/RadioGroup.tsx',
            '../src/components/section/Section.tsx',
            '../src/components/time-input/TimeInput.tsx',
            '../src/components/tooltip/Tooltip.tsx',
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
            '../src/icons/adobe-sign/IconAdobeSign.tsx',
            '../src/icons/autocad/IconAutoCAD.tsx',
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
                components: '../src/icons/google-docs/GoogleDocsIcon.tsx',
            },
            {
                name: 'Illustrations',
                content: '../src/icons/illustrations/README.md',
            },
            {
                name: 'Items',
                components: ['../src/icons/item-icon/ItemIcon.tsx'],
            },
            {
                name: 'iWork',
                components: () => [
                    '../src/icons/iwork/IconIWorkTrio.tsx',
                    '../src/icons/iwork/IWorkIcon.tsx',
                    '../src/icons/iwork/IWorkDesktopIcon.tsx',
                ],
            },
            {
                name: 'Metadata View',
                content: '../src/icons/metadata-view/README.md',
            },
            {
                name: 'Microsoft Office',
                components: () => [
                    '../src/icons/microsoft-office/IconOfficeWordmark.tsx',
                    '../src/icons/microsoft-office/OfficeOnlineIcon.tsx',
                    '../src/icons/microsoft-office/OfficeDesktopIcon.tsx',
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
            '../src/features/beta-feedback/BetaFeedbackBadge.js',
            '../src/features/classification/Classification.js',
            '../src/features/collapsible-sidebar/CollapsibleSidebarLogo.js',
            '../src/features/invite-collaborators-modal/InviteCollaboratorsModal.js',
            '../src/features/left-sidebar/LeftSidebar.js',
            '../src/features/header-flyout/HeaderFlyout.js',
            '../src/features/message-center/components/MessageCenter.js',
            '../src/features/presence/Presence.js',
            '../src/features/presence/PresenceLink.js',
            '../src/features/security-cloud-game/SecurityCloudGame.js',
            '../src/features/share/ShareMenu.js',
            '../src/features/shared-link-modal/SharedLink.js',
            '../src/features/shared-link-modal/SharedLinkModal.js',
            '../src/features/shared-link-settings-modal/SharedLinkSettingsModal.js',
            '../src/features/unified-share-modal/UnifiedShareModal.js',
            '../src/features/virtualized-table-renderers/index.js',
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
        const extension = path.extname(componentPath);
        const name = path.basename(componentPath, extension);
        const dir = path.dirname(componentPath);
        const packageRelativePath = dir.replace(/.*\/src\//, '');
        return `import ${name} from 'box-ui-elements/es/${packageRelativePath}/${name}';`;
    },
    pagePerSection: true,
    require: [path.resolve(__dirname, 'styleguide.setup.js'), path.resolve(__dirname, 'styleguide.styles.scss')],
    showSidebar: process.env.BROWSERSLIST_ENV !== 'test',
    styleguideDir: path.join(__dirname, '../styleguide'),
    sections: allSections,
    // Default exports are not supported by typescript DocGen
    // propsParser(filePath, source, resolver, handlers) {
    //     const extension = path.extname(filePath);
    //     return extension === '.js'
    //         ? reactDocGen.parse(source, resolver, handlers)
    //         : typescriptDocGen.withDefaultConfig({}).parse(source, resolver, handlers);
    // },
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
            link: vars['bdl-gray-65'],
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
