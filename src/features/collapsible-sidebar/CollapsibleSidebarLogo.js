// @flow
import * as React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

import Logo from '../../icon/logo/BoxLogo';
import PlainButton from '../../components/plain-button/PlainButton';
import LinkBase from '../../components/link/LinkBase';
import IconHamburger from '../../icons/general/IconHamburger';

import CollapsibleSidebarItem from './CollapsibleSidebarItem';
import './CollapsibleSidebarLogo.scss';

const StyledLogo = styled(Logo)`
    & path,
    & .fill-color {
        fill: ${props => props.theme.primary.foreground};
    }
`;

const StyledIconHamburger = styled(IconHamburger)`
    & .fill-color {
        fill: ${props => props.theme.primary.foreground};
    }
`;

type Props = {
    badge?: React.Node,

    /** Flag for trial users */
    canEndTrial: boolean,

    /** Additional classes */
    className?: string,

    /** Controls whether or not the sidebar is expanded on the page */
    expanded: boolean,

    onToggle: () => void,

    resinTarget: string,
};

function CollapsibleSidebarLogo(props: Props) {
    const { badge, className, expanded, onToggle, resinTarget } = props;

    const classes = classNames('bdl-CollapsibleSidebar-logo', className);

    const toggleButton = (
        <PlainButton className="bdl-CollapsibleSidebar-toggleButton" onClick={onToggle}>
            <StyledIconHamburger height={20} width={20} />
        </PlainButton>
    );

    return (
        <div className={classes}>
            <CollapsibleSidebarItem
                collapsedElement={toggleButton}
                expanded={expanded}
                expandedElement={
                    <>
                        {toggleButton}
                        <LinkBase data-resin-target={resinTarget} href="/">
                            <>
                                <StyledLogo className="bdl-CollapsibleSidebar-logoIcon" height={32} width={61} />
                                {badge}
                            </>
                        </LinkBase>
                    </>
                }
            />
        </div>
    );
}

export default CollapsibleSidebarLogo;
