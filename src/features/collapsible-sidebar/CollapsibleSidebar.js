/**
 * @flow
 * @file Sidebar component that supports rendering different elements based on expand/collapse state
 * @author Box
 *
 * A sidebar component that supports collapsed/expanded state for responsive sizing.
 * This component should be moved into BUIE when complete.
 * This component should NOT contain any reference to EUA specific patterns like Immutables and redux containers.
 */

import * as React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

import './CollapsibleSidebar.scss';

const StyledNav = styled.nav`
    background-color: ${props => props.theme.primary.background};
    border-right: 1px solid ${props => props.theme.primary.border};
    color: ${props => props.theme.primary.foreground};

    .crawler > div {
        background-color: ${props => props.theme.primary.foreground};
    }
`;

type Props = {
    /** Primary content */
    children?: React.Node,

    /** Additional classes */
    className?: string,

    /** Controls whether or not the sidebar is expanded on the page */
    expanded?: boolean,

    /** Optional HTML attributes to append to menu item */
    htmlAttributes?: Object,
};

const CollapsibleSidebar = (props: Props = { expanded: false }) => {
    const { children, className, expanded, htmlAttributes } = props;

    const classes = classNames(
        {
            'is-expanded': expanded,
        },
        'bdl-CollapsibleSidebar',
        className,
    );

    return (
        <aside className="bdl-CollapsibleSidebar-wrapper" {...htmlAttributes}>
            <StyledNav className={classes}>{children}</StyledNav>
        </aside>
    );
};

export default CollapsibleSidebar;
