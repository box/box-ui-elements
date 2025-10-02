import * as React from 'react';
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
declare const Header: ({ children, color, className, fixed, ...rest }: Props) => React.JSX.Element;
export default Header;
