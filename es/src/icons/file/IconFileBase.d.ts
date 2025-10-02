import * as React from 'react';
import { Icon } from '../iconTypes';
type Props = Icon & {
    baseClassName: string;
    children: React.ReactNode | Array<React.ReactNode>;
};
declare const IconFileBase: ({ children, className, baseClassName, height, title, width }: Props) => React.JSX.Element;
export default IconFileBase;
