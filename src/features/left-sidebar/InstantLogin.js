// @flow
import * as React from 'react';

import LeftSidebarLink from './LeftSidebarLink';
import LeftSidebarIconWrapper from './LeftSidebarIconWrapper';

import './styles/InstantLogin.scss';

type Props = {
    /** Optional HTML attributes to append to component */
    htmlAttributes?: Object,
    /** React element representing an svg icon */
    iconComponent?: ?React.ComponentType<any>,
    /** Localized text string to use for individual menu items */
    message?: string,
    /** Whether the tooltip should be shown */
    showTooltip?: boolean,
};

const InstantLogin = ({ htmlAttributes = {}, iconComponent: Icon, message = '', showTooltip = false }: Props) => (
    <LeftSidebarLink
        className="instant-login-link"
        htmlAttributes={htmlAttributes}
        icon={
            Icon ? (
                <LeftSidebarIconWrapper>
                    <Icon />
                </LeftSidebarIconWrapper>
            ) : null
        }
        message={message}
        showTooltip={showTooltip}
    />
);

export default InstantLogin;
