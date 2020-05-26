// @flow
import * as React from 'react';

import { ThemeProvider } from 'styled-components';
import { boolean, color } from '@storybook/addon-knobs';
import noop from 'lodash/noop';

// eslint-disable-next-line import/named
import { createTheme } from '../../utils/createTheme';

import CollapsibleSidebar from './CollapsibleSidebar';
import CollapsibleSidebarLogo from './CollapsibleSidebarLogo';
import CollapsibleSidebarFooter from './CollapsibleSidebarFooter';
import CollapsibleSidebarNav from './CollapsibleSidebarNav';
import CollapsibleSidebarItem from './CollapsibleSidebarItem';
import CollapsibleSidebarMenuItem, { StyledMenuItemLabel } from './CollapsibleSidebarMenuItem';
import notes from './CollapsibleSidebar.stories.md';

import { BetaBadge, TrialBadge } from '../../components/badge';

import Folder16 from '../../icon/fill/Folder16';
import ClockBadge16 from '../../icon/fill/ClockBadge16';
import Code16 from '../../icon/fill/Code16';
import Trash16 from '../../icon/fill/Trash16';
import FileDefault16 from '../../icon/fill/FileDefault16';
import CheckmarkBadge16 from '../../icon/fill/CheckmarkBadge16';

const renderFiles = () => {
    const items = [];
    for (let i = 0; i < 10; i += 1) {
        items.push(
            <li key={`djb-leftnav-menu-item-all-file-${i}`}>
                <a href="/">
                    <CollapsibleSidebarItem
                        collapsedElement={
                            <CollapsibleSidebarMenuItem icon={<FileDefault16 height={20} width={20} />} />
                        }
                        expanded={boolean('isExpanded', true)}
                        expandedElement={
                            <CollapsibleSidebarMenuItem
                                icon={<FileDefault16 height={20} width={20} />}
                                text={`File ${i}`}
                            />
                        }
                        tooltipMessage="File Link"
                    />
                </a>
            </li>,
        );
    }
    return items;
};

export const basic = () => {
    const hexColor = color('Theme Color', '#0061d5');
    const theme = createTheme(hexColor);
    const linkProps = {
        href: '/?path=/story/components-tooltip--top-center',
        'data-resin-target': 'resinTarget',
    };

    const menuItemContent = (
        <>
            <StyledMenuItemLabel
                style={{
                    marginLeft: 16,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    opacity: 0.85,
                }}
            >
                Synced
            </StyledMenuItemLabel>
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
            <CollapsibleSidebar expanded={boolean('isExpanded', true)}>
                <CollapsibleSidebarLogo
                    canEndTrial={false}
                    linkProps={linkProps}
                    onToggle={noop}
                    expanded={boolean('isExpanded', true)}
                />
                <CollapsibleSidebarNav>
                    <ul>
                        <li key="djb-leftnav-menu-item-all-files">
                            <a href="/" className="is-currentPage">
                                <CollapsibleSidebarItem
                                    collapsedElement={
                                        <CollapsibleSidebarMenuItem icon={<Folder16 height={20} width={20} />} />
                                    }
                                    expanded={boolean('isExpanded', true)}
                                    expandedElement={
                                        <CollapsibleSidebarMenuItem
                                            icon={<Folder16 height={20} width={20} />}
                                            text="All Files"
                                        />
                                    }
                                    tooltipMessage="All Files Link"
                                />
                            </a>
                        </li>
                        <li key="djb-leftnav-menu-item-all-recents">
                            <a href="/">
                                <CollapsibleSidebarItem
                                    collapsedElement={
                                        <CollapsibleSidebarMenuItem icon={<Folder16 height={20} width={20} />} />
                                    }
                                    expanded={boolean('isExpanded', true)}
                                    expandedElement={
                                        <CollapsibleSidebarMenuItem
                                            icon={<ClockBadge16 height={20} width={20} />}
                                            text="Recents"
                                        />
                                    }
                                    tooltipMessage="Recents Link"
                                />
                            </a>
                        </li>
                        <li key="djb-leftnav-menu-item-synced">
                            <a href="/">
                                <CollapsibleSidebarItem
                                    collapsedElement={
                                        <CollapsibleSidebarMenuItem
                                            icon={<CheckmarkBadge16 height={20} width={20} />}
                                        />
                                    }
                                    expanded={boolean('isExpanded', true)}
                                    expandedElement={
                                        <CollapsibleSidebarMenuItem
                                            content={menuItemContent}
                                            icon={<Folder16 height={20} width={20} />}
                                        />
                                    }
                                    tooltipMessage="All Files Link"
                                />
                            </a>
                        </li>
                        <li key="djb-leftnav-menu-item-all-trash">
                            <a href="/">
                                <CollapsibleSidebarItem
                                    collapsedElement={
                                        <CollapsibleSidebarMenuItem icon={<Trash16 height={20} width={20} />} />
                                    }
                                    expanded={boolean('isExpanded', true)}
                                    expandedElement={
                                        <CollapsibleSidebarMenuItem
                                            icon={<Trash16 height={20} width={20} />}
                                            text="Really really long trash link name Trash Link"
                                        />
                                    }
                                    tooltipMessage="Trash Link"
                                />
                            </a>
                        </li>
                        {renderFiles()}
                    </ul>
                </CollapsibleSidebarNav>
                <CollapsibleSidebarFooter>
                    <ul>
                        <li key="djb-leftnav-menu-item-all-files">
                            <CollapsibleSidebarItem
                                collapsedElement={
                                    <CollapsibleSidebarMenuItem icon={<Code16 height={20} width={20} />} />
                                }
                                expanded={boolean('isExpanded', true)}
                                expandedElement={
                                    <CollapsibleSidebarMenuItem
                                        icon={<Code16 height={20} width={20} />}
                                        text="Developer Console"
                                    />
                                }
                                tooltipMessage="Developer Console Link"
                            />
                        </li>
                    </ul>
                </CollapsibleSidebarFooter>
            </CollapsibleSidebar>
        </ThemeProvider>
    );
};

basic.story = {
    name: 'Top-left, basic',
};

export default {
    title: 'Components|CollapsibleSidebar',
    component: CollapsibleSidebar,
    parameters: {
        notes,
    },
};
