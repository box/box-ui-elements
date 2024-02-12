// @flow
import * as React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { bdlGridUnit, bdlBorderRadiusSizeLarge } from '../../styles/variables';
import Logo from '../../icon/logo/BoxLogo';
import PlainButton from '../../components/plain-button/PlainButton';
import LinkBase from '../../components/link/LinkBase';
import IconHamburger from '../../icons/general/IconHamburger';

import CollapsibleSidebarItem from './CollapsibleSidebarItem';

import messages from './messages';

const StyledLogo = styled(Logo)`
    padding: ${bdlGridUnit};
    border: 1px solid transparent;
    border-radius: ${bdlBorderRadiusSizeLarge};

    & path,
    & .fill-color {
        fill: ${props => props.theme?.primary?.foreground};
    }

    a:focus & {
        /* since root navlink is focusable, give logo some kind of focus state */
        border-color: ${props => props.theme?.primary?.foreground};
        outline: none;
    }
`;

const StyledIconHamburger = styled(IconHamburger)`
    position: relative;
    top: 1px; /* svg alignment */
    & .fill-color {
        fill: ${props => props.theme.primary.foreground};
    }
`;

const StyledToggleButton = styled(PlainButton)`
    /* override .btn-plain's overzealous pseudoelement styling */
    &,
    &:focus,
    &:active,
    &:hover {
        padding: 8px 12px; /* we don't have unitless variables to multiply in JS yet */
        line-height: 1;
        border-color: transparent;
        border-style: solid;
        border-width: 1px;
        border-radius: ${bdlBorderRadiusSizeLarge};
    }

    &:focus {
        border-color: ${props => props?.theme?.primary?.foreground};
        outline: none;
    }
`;

type Props = {
    /** optional badge to be displayed next to logo */
    badge?: React.Node,

    buttonProps?: Object,

    /** Additional classes */
    className?: string,

    /** Controls whether or not the sidebar is expanded on the page */
    expanded: boolean,

    intl: IntlShape,

    isLogoVisible?: boolean,

    linkProps: Object,

    onToggle: () => void,
};

function CollapsibleSidebarLogo(props: Props) {
    const { badge, buttonProps, className, expanded, isLogoVisible = true, linkProps, onToggle, intl } = props;

    const classes = classNames('bdl-CollapsibleSidebar-logo', className);

    const toggleButton = (
        <StyledToggleButton
            className="bdl-CollapsibleSidebar-toggleButton"
            onClick={onToggle}
            aria-label={intl.formatMessage(expanded ? messages.collapseButtonLabel : messages.expandButtonLabel)}
            type="button"
            {...buttonProps}
        >
            <StyledIconHamburger height={20} width={20} />
        </StyledToggleButton>
    );

    return (
        <div className={classes}>
            <CollapsibleSidebarItem
                collapsedElement={toggleButton}
                expanded={expanded}
                expandedElement={
                    <>
                        {toggleButton}
                        {isLogoVisible && (
                            <LinkBase className="bdl-CollapsibleSidebar-logoLink" {...linkProps}>
                                <>
                                    <StyledLogo
                                        className="bdl-CollapsibleSidebar-logoIcon"
                                        height={32 + 2 * 1 /* border */ + 2 * 4 /* padding */}
                                        width={61 + 2 * 1 /* border */ + 2 * 4 /* padding */}
                                    />
                                    {badge}
                                </>
                            </LinkBase>
                        )}
                    </>
                }
            />
        </div>
    );
}

export default injectIntl(CollapsibleSidebarLogo);
