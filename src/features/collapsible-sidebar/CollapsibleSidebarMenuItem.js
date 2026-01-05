// @flow strict
import * as React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import Tooltip from '../../components/tooltip';
import { useIsContentOverflowed } from '../../utils/dom';
import CollapsibleSidebarContext from './CollapsibleSidebarContext';

const StyledMenuItem = styled.div`
    position: relative;

    /* hover styles for link so that hovering both action icon and link
    will have hover effect over whole container */
    &:hover a {
        background-color: ${({ theme }) => theme.primary.backgroundHover};
    }

    &:hover a.is-currentPage {
        background-color: ${({ theme }) => theme.primary.backgroundActive};
    }

    body.is-move-dragging & a:hover {
        /* if an item is being dragged to left nav, keep menu item defaults (don't highlight) */
        background-color: ${({ theme }) => theme.primary.background};

        .bdl-CollapsibleSidebar-menuItemIcon {
            opacity: 0.7;
        }
    }

    .bdl-CollapsibleSidebar-menuItemActionContainer {
        position: absolute;
        top: 12px;
        right: 8px;
        padding: 0;
        opacity: 0;

        &:hover,
        &:focus-within {
            opacity: 1;
        }
    }
`;

const StyledIconWrapper = styled.span`
    line-height: 0; /* let inner svg set the height */
    opacity: 0.7;

    & path,
    & .fill-color {
        fill: ${({ theme }) => theme.primary.foreground};
    }

    a:active &,
    a:hover &,
    a:focus &,
    a.is-currentPage & {
        opacity: 1;
    }
`;

const StyledMenuItemLabel = styled.span`
    flex-grow: 1;
    overflow: hidden;
    color: ${({ theme }) => theme.primary.foreground};
    text-overflow: ellipsis;
    opacity: 0.85;

    &.overflow-action {
        margin-right: 12px;
    }

    a:active &,
    a:hover &,
    a:focus &,
    a.is-currentPage & {
        opacity: 1;
    }
`;

// {...rest} props will go here, such as `as` prop to adjust the component name.
// In most cases the consumer will want the tag to use a `Link` instead of `a`.
const StyledLink = styled.a`
    display: flex;
    align-items: center;
    height: ${({ theme }) => theme.base.gridUnitPx * 10}px;
    padding: 0 ${({ theme }) => theme.base.gridUnitPx * 3}px;
    overflow-x: hidden;
    color: ${({ theme }) => theme.primary.foreground};
    font-weight: bold;
    white-space: nowrap;
    border: 1px solid transparent;
    border-radius: ${({ theme }) => theme.base.gridUnitPx * 2}px;
    transition: background-color 0.15s cubic-bezier(0.215, 0.61, 0.355, 1);

    &:hover,
    &:active,
    &:focus,
    &.is-currentPage {
        .bdl-CollapsibleSidebar-menuItemIcon,
        .bdl-CollapsibleSidebar-menuItemLabel {
            opacity: 1;
        }
    }

    &:focus {
        border-color: ${({ theme }) => theme.primary.foreground};
        outline: none;
    }

    &:focus:active {
        border-color: transparent;
    }

    &.is-currentPage {
        background-color: ${({ theme }) => theme.primary.backgroundActive};
    }

    &.is-currentPage:active {
        border-color: ${({ theme }) => theme.primary.foreground};
    }

    .bdl-CollapsibleSidebar-menuItemIcon + .bdl-CollapsibleSidebar-menuItemLabel {
        margin-left: 16px;
    }

    &.show-overflowAction + .bdl-CollapsibleSidebar-menuItemActionContainer,
    &:focus + .bdl-CollapsibleSidebar-menuItemActionContainer,
    &:hover + .bdl-CollapsibleSidebar-menuItemActionContainer {
        opacity: 1;
    }
`;

type Props = {
    /** Additional classes */
    className?: string,
    /** Content to be  displayed next to item label. */
    content?: React.Node,
    icon?: React.Node,
    linkClassName?: string,
    overflowAction?: React.Node,
    shouldHideTooltip?: boolean,
    /** Default is to always show */
    showOverflowAction?: 'hover' | 'always',
    text?: string,
};

function CollapsibleSidebarMenuItem(props: Props) {
    const {
        className,
        content,
        icon,
        linkClassName,
        overflowAction,
        showOverflowAction,
        text,
        shouldHideTooltip = false,
        ...rest
    } = props;
    const textRef: { current: null | HTMLElement } = React.useRef(null);
    const isTextOverflowed = useIsContentOverflowed(textRef);
    const { isScrolling } = React.useContext(CollapsibleSidebarContext);
    const isShowOverflowActionOnHover = showOverflowAction === 'hover';
    const menuItemClassName = classNames('bdl-CollapsibleSidebar-menuItem', className);
    const menuItemLinkClassName = classNames('bdl-CollapsibleSidebar-menuItemLink', linkClassName, {
        'show-overflowAction': !isShowOverflowActionOnHover,
    });
    const menuItemLabelClassName = classNames('bdl-CollapsibleSidebar-menuItemLabel', {
        'overflow-action': overflowAction,
    });

    const renderMenuItem = () => {
        return (
            <StyledMenuItem className={menuItemClassName}>
                <StyledLink className={menuItemLinkClassName} {...rest}>
                    {icon && (
                        <StyledIconWrapper className="bdl-CollapsibleSidebar-menuItemIcon">{icon}</StyledIconWrapper>
                    )}
                    {text && (
                        <StyledMenuItemLabel ref={textRef} className={menuItemLabelClassName}>
                            {text}
                        </StyledMenuItemLabel>
                    )}
                    {content}
                </StyledLink>
                {overflowAction && (
                    <span className="bdl-CollapsibleSidebar-menuItemActionContainer">{overflowAction}</span>
                )}
            </StyledMenuItem>
        );
    };

    if (isScrolling) {
        return renderMenuItem();
    }

    return (
        <Tooltip
            className={classNames('bdl-CollapsibleSidebar-menuItemTooltip')}
            targetWrapperClassName="bdl-CollapsibleSidebar-menuItemTooltipTarget"
            isDisabled={!isTextOverflowed}
            isShown={isScrolling || shouldHideTooltip ? false : undefined}
            isTabbable={false}
            position="middle-right"
            text={text}
        >
            {renderMenuItem()}
        </Tooltip>
    );
}

export default CollapsibleSidebarMenuItem;
