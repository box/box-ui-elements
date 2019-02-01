// @flow
import * as React from 'react';

import IconCaretDown from '../../icons/general/IconCaretDown';

import PlainButton from '../plain-button';

type Props = {
    /** Node to use for the button's adjacent display */
    children: React.Node,
    /** Custom Properties passed to the container */
    containerProps?: Object,
    /** Handler for toggling the nav list opened or closed */
    onToggleCollapse: Function,
};

const NavListCollapseHeader = ({ children, onToggleCollapse, containerProps = {} }: Props) => (
    <div className="nav-list-collapse-header" {...containerProps}>
        {children}
        <PlainButton className="nav-list-collapse" onClick={onToggleCollapse} type="button">
            <IconCaretDown width={8} />
        </PlainButton>
    </div>
);

export default NavListCollapseHeader;
