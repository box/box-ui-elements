import * as React from 'react';
import classNames from 'classnames';

import './Header.scss';

type Props = {
    /** Header contents */
    children?: React.ReactNode;

    /** Additional class names to attach to the header */
    className?: string;

    /** `background-color` CSS value applied to the header */
    color?: string;

    /** Is header fixed */
    fixed?: boolean;
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
