import * as React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

type Props = {
    /** Additional classes */
    children?: React.ReactNode;

    /** children components */
    className?: string;
};

const StyledFooter = styled.div`
    & .bdl-CollapsibleSidebar-menuItem {
        background-color: ${props => props.theme.primary.backgroundHover};
    }

    & a:hover .bdl-CollapsibleSidebar-menuItem,
    & a:hover:not(.is-currentPage) .bdl-CollapsibleSidebar-menuItem {
        background-color: ${props => props.theme.primary.backgroundActive};
        color: ${props => props.theme.primary.foreground};
    }

    .is-currentPage & .bdl-CollapsibleSidebar-menuItem,
    & .bdl-CollapsibleSidebar-menuItem:active {
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
