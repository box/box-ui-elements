// @flow
import * as React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

type Props = {
    /** Additional classes */
    children?: React.Node,

    /** children components */
    className?: string,
};

const StyledFooter = styled.div`
    & .bdl-CollapsibleSidebar-menuItemLink {
        background-color: ${props => props.theme.primary.backgroundHover};
    }

    & .bdl-CollapsibleSidebar-menuItem:hover .bdl-CollapsibleSidebar-menuItemLink,
    & .bdl-CollapsibleSidebar-menuItem:hover:not(.is-currentPage) .bdl-CollapsibleSidebar-menuItemLink {
        background-color: ${props => props.theme.primary.backgroundActive};
        color: ${props => props.theme.primary.foreground};
    }

    .is-currentPage & .bdl-CollapsibleSidebar-menuItemLink,
    & .bdl-CollapsibleSidebar-menuItemLink:active {
        background-color: ${props => props.theme.primary.backgroundActive};
        color: ${props => props.theme.primary.foreground};
    }
`;

function CollapsibleSidebarFooter(props: Props) {
    const { className, children } = props;

    const classes = classNames('bdl-CollapsibleSidebar-footer', className);

    return <StyledFooter className={classes}>{children}</StyledFooter>;
}

export default CollapsibleSidebarFooter;
