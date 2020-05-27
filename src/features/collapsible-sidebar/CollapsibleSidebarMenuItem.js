/**
 * @flow
 * @file Menu item with styles to be used for CollapsibleSidebar
 * @author Box
 *
 * Menu item with styles to be used for CollapsibleSidebar.
 * Will render different variations of icon and text based on props.
 */

import * as React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import Tooltip from '../../components/tooltip';
import { useIsContentOverflowed } from '../../utils/dom';
import CollapsibleSidebarContext from './CollapsibleSidebarContext';

import './CollapsibleSidebarMenuItem.scss';

const StyledMenuItem = styled.div`
    border: 1px solid transparent;
    color: ${props => props.theme.primary.foreground};

    a:hover:not(.is-currentPage) & {
        background-color: ${props => props.theme.primary.backgroundHover};
    }

    body.is-move-dragging a:hover & {
        // if an item is being dragged to left nav, keep menu item defaults (don't highlight)
        background-color: ${props => props.theme.primary.background};
    }

    a:focus & {
        border-color: ${props => props.theme.primary.foreground};
    }

    a:focus:active & {
        border-color: transparent;
    }

    a.is-currentPage & {
        background-color: ${props => props.theme.primary.backgroundActive};
    }

    a.is-currentPage:active & {
        border-color: ${props => props.theme.primary.foreground};
    }
`;

const StyledIconWrapper = styled.span`
    & path,
    & .fill-color {
        fill: ${props => props.theme.primary.foreground};
    }

    a:active &,
    a:hover &,
    a:focus &,
    a.is-currentPage & {
        opacity: 1;
    }
`;

export const StyledMenuItemLabel = styled.span`
    color: ${props => props.theme.primary.foreground};

    a:active &,
    a:hover &,
    a:focus &,
    a.is-currentPage & {
        opacity: 1;
    }
`;

type Props = {
    /** Additional classes */
    className?: string,
    /**
     * Custom menu item content. If passed in and "text" is not specified, component will render this content
     *
     * Required if "text" is not specified
     */
    content?: React.Node,
    icon?: React.Node,
    overflowAction?: React.Node,
    /**
     * Menu item label. If passed in, component will render the label irrespective of the presence of "content"
     *
     * Required if "content" is not specified
     */
    text?: string,
};

function CollapsibleSidebarMenuItem(props: Props) {
    const { className, content, icon, overflowAction, text, ...rest } = props;
    const textRef = React.useRef<?HTMLElement>(null);
    const isTextOverflowed = useIsContentOverflowed(textRef);
    const { isScrolling } = React.useContext(CollapsibleSidebarContext);

    const renderMenuItem = () => {
        return (
            <StyledMenuItem className={classNames('bdl-CollapsibleSidebar-menuItem', className)} {...rest}>
                {icon && <StyledIconWrapper className="bdl-CollapsibleSidebar-menuItemIcon">{icon}</StyledIconWrapper>}
                {text && (
                    <StyledMenuItemLabel ref={textRef} className="bdl-CollapsibleSidebar-menuItemLabel">
                        {text}
                    </StyledMenuItemLabel>
                )}
                {!text && content}
                {overflowAction}
            </StyledMenuItem>
        );
    };

    if (isScrolling) {
        return renderMenuItem();
    }

    return (
        <Tooltip
            className={classNames('bdl-CollapsibleSidebar-menuItemToolTip')}
            isDisabled={!isTextOverflowed}
            isShown={isScrolling ? false : undefined}
            isTabbable={false}
            position="middle-right"
            text={text}
        >
            {renderMenuItem()}
        </Tooltip>
    );
}

export default CollapsibleSidebarMenuItem;
