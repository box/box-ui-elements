// @flow
import * as React from 'react';

import { ThemeProvider } from 'styled-components';
import noop from 'lodash/noop';

// eslint-disable-next-line import/named
import { createTheme } from '../../utils/createTheme';

import CollapsibleSidebar from './CollapsibleSidebar';
import CollapsibleSidebarLogo from './CollapsibleSidebarLogo';
import CollapsibleSidebarFooter from './CollapsibleSidebarFooter';
import CollapsibleSidebarNav from './CollapsibleSidebarNav';
import CollapsibleSidebarItem from './CollapsibleSidebarItem';
import CollapsibleSidebarMenuItem from './CollapsibleSidebarMenuItem';
import notes from './CollapsibleSidebar.stories.md';

import Link from '../../components/link/Link';
import IconPlusRound from '../../icons/general/IconPlusRound';
import { BetaBadge, TrialBadge } from '../../components/badge';
import Folder16 from '../../icon/fill/Folder16';
import ClockBadge16 from '../../icon/fill/ClockBadge16';
import Code16 from '../../icon/fill/Code16';
import Trash16 from '../../icon/fill/Trash16';
import FileDefault16 from '../../icon/fill/FileDefault16';
import CheckmarkBadge16 from '../../icon/fill/CheckmarkBadge16';

const renderFiles = () => {
    const items = [];
    for (let i = 0; i < 5; i += 1) {
        items.push(
            <li key={`djb-leftnav-menu-item-all-file-${i}`}>
                <CollapsibleSidebarItem
                    collapsedElement={
                        <CollapsibleSidebarMenuItem
                            as={Link}
                            href="/"
                            icon={<FileDefault16 height={20} width={20} />}
                        />
                    }
                    expanded
                    expandedElement={
                        <CollapsibleSidebarMenuItem
                            as={Link}
                            href="/"
                            icon={<FileDefault16 height={20} width={20} />}
                            text={`File ${i}`}
                        />
                    }
                    tooltipMessage="File Link"
                />
            </li>,
        );
    }
    return items;
};

