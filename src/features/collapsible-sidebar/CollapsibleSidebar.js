/**
 * @flow
 * @file Sidebar component that supports rendering different elements based on expand/collapse state
 * @author Box
 *
 * A sidebar component that supports collapsed/expanded state and responsive sizing.
 */

import * as React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import tabbable from 'tabbable';

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

class CollapsibleSidebar extends React.Component<Props> {
    navRef: { current: null | HTMLElement } = React.createRef();

    focusNextEl = () => {
        if (this.navRef.current) {
            const tabbableEls = tabbable(this.navRef.current);
            const currentElIndex = tabbableEls.findIndex(el => el === document.activeElement);
            const nextElIndex = currentElIndex === tabbableEls.length - 1 ? 0 : currentElIndex + 1;
            tabbableEls[nextElIndex].focus();
        }
    };

    focusPreviousEl = () => {
        if (this.navRef.current) {
            const tabbableEls = tabbable(this.navRef.current);
            const currentElIndex = tabbableEls.findIndex(el => el === document.activeElement);
            const prevElIndex = currentElIndex === 0 ? tabbableEls.length - 1 : currentElIndex - 1;
            tabbableEls[prevElIndex].focus();
        }
    };

    handleKeyDown = (event: SyntheticKeyboardEvent<>) => {
        if (this.navRef.current && this.navRef.current.contains(document.activeElement)) {
            switch (event.key) {
                case 'ArrowDown':
                    event.stopPropagation();
                    event.preventDefault();
                    this.focusNextEl();
                    break;

                case 'ArrowUp':
                    event.stopPropagation();
                    event.preventDefault();
                    this.focusPreviousEl();
                    break;

                default:
                    break;
            }
        }
    };

    render() {
        const { children, className, expanded, htmlAttributes } = this.props;
        const classes = classNames(
            {
                'is-expanded': expanded,
            },
            'bdl-CollapsibleSidebar',
            className,
        );

        return (
            <aside className="bdl-CollapsibleSidebar-wrapper" {...htmlAttributes}>
                <StyledNav ref={this.navRef} className={classes} onKeyDown={this.handleKeyDown}>
                    {children}
                </StyledNav>
            </aside>
        );
    }
}

export default CollapsibleSidebar;
