// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import classNames from 'classnames';

import { MenuLinkItem } from '../menu';
import EllipsisCrumb from './EllipsisCrumb';
import Crumb from './Crumb';
import messages from './messages';

import './Breadcrumb.scss';

export type BreadcrumbProps = {
    /** Breadcrumb contents */
    children: React.Node,
    /** Class name for Breadcrumb */
    className?: string,
    /** Reverse default overflow breadcrumb ordering to highest to lowest depth */
    hasReverseOverflowOrder?: boolean,
    intl: IntlShape,
    /** Show number of breadcrumb items before overflow. Default is 1 */
    numItemsBeforeOverflow?: number,
    /** Element to override default overflow menu button */
    overflowMenuButton?: React.Node,
    /** Number of crumbs to show before they collapse into an ellipsis */
    threshold?: number,
};

type Props = BreadcrumbProps;

const Breadcrumb = ({
    children,
    className = '',
    hasReverseOverflowOrder = false,
    intl,
    numItemsBeforeOverflow = 1,
    overflowMenuButton,
    threshold = 4,
}: Props) => {
    const breadcrumbs = React.Children.toArray(children);

    const constructChildren = () => {
        const overflowItems = breadcrumbs.slice(numItemsBeforeOverflow, breadcrumbs.length + 1 - threshold);
        const dotDotDotItems = hasReverseOverflowOrder ? overflowItems : overflowItems.reverse();

        const menuCrumbsItems = (
            <EllipsisCrumb menuButton={overflowMenuButton}>
                {dotDotDotItems.map((crumb, index) => (
                    <MenuLinkItem key={index}>{crumb}</MenuLinkItem>
                ))}
            </EllipsisCrumb>
        );
        return [...breadcrumbs.slice(0, numItemsBeforeOverflow), menuCrumbsItems, ...breadcrumbs.slice(1 - threshold)];
    };

    const renderBreadcrumbs = () => {
        let newChildren = breadcrumbs;
        let { length } = breadcrumbs;
        let hasEllipsis = false;

        if (length > threshold) {
            newChildren = constructChildren();
            length = newChildren.length;
            hasEllipsis = true;
        }

        return React.Children.map(newChildren, (item, i) => {
            const isLastCrumb = length === 0 || i === length - 1;
            return (
                <Crumb
                    className={classNames({ 'no-shrink': hasEllipsis && i === numItemsBeforeOverflow })}
                    isLastCrumb={isLastCrumb}
                    key={`${item.props.id}-${i}`}
                >
                    {item}
                </Crumb>
            );
        });
    };

    return (
        <nav aria-label={intl.formatMessage(messages.breadcrumbLabel)} className={classNames('breadcrumbs', className)}>
            <ol>{renderBreadcrumbs()}</ol>
        </nav>
    );
};

export { Breadcrumb as BreadcrumbBase };
export default injectIntl(Breadcrumb);
