/* eslint-disable */
import * as React from 'react';
import { action } from 'storybook/actions';
import NavSidebar from './NavSidebar';
import NavListCollapseHeader from './NavListCollapseHeader';
import NavList from './NavList';
import Link from '../link/Link';

import notes from './NavSidebar.stories.md';

export const notCollapsible = () => (
    <NavSidebar data-resin-component="leftnav">
        <NavList>
            <Link>Item 1-1</Link>
            <Link>Item 1-2</Link>
        </NavList>
        <NavList heading="Item 2">
            <Link>Item 2-1</Link>
            <Link>Item 2-2</Link>
            <Link>Item 2-3</Link>
        </NavList>
    </NavSidebar>
);

export const collapsible = () => (
    <NavSidebar data-resin-component="leftnav">
        <NavList
            heading={
                <NavListCollapseHeader onToggleCollapse={action('onToggleCollapse called')}>
                    Collapse or Expand
                </NavListCollapseHeader>
            }
            className="is-collapsible"
            collapsed={false}
        >
            <Link>Item 1-1</Link>
            <Link>Item 1-2</Link>
        </NavList>
        <NavList heading="Item 2">
            <Link>Item 2-1</Link>
            <Link>Item 2-2</Link>
            <Link>Item 2-3</Link>
        </NavList>
    </NavSidebar>
);

export default {
    title: 'Components/NavSidebar',
    component: NavSidebar,
    parameters: {
        notes,
    },
};
