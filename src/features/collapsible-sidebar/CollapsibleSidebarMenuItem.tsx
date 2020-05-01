/**
 * A sidebar component that supports collapsed/expanded state for responsive sizing.
 * This component should be moved into BUIE when complete.
 * This component should NOT contain any reference to EUA specific patterns like Immutables and redux containers.
 */

import * as React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import Tooltip, { TooltipPosition } from '../../components/tooltip';
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

const StyledMenuItemLabel = styled.span`
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
    className?: string;
    icon?: React.ReactNode;
    overflowAction?: React.ReactNode;
    text?: string;
};
function CollapsibleSidebarMenuItem(props: Props) {
    const { className, icon, overflowAction, text, ...rest } = props;
    const textRef = React.useRef<HTMLElement>(null);
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
            position={TooltipPosition.MIDDLE_RIGHT}
            text={text}
        >
            {renderMenuItem()}
        </Tooltip>
    );
}

export default CollapsibleSidebarMenuItem;