export const basic = () => {
    const hexColor = '#0061d5';
    const theme = createTheme(hexColor);
    const linkProps = {
        href: '/?path=/story/components-tooltip--top-center',
        'data-resin-target': 'resinTarget',
    };

    const menuItemContent = (
        <>
            <BetaBadge
                style={{
                    marginLeft: 8,
                }}
            />
            <TrialBadge
                style={{
                    marginLeft: 8,
                }}
            />
        </>
    );

    return (
        <ThemeProvider theme={theme}>
            <CollapsibleSidebar expanded>
                <CollapsibleSidebarLogo canEndTrial={false} linkProps={linkProps} onToggle={noop} expanded />
                <CollapsibleSidebarNav>
                    <ul>
                        <li key="djb-leftnav-menu-item-all-files">
                            <CollapsibleSidebarItem
                                collapsedElement={
                                    <CollapsibleSidebarMenuItem
                                        as={Link}
                                        href="/"
                                        icon={<Folder16 height={20} width={20} />}
                                        linkClassName="is-currentPage"
                                    />
                                }
                                expanded
                                expandedElement={
                                    <CollapsibleSidebarMenuItem
                                        as={Link}
                                        href="/"
                                        icon={<Folder16 height={20} width={20} />}
                                        linkClassName="is-currentPage"
                                        text="All Files"
                                    />
                                }
                                tooltipMessage="All Files Link"
                            />
                        </li>
                        <li key="djb-leftnav-menu-item-all-recents">
                            <CollapsibleSidebarItem
                                collapsedElement={
                                    <CollapsibleSidebarMenuItem
                                        as={Link}
                                        href="/"
                                        icon={<Folder16 height={20} width={20} />}
                                    />
                                }
                                expanded
                                expandedElement={
                                    <CollapsibleSidebarMenuItem
                                        as={Link}
                                        href="/"
                                        icon={<ClockBadge16 height={20} width={20} />}
                                        text="Recents"
                                    />
                                }
                                tooltipMessage="Recents Link"
                            />
                        </li>
                        <li key="djb-leftnav-menu-item-synced">
                            <CollapsibleSidebarItem
                                collapsedElement={
                                    <CollapsibleSidebarMenuItem
                                        as={Link}
                                        href="/"
                                        icon={<CheckmarkBadge16 height={20} width={20} />}
                                    />
                                }
                                expanded
                                expandedElement={
                                    <CollapsibleSidebarMenuItem
                                        as={Link}
                                        content={menuItemContent}
                                        icon={<CheckmarkBadge16 height={20} width={20} />}
                                        text="Really really long synced link name synced Link"
                                    />
                                }
                                tooltipMessage="Synced Link"
                            />
                        </li>
                        <li key="djb-leftnav-menu-item-all-trash">
                            <CollapsibleSidebarItem
                                collapsedElement={
                                    <CollapsibleSidebarMenuItem
                                        as={Link}
                                        href="/"
                                        icon={<Trash16 height={20} width={20} />}
                                    />
                                }
                                expanded
                                expandedElement={
                                    <CollapsibleSidebarMenuItem
                                        as={Link}
                                        href="/"
                                        icon={<Trash16 height={20} width={20} />}
                                        text="Really really long trash link name Trash Link"
                                    />
                                }
                                tooltipMessage="Trash Link"
                            />
                        </li>
                        <li key="djb-leftnav-menu-item-all-file-overflow">
                            <CollapsibleSidebarItem
                                collapsedElement={
                                    <CollapsibleSidebarMenuItem
                                        as={Link}
                                        href="/"
                                        icon={<Folder16 height={20} width={20} />}
                                    />
                                }
                                expanded
                                expandedElement={
                                    <CollapsibleSidebarMenuItem
                                        as={Link}
                                        href="/"
                                        icon={<Folder16 height={20} width={20} />}
                                        overflowAction={
                                            <Link href="/">
                                                <IconPlusRound color="white" />
                                            </Link>
                                        }
                                        text="Overflow"
                                    />
                                }
                                tooltipMessage="Overflow Link"
                            />
                        </li>
                        <li key="djb-leftnav-menu-item-all-file-overflow-long">
                            <CollapsibleSidebarItem
                                collapsedElement={
                                    <CollapsibleSidebarMenuItem
                                        as={Link}
                                        href="/"
                                        icon={<Folder16 height={20} width={20} />}
                                    />
                                }
                                expanded
                                expandedElement={
                                    <CollapsibleSidebarMenuItem
                                        as={Link}
                                        href="/"
                                        icon={<Folder16 height={20} width={20} />}
                                        overflowAction={
                                            <Link href="/">
                                                <IconPlusRound color="white" />
                                            </Link>
                                        }
                                        text="Really really long overflow action name Overflow"
                                    />
                                }
                                tooltipMessage="Overflow Long Link"
                            />
                        </li>
                        <li key="djb-leftnav-menu-item-all-file-overflow-hover">
                            <CollapsibleSidebarItem
                                collapsedElement={
                                    <CollapsibleSidebarMenuItem
                                        as={Link}
                                        href="/"
                                        icon={<Folder16 height={20} width={20} />}
                                    />
                                }
                                expanded
                                expandedElement={
                                    <CollapsibleSidebarMenuItem
                                        as={Link}
                                        href="/"
                                        icon={<Folder16 height={20} width={20} />}
                                        overflowAction={
                                            <Link href="/">
                                                <IconPlusRound color="white" />
                                            </Link>
                                        }
                                        showOverflowAction="hover"
                                        text="Overflow Hover"
                                    />
                                }
                                tooltipMessage="Overflow Hover Link"
                            />
                        </li>
                        <li key="djb-leftnav-menu-item-all-file-overflow-hover-long">
                            <CollapsibleSidebarItem
                                collapsedElement={
                                    <CollapsibleSidebarMenuItem
                                        as={Link}
                                        href="/"
                                        icon={<Folder16 height={20} width={20} />}
                                    />
                                }
                                expanded
                                expandedElement={
                                    <CollapsibleSidebarMenuItem
                                        as={Link}
                                        href="/"
                                        icon={<Folder16 height={20} width={20} />}
                                        overflowAction={
                                            <Link href="/">
                                                <IconPlusRound color="white" />
                                            </Link>
                                        }
                                        showOverflowAction="hover"
                                        text="Really really long overflow action name Overflow Hover"
                                    />
                                }
                                tooltipMessage="Overflow Hover Long Link"
                            />
                        </li>
                        <li key="djb-leftnav-menu-item-all-file-disabled-tooltip">
                            <CollapsibleSidebarItem
                                collapsedElement={
                                    <CollapsibleSidebarMenuItem
                                        as={Link}
                                        href="/"
                                        shouldHideTooltip
                                        icon={<Folder16 height={20} width={20} />}
                                    />
                                }
                                expanded
                                expandedElement={
                                    <CollapsibleSidebarMenuItem
                                        as={Link}
                                        href="/"
                                        shouldHideTooltip
                                        icon={<Folder16 height={20} width={20} />}
                                        overflowAction={
                                            <Link href="/">
                                                <IconPlusRound color="white" />
                                            </Link>
                                        }
                                        showOverflowAction="hover"
                                        text="Should Hide Tooltip"
                                    />
                                }
                                tooltipMessage=""
                            />
                        </li>
                        {renderFiles()}
                    </ul>
                </CollapsibleSidebarNav>
                <CollapsibleSidebarFooter>
                    <ul>
                        <li key="djb-leftnav-menu-item-all-files">
                            <CollapsibleSidebarItem
                                collapsedElement={
                                    <CollapsibleSidebarMenuItem as={Link} icon={<Code16 height={20} width={20} />} />
                                }
                                expanded
                                expandedElement={
                                    <CollapsibleSidebarMenuItem
                                        as={Link}
                                        icon={<Code16 height={20} width={20} />}
                                        text="Developer Console super duper long"
                                    />
                                }
                                tooltipMessage="Developer Console Link supder duper long"
                            />
                        </li>
                    </ul>
                </CollapsibleSidebarFooter>
            </CollapsibleSidebar>
        </ThemeProvider>
    );
};

basic.story = {
    name: 'Basic Usage',
};

export default {
    title: 'Features/CollapsibleSidebar',
    component: CollapsibleSidebar,
    parameters: {
        notes,
    },
};
