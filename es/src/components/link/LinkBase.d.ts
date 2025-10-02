import * as React from 'react';
export interface LinkBaseProps {
    children: React.ReactChild;
    className?: string;
    component?: React.ElementType;
    href?: string;
    linkRef?: Function;
    refProp?: string;
    rel?: string;
    target?: string;
}
declare const LinkBase: ({ children, href, linkRef, target, rel, component, refProp, ...rest }: LinkBaseProps) => React.JSX.Element;
export default LinkBase;
