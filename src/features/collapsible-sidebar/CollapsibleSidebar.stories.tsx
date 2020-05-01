import * as React from 'react';

import styled, { ThemeProvider } from 'styled-components';
import { boolean } from '@storybook/addon-knobs';
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

import Folder16 from '../../icon/fill/Folder16';
import ClockBadge16 from '../../icon/fill/ClockBadge16';
import Code16 from '../../icon/fill/Code16';

const hexColor = '#123456';
const theme = createTheme(hexColor);

export const basic = () => (
    <ThemeProvider theme={theme}>
        <CollapsibleSidebar expanded={boolean('isExpanded', true)}>
            <CollapsibleSidebarLogo
                canEndTrial={false}
                onToggle={noop}
                expanded={boolean('isExpanded', true)}
                resinTarget="test-resin"
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
                    <li key="djb-leftnav-menu-item-all-files">
                        <CollapsibleSidebarItem
                            collapsedElement={<CollapsibleSidebarMenuItem icon={<Folder16 height={20} width={20} />} />}
                            expanded={boolean('isExpanded', true)}
                            expandedElement={
                                <CollapsibleSidebarMenuItem
                                    icon={<ClockBadge16 height={20} width={20} />}
                                    text="Recents"
                                />
                            }
                            tooltipMessage="Recents Link"
                        />
                    </li>
                </ul>
            </CollapsibleSidebarNav>
            <CollapsibleSidebarFooter>
                <ul>
                    <li key="djb-leftnav-menu-item-all-files">
                        <CollapsibleSidebarItem
                            collapsedElement={<CollapsibleSidebarMenuItem icon={<Code16 height={20} width={20} />} />}
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
