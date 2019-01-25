// @flow
import * as React from 'react';

type Props = {
    href?: string,
    children: React.Node,
    linkRef?: Function,
    target?: string,
    rel?: string,
    component?: React.ElementType,
    refProp?: string,
};

const LinkBase = ({ children, href = '#', linkRef, target, rel, component, refProp, ...rest }: Props) => {
    // Automatically append rel="noopener" for external links
    // (security fix) if no `rel` was passed
    const linkRel = target === '_blank' && !rel ? 'noopener' : rel;

    const LinkComponent = component || 'a';

    const ref = { [refProp || 'ref']: linkRef };

    return (
        <LinkComponent href={href} rel={linkRel} target={target} {...ref} {...rest}>
            {children}
        </LinkComponent>
    );
};

export default LinkBase;
