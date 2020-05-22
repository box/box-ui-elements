// @flow
import * as React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

import { injectIntl } from 'react-intl';
import type { InjectIntlProvidedProps } from 'react-intl';
import Logo from '../../icon/logo/BoxLogo';
import PlainButton from '../../components/plain-button/PlainButton';
import LinkBase from '../../components/link/LinkBase';
import IconHamburger from '../../icons/general/IconHamburger';

import CollapsibleSidebarItem from './CollapsibleSidebarItem';
import './CollapsibleSidebarLogo.scss';

import messages from './messages';

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
    /** optional badge to be displayed next to logo */
    badge?: React.Node,

    /** Additional classes */
    className?: string,

    /** Controls whether or not the sidebar is expanded on the page */
    expanded: boolean,

    /** Optional HTML attributes to append to logo */
    linkHtmlAttributes?: Object,

    linkUrl?: string,

    onToggle: () => void,

    resinTarget: string,
} & InjectIntlProvidedProps;

function CollapsibleSidebarLogo(props: Props) {
    const { badge, className, expanded, linkHtmlAttributes, linkUrl = '/', onToggle, resinTarget, intl } = props;

    const classes = classNames('bdl-CollapsibleSidebar-logo', className);

    const toggleButton = (
        <PlainButton
            className="bdl-CollapsibleSidebar-toggleButton"
            onClick={onToggle}
            aria-label={intl.formatMessage(expanded ? messages.collapseButtonLabel : messages.expandButtonLabel)}
        >
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
                        <LinkBase data-resin-target={resinTarget} href={linkUrl} {...linkHtmlAttributes}>
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

export default injectIntl(CollapsibleSidebarLogo);
