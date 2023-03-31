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
import { KEYS } from '../../constants';

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

    /** Optionally apply "aria-hidden": "true" to CollapsibleSidebar wrapper */
    isHidden?: boolean,

    /** Optionally apply CSS to the CollapsibleSidebar wrapper */
    wrapperClassName?: string,
};

class CollapsibleSidebar extends React.Component<Props> {
    navRef: { current: null | HTMLElement } = React.createRef();

    static defaultProps = {
        expanded: false,
    };

    focusEl = (direction: 'down' | 'up') => {
        if (this.navRef.current) {
            const tabbableEls = tabbable(this.navRef.current);
            const currentElIndex = tabbableEls.findIndex(el => el === document.activeElement);
            let index;
            if (direction === 'down') {
                index = currentElIndex === tabbableEls.length - 1 ? 0 : currentElIndex + 1;
            } else {
                index = currentElIndex === 0 ? tabbableEls.length - 1 : currentElIndex - 1;
            }
            tabbableEls[index].focus();
        }
    };

    handleKeyDown = (event: SyntheticKeyboardEvent<>) => {
        if (this.navRef.current && this.navRef.current.contains(document.activeElement)) {
            switch (event.key) {
                case KEYS.arrowDown:
                    event.stopPropagation();
                    event.preventDefault();
                    this.focusEl('down');
                    break;

                case KEYS.arrowUp:
                    event.stopPropagation();
                    event.preventDefault();
                    this.focusEl('up');
                    break;

                default:
                    break;
            }
        }
    };

    render() {
        const { children, className, expanded, isHidden, htmlAttributes, wrapperClassName } = this.props;
        const navClasses = classNames(
            {
                'is-expanded': expanded,
            },
            'bdl-CollapsibleSidebar',
            className,
        );
        const ariaAttributes = { 'aria-hidden': isHidden ? 'true' : undefined };
        return (
            <div
                className={classNames('bdl-CollapsibleSidebar-wrapper', wrapperClassName)}
                {...htmlAttributes}
                {...ariaAttributes}
                data-testid="CollapsibleSidebar-wrapper"
            >
                <StyledNav ref={this.navRef} className={navClasses} onKeyDown={this.handleKeyDown}>
                    {children}
                </StyledNav>
            </div>
        );
    }
}

export default CollapsibleSidebar;
