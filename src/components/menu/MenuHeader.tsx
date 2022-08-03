import * as React from 'react';
import classNames from 'classnames';

import CloseButton from '../close-button';
import MenuContext from './MenuContext';

import './MenuHeader.scss';

export interface MenuHeaderProps {
    /** children - menu section header content */
    children?: Array<React.ReactChild> | React.ReactChild;
    /** className - CSS class name for the menu section header */
    className?: string;
}

const MenuHeader = ({ children, className, ...rest }: MenuHeaderProps) => {
    const { closeMenu } = React.useContext(MenuContext);

    return (
        <div
            className={classNames('bdl-MenuHeader', className)}
            data-testid="bdl-MenuHeader"
            role="presentation"
            {...rest}
        >
            <div className="bdl-MenuHeader-content">{children}</div>
            <CloseButton onClick={closeMenu} />
        </div>
    );
};

export default MenuHeader;
