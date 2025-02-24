import * as React from 'react';
import classNames from 'classnames';
import Breadcrumb from './Breadcrumb';
import BreadcrumbDropdown from './BreadcrumbDropdown';
import type { Crumb, Delimiter } from '../../../common/types/core';

export interface BreadcrumbsProps {
    className?: string;
    crumbs: Crumb[];
    delimiter?: Delimiter;
    isSmall?: boolean;
    onCrumbClick: (crumb: Crumb) => void;
    rootId: string;
}

function filterCrumbs(rootId: string, crumbs: Crumb[]): Crumb[] {
    const rootIndex = crumbs.findIndex((crumb: Crumb) => crumb.id === rootId);
    return rootIndex === -1 ? crumbs : crumbs.slice(rootIndex);
}

function getBreadcrumb(
    crumbs: Crumb | Crumb[],
    isLast: boolean,
    onCrumbClick: (crumb: Crumb) => void,
    delimiter: Delimiter,
) {
    if (Array.isArray(crumbs)) {
        return <BreadcrumbDropdown crumbs={crumbs} onCrumbClick={id => onCrumbClick(crumbs.find(c => c.id === id)!)} />;
    }

    return <Breadcrumb delimiter={delimiter} isLast={isLast} name={crumbs.name} onClick={() => onCrumbClick(crumbs)} />;
}

const Breadcrumbs = ({
    className = '',
    crumbs = [],
    delimiter,
    isSmall = false,
    onCrumbClick,
    rootId,
}: BreadcrumbsProps) => {
    const filteredCrumbs = filterCrumbs(rootId, crumbs);
    const shouldShowDropdown = filteredCrumbs.length > 1;
    const lastCrumb = filteredCrumbs[filteredCrumbs.length - 1];

    return (
        <nav
            aria-label="Folder path"
            className={classNames('be-breadcrumbs', className, {
                'is-small': isSmall,
            })}
        >
            {shouldShowDropdown && getBreadcrumb(filteredCrumbs.slice(0, -1), false, onCrumbClick, delimiter)}
            {lastCrumb && getBreadcrumb(lastCrumb, true, onCrumbClick, delimiter)}
        </nav>
    );
};

export default Breadcrumbs;
