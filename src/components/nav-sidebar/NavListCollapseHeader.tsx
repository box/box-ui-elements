import * as React from 'react';

import IconCaretDown from '../../icons/general/IconCaretDown';

import { ButtonType } from '../button';
import PlainButton from '../plain-button';

export interface NavListCollapseHeaderProps {
    /** Content displayed adjacent to the collapse button */
    children: React.ReactNode;
    /** Properties passed to the container */
    containerProps?: React.HTMLProps<HTMLDivElement> & Record<string, unknown>;
    /** Handler for toggling the nav list opened or closed */
    onToggleCollapse: React.MouseEventHandler<HTMLButtonElement>;
}

const NavListCollapseHeader = ({ children, onToggleCollapse, containerProps = {} }: NavListCollapseHeaderProps) => (
    <div className="nav-list-collapse-header" {...containerProps}>
        {children}
        <PlainButton className="nav-list-collapse" onClick={onToggleCollapse} type={ButtonType.BUTTON}>
            <IconCaretDown width={8} />
        </PlainButton>
    </div>
);

export default NavListCollapseHeader;
