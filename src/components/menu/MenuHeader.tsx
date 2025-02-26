import * as React from 'react';
import classNames from 'classnames';

import CloseButton from '../close-button';
import MenuContext from './MenuContext';

import './MenuHeader.scss';

export interface MenuHeaderProps {
    /** className - CSS class name for the menu section header */
    className?: string;
    /** children - menu section header content */
    children?: React.ReactNode;
    /** subtitle - Secondary title of header below Title */
    subtitle?: React.ReactNode;
    /** title - Title of header */
    title?: React.ReactNode;
}

const MenuHeader = ({ className, children, subtitle, title, ...rest }: MenuHeaderProps) => {
    const { closeMenu } = React.useContext(MenuContext);

    return (
        <div
            className={classNames('bdl-MenuHeader', className)}
            data-testid="bdl-MenuHeader"
            role="presentation"
            {...rest}
        >
            <div className="bdl-MenuHeader-content">
                <div className="bdl-MenuHeader-title-container">
                    {title && <div className="bdl-MenuHeader-title">{title}</div>}
                    {subtitle && <div className="bdl-MenuHeader-subtitle">{subtitle}</div>}
                </div>
                {children}
            </div>
            <CloseButton className="bdl-MenuHeader-close-button" onClick={closeMenu} />
        </div>
    );
};

export default MenuHeader;
