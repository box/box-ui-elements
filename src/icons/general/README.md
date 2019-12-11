**General icons**

```jsx
const IconsExample = require('../../../examples/src/IconsExample').default;
const iconPropsDocumentation = require('../../../examples/src/IconsExampleIconDocs').default;

const icons = [
    {
        name: 'IconAccepted',
        component: require('./IconAccepted').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconAccessStats',
        component: require('./IconAccessStats').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconAdd',
        component: require('./IconAdd').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconAddMetadataEmptyState',
        component: require('./IconAddMetadataEmptyState').default,
        propsDocumentation: () => (
`
className?: string,
color?: string,
/** A string describing the icon if it's not purely decorative for accessibility */
title?: string | Element<any>,
width?: number,
`
        ),
    },
    {
        name: 'IconAddTags',
        component: require('./IconAddTags').default,
        propsDocumentation: () => (
`
className?: string,
color?: string,
height?: number,
strokeWidth?: number,
/** A text-only string describing the icon if it's not purely decorative for accessibility */
title?: string | React.Element<any>,
width?: number,
`
        ),
    },
    {
        name: 'IconAddThin',
        component: require('./IconAddThin').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconAdvancedFilters',
        component: require('./IconAdvancedFilters').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconAlert',
        component: require('./IconAlert').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconAlertBlank',
        component: require('./IconAlertBlank').default,
        propsDocumentation: () => (
`
className?: string,
height?: number,
/** A text-only string describing the icon if it's not purely decorative for accessibility */
title?: string | React.Element<any>,
width?: number,
`
        ),
    },
    {
        name: 'IconAlertCircle',
        component: () => {
            const IconAlertCircle = require('./IconAlertCircle').default;
            return (
                <div style={{ backgroundColor: '#333' }}>
                    <IconAlertCircle />
                </div>
            );
        },
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconAlertDefault',
        component: require('./IconAlertDefault').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconAlignLeft',
        component: require('./IconAlignLeft').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconAllFiles',
        component: require('./IconAllFiles').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconAnyTask',
        component: require('./IconAnyTask').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconApps',
        component: require('./IconApps').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconAutomation',
        component: () => {
            const IconAutomation = require('./IconAutomation').default;
            return (
                <IconAutomation color={'#000'} />
            );
        },
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconBarGraph',
        component: require('./IconBarGraph').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconBell',
        component: () => {
            const IconBell = require('./IconBell').default;
            return (
                <div style={{ backgroundColor: '#333'}}>
                    <IconBell />
                </div>
            );
        },
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconBell2',
        component: () => {
            const IconBell2 = require('./IconBell2').default;
            return (
                <>
                    <IconBell2 color="#000" />
                    <IconBell2 color="#000" isFilled />
                </>
            );
        },
        propsDocumentation: () => (
`
className?: string,
color?: string,
/** Should this icon be filled, or just an outline */
height?: number,
isFilled?: boolean,
/** A text-only string describing the icon if it's not purely decorative for accessibility */
title?: string | React.Element<any>,
width?: number,
`
        ),
    },
    {
        name: 'IconBilling',
        component: require('./IconBilling').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconBox3DCenter',
        component: require('./IconBox3DCenter').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconBoxSquare',
        component: require('./IconBoxSquare').default,
        propsDocumentation: () => (
`
className?: string,
height?: number,
title?: string | React.Element<any>,
width?: number,
`
        ),
    },
    {
        name: 'IconBreadcrumbArrow',
        component: require('./IconBreadcrumbArrow').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconCalendar',
        component: require('./IconCalendar').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconCaretRound',
        component: require('./IconCaretRound').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconCaretDown',
        component: require('./IconCaretDown').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconChat',
        component: require('./IconChat').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconChatRound',
        component: require('./IconChatRound').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconCheck',
        component: require('./IconCheck').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconChevron',
        component: require('./IconChevron').default,
        propsDocumentation: () => (
`
className?: string,
color?: string,
direction?: 'down' | 'left' | 'right' | 'up',
size?: string,
thickness?: string,
`
        ),
    },
    {
        name: 'IconClear',
        component: require('./IconClear').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconClock',
        component: require('./IconClock').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconClockPast',
        component: require('./IconClockPast').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconClose',
        component: require('./IconClose').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconCloud',
        component: require('./IconCloud').default,
        propsDocumentation: () => (
`
className?: string,
filter?: {
    definition?: React.Node,
    id?: string,
},
height?: number,
/** A text-only string describing the icon if it's not purely decorative for accessibility */
title?: string | React.Element<any>,
width?: number,
`
        ),
    },
    {
        name: 'IconCodeBlock',
        component: require('./IconCodeBlock').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconCollaboration',
        component: require('./IconCollaboration').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconCollaborators',
        component: require('./IconCollaborators').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconCollaboratorsRestricted',
        component: require('./IconCollaboratorsRestricted').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconCollapse',
        component: require('./IconCollapse').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconComment',
        component: require('./IconComment').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconCommentsBadge',
        component: require('./IconCommentsBadge').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconComposeNote',
        component: require('./IconComposeNote').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconConePopper',
        component: require('./IconConePopper').default,
        propsDocumentation: () => (
`
className?: string,
height?: number,
/** A text-only string describing the icon if it's not purely decorative for accessibility */
title?: string | React.Element<any>,
width?: number,
`
        ),
    },
    {
        name: 'IconCopy',
        component: require('./IconCopy').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconCreditCardAmex',
        component: require('./IconCreditCardAmex').default,
        propsDocumentation: () => (
`
className?: string,
color?: string,
height?: number,
opacity?: number,
/** A text-only string describing the icon if it's not purely decorative for accessibility */
title?: string | React.Element<any>,
width?: number,
`
        ),
    },
    {
        name: 'IconCreditCardDiscover',
        component: require('./IconCreditCardDiscover').default,
        propsDocumentation: () => (
`
className?: string,
color?: string,
height?: number,
opacity?: number,
/** A text-only string describing the icon if it's not purely decorative for accessibility */
title?: string | React.Element<any>,
width?: number,
`
        ),
    },
    {
        name: 'IconCreditCardJCB',
        component: require('./IconCreditCardJCB').default,
        propsDocumentation: () => (
`
className?: string,
color?: string,
height?: number,
opacity?: number,
/** A text-only string describing the icon if it's not purely decorative for accessibility */
title?: string | React.Element<any>,
width?: number,
`
        ),
    },
    {
        name: 'IconCreditCardMasterCard',
        component: require('./IconCreditCardMasterCard').default,
        propsDocumentation: () => (
`
className?: string,
color?: string,
height?: number,
opacity?: number,
/** A text-only string describing the icon if it's not purely decorative for accessibility */
title?: string | React.Element<any>,
width?: number,
`
        ),
    },
    {
        name: 'IconCreditCardVisa',
        component: require('./IconCreditCardVisa').default,
        propsDocumentation: () => (
`
className?: string,
color?: string,
height?: number,
opacity?: number,
/** A text-only string describing the icon if it's not purely decorative for accessibility */
title?: string | React.Element<any>,
width?: number,
`
        ),
    },
    {
        name: 'IconDocIllustration',
        component: require('./IconDocIllustration').default,
        propsDocumentation: () => (
`
className: string,
height?: number,
/** A text-only string describing the icon if it's not purely decorative for accessibility */
title?: string | React.Element<any>,
width?: number,
`
        ),
    },
    {
        name: 'IconDocInfo',
        component: require('./IconDocInfo').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconDoubleArrows',
        component: require('./IconDoubleArrows').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconDownload',
        component: require('./IconDownload').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconDownloadFile',
        component: require('./IconDownloadFile').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconDownloadSolid',
        component: require('./IconDownloadSolid').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconDrag',
        component: require('./IconDrag').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconEdit',
        component: require('./IconEdit').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconEllipsis',
        component: require('./IconEllipsis').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconExclamationMark',
        component: require('./IconExclamationMark').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconExpand',
        component: require('./IconExpand').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconExpiration',
        component: require('./IconExpiration').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconExpirationBadge',
        component: require('./IconExpirationBadge').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconExpirationInverted',
        component: require('./IconExpirationInverted').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconEye',
        component: require('./IconEye').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconEyeHidden',
        component: require('./IconEyeHidden').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconEyeInverted',
        component: require('./IconEyeInverted').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconFeed',
        component: require('./IconFeed').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconFlag',
        component: require('./IconFlag').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconFlagSolid',
        component: require('./IconFlagSolid').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconFolderTree',
        component: require('./IconFolderTree').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconForward',
        component: require('./IconForward').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconGiftWithWings',
        component: require('./IconGiftWithWings').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconGlobe',
        component: require('./IconGlobe').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconGlobeTinycon',
        component: require('./IconGlobeTinycon').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconGraduationHat',
        component: require('./IconGraduationHat').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconGridView',
        component: () => {
            const IconGridView = require('./IconGridView').default;
            return (
                <>
                    <span style={{margin: '5px'}}><IconGridView /></span>
                    <span style={{margin: '5px'}}><IconGridView opacity={0.2} /></span>
                </>
            );
        },
        propsDocumentation: () => (
`
className?: string,
color?: string,
height?: number,
opacity?: number,
/** A text-only string describing the icon if it's not purely decorative for accessibility */
title?: string | React.Element<any>,
width?: number,
`
        ),
    },
    {
        name: 'IconGridViewInverted',
        component: require('./IconGridViewInverted').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconHamburger',
        component: require('./IconHamburger').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconHelp',
        component: require('./IconHelp').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconHide',
        component: require('./IconHide').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconHome',
        component: require('./IconHome').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconInfo',
        component: require('./IconInfo').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconInfoInverted',
        component: require('./IconInfoInverted').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconInformation',
        component: require('./IconInformation').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconInfoThin',
        component: () => {
            const IconInfoThin = require('./IconInfoThin').default;
            return (
                <div style={{ backgroundColor: '#333' }}>
                    <IconInfoThin />
                </div>
            );
        },
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconInviteCollaborators',
        component: require('./IconInviteCollaborators').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconLeftArrow',
        component: require('./IconLeftArrow').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconLink',
        component: require('./IconLink').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconListView',
        component: () => {
            const IconListView = require('./IconListView').default;
            return (
                <>
                    <span style={{margin: '5px'}}><IconListView /></span>
                    <span style={{margin: '5px'}}><IconListView opacity={0.2} /></span>
                </>
            )
        },
        propsDocumentation: () => (
`
className?: string,
color?: string,
height?: number,
opacity?: number,
/** A text-only string describing the icon if it's not purely decorative for accessibility */
title?: string | React.Element<any>,
width?: number,
`
        ),
    },
    {
        name: 'IconLock',
        component: require('./IconLock').default,
        propsDocumentation: () => (
`
className?: string,
color?: string,
height?: number,
opacity?: number,
/** A text-only string describing the icon if it's not purely decorative for accessibility */
title?: string | React.Element<any>,
width?: number,
`
        ),
    },
    {
        name: 'IconLogin',
        component: require('./IconLogin').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconLogo',
        component: require('./IconLogo').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconMagicWand',
        component: require('./IconMagicWand').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconMail',
        component: require('./IconMail').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconMaximize',
        component: require('./IconMaximize').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconMetadata',
        component: require('./IconMetadata').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconMetadataColored',
        component: require('./IconMetadataColored').default,
        propsDocumentation: () => (
`
className?: string,
color?: string,
height?: number,
title?: string | React.Element<any>,
type?: 'cascade' | 'default',
width?: number,
`
        ),
    },
    {
        name: 'IconMetadataThick',
        component: require('./IconMetadataThick').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconMinus',
        component: require('./IconMinus').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconMinusThin',
        component: require('./IconMinusThin').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconMoveCopy',
        component: require('./IconMoveCopy').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconNavigateLeft',
        component: require('./IconNavigateLeft').default,
        propsDocumentation: () => (
`
className?: string,
height?: number,
/** A text-only string describing the icon if it's not purely decorative for accessibility */
title?: string | React.Element<any>,
width?: number,
`
        ),
    },
    {
        name: 'IconNavigateRight',
        component: require('./IconNavigateRight').default,
        propsDocumentation: () => (
`
className?: string,
height?: number,
/** A text-only string describing the icon if it's not purely decorative for accessibility */
title?: string | React.Element<any>,
width?: number,
`
        ),
    },
    {
        name: 'IconOpenWith',
        component: require('./IconOpenWith').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconPageBack',
        component: require('./IconPageBack').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconPageForward',
        component: require('./IconPageForward').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconPencil',
        component: require('./IconPencil').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconPencilSolid',
        component: require('./IconPencilSolid').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconPhone',
        component: require('./IconPhone').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconPlay',
        component: require('./IconPlay').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconPlus',
        component: require('./IconPlus').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconPlusRound',
        component: require('./IconPlusRound').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconPlusThin',
        component: require('./IconPlusThin').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconPresenceInvite',
        component: require('./IconPresenceInvite').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconPrint',
        component: require('./IconPrint').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconPrintInverted',
        component: require('./IconPrintInverted').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconPublic',
        component: require('./IconPublic').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconPuzzlePiece',
        component: require('./IconPuzzlePiece').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconPuzzlePieceCircle',
        component: require('./IconPuzzlePieceCircle').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconRecentFiles',
        component: require('./IconRecentFiles').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconRejected',
        component: require('./IconRejected').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconRelayFlag',
        component: require('./IconRelayFlag').default,
        propsDocumentation: iconPropsDocumentation,

    },
    {
        name: 'IconRemove',
        component: require('./IconRemove').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconRename',
        component: require('./IconRename').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconReportAbuse',
        component: require('./IconReportAbuse').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconReports',
        component: require('./IconReports').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconRetention',
        component: () => {
            const IconRetention = require('./IconRetention').default;
            return (
                <IconRetention color="#000" />
            )
        },
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconRetry',
        component: require('./IconRetry').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconSadCloud',
        component: require('./IconSadCloud').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconSearch',
        component: require('./IconSearch').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconSecurityClassification',
        component: require('./IconSecurityClassification').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconSetting',
        component: require('./IconSetting').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconSettingInverted',
        component: require('./IconSettingInverted').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconShare',
        component: require('./IconShare').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconSharedLink',
        component: require('./IconSharedLink').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconSharedLinkRestricted',
        component: require('./IconSharedLinkRestricted').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconShield',
        component: require('./IconShield').default,
        propsDocumentation: () => (
`
className?: string,
color?: string,
height?: number,
opacity?: number,
/** A text-only string describing the icon if it's not purely decorative for accessibility */
title?: string | React.Element<any>,
width?: number,
`
        ),
    },
    {
        name: 'IconShield2',
        component: require('./IconShield2').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconShow',
        component: require('./IconShow').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconSidebar',
        component: require('./IconSidebar').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconSidebarLeft',
        component: require('./IconSidebarLeft').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconSmallClose',
        component: require('./IconSmallClose').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconSort',
        component: require('./IconSort').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconSortChevron',
        component: require('./IconSortChevron').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconStar',
        component: require('./IconStar').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconStorage',
        component: require('./IconStorage').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconSync',
        component: require('./IconSync').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconTag',
        component: require('./IconTag').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconTask',
        component: require('./IconTask').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconThumbsUp',
        component: require('./IconThumbsUp').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconToolbox',
        component: require('./IconToolbox').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconTrackNext',
        component: require('./IconTrackNext').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconTrackPrevious',
        component: require('./IconTrackPrevious').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconTrash',
        component: require('./IconTrash').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconTrophyCup',
        component: require('./IconTrophyCup').default,
        propsDocumentation: () => (
`
className: string,
height?: number,
/** A text-only string describing the icon if it's not purely decorative for accessibility */
title?: string | React.Element<any>,
width?: number,
`
        ),
    },
    {
        name: 'IconTrophyCupWithTooltip',
        component: require('./IconTrophyCupWithTooltip').default,
        propsDocumentation: () => (
`
className: string,
height?: number,
/** A text-only string describing the icon if it's not purely decorative for accessibility */
title?: string | React.Element<any>,
tooltipColor?: string,
tooltipText?: string,
width?: number,
`
        ),
    },
    {
        name: 'IconUnlock',
        component: require('./IconUnlock').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconUnsync',
        component: require('./IconUnsync').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconUpdated',
        component: require('./IconUpdated').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconUpgradeCloud',
        component: require('./IconUpgradeCloud').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconUpload',
        component: require('./IconUpload').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconUploadCloud',
        component: require('./IconUploadCloud').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconUploadSolid',
        component: require('./IconUploadSolid').default,
        propsDocumentation: iconPropsDocumentation,
    },
    {
        name: 'IconVerified',
        component: require('./IconVerified').default,
        propsDocumentation: () => (
`
className?: string,
color?: string,
height?: number,
opacity?: number,
/** A text-only string describing the icon if it's not purely decorative for accessibility */
title?: string | React.Element<any>,
width?: number,
`
        ),
    },
    {
        name: 'IconWatermark',
        component: require('./IconWatermark').default,
        propsDocumentation: iconPropsDocumentation,
    },
];

<IconsExample icons={icons} />;
```
