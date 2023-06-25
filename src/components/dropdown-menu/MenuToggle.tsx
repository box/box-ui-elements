import * as React from 'react';

import IconCaretDown from '../../icons/general/IconCaretDown';

import './MenuToggle.scss';

type Props = {
    children?: React.ReactNode;
};

const MenuToggle = ({ children }: Props) => (
    <span className="menu-toggle">
        {children}
        <IconCaretDown className="toggle-arrow" width={7} />
    </span>
);

export default MenuToggle;
