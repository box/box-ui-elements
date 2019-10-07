// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { InjectIntlProvidedProps } from 'react-intl';

import { MenuLinkItem } from '../menu';
import EllipsisCrumb from './EllipsisCrumb';
import Crumb from './Crumb';
import messages from './messages';

import './Breadcrumb.scss';

const constructChildren = (children, threshold) => {
    const dotDotDotItems = children.slice(1, children.length + 1 - threshold);
    const menuCrumbsItems = (
        <EllipsisCrumb>
            {dotDotDotItems.reverse().map((crumb, index) => (
                <MenuLinkItem key={index}>{crumb}</MenuLinkItem>
            ))}
        </EllipsisCrumb>
    );
    return [...children.slice(0, 1), menuCrumbsItems, ...children.slice(1 - threshold)];
};

const renderBreadcrumbs = (children, threshold) => {
    let newChildren = children;
    let { length } = children;
    let hasEllipsis = false;

    if (length > threshold) {
        newChildren = constructChildren(children, threshold);
        length = newChildren.length;
        hasEllipsis = true;
    }

    return React.Children.map(newChildren, (item, i) => {
        const isLastCrumb = length === 0 || i === length - 1;
        return (
            <Crumb className={hasEllipsis && i === 1 ? 'no-shrink' : undefined} isLastCrumb={isLastCrumb}>
                {item}
            </Crumb>
        );
    });
};

type Props = {
    /** Class name for Breadcrumb */
    children: React.Node,
    /** Breadcrumb contents */
    className?: string,
    /** Number of crumbs to show before they collapse into an ellipsis */
    threshold?: number,
} & InjectIntlProvidedProps;

const Breadcrumb = ({ className = '', intl, threshold = 4, children }: Props) => (
    <nav aria-label={intl.formatMessage(messages.breadcrumbLabel)} className={`breadcrumbs ${className}`}>
        <ol>{renderBreadcrumbs(React.Children.toArray(children), threshold)}</ol>
    </nav>
);

export { Breadcrumb as BreadcrumbCore };
export default injectIntl(Breadcrumb);
