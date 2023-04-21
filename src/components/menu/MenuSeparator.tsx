import React from 'react';
import classNames from 'classnames';

export interface MenuSeparatorProps {
    className?: string;
}

const MenuSeparator = ({ className }: MenuSeparatorProps) => (
    <li className={classNames('bdl-MenuSeparator', className)} role="separator" />
);

export default MenuSeparator;
