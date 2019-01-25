// @flow
import * as React from 'react';
import classNames from 'classnames';

import './Header.scss';

type Props = {
    color?: string,
    /** Header contents */
    children?: React.Node,
    className?: string,
    /** Is header fixed */
    fixed?: boolean,
};

const Header = ({ children, color, className, fixed = false, ...rest }: Props) => {
    const classes = classNames('header', { 'is-fixed': fixed }, className);

    return (
        <header className={classes} style={color ? { backgroundColor: color } : {}} {...rest}>
            {children}
        </header>
    );
};

export default Header;
