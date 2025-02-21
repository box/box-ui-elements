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

const Breadcrumbs = ({ className = '', crumbs = [], delimiter, isSmall = false, onCrumbClick }: BreadcrumbsProps) => {
    const shouldShowDropdown = crumbs.length > 1;
    const lastCrumb = crumbs[crumbs.length - 1];

    return (
        <nav
            aria-label="Folder path"
            className={classNames('be-breadcrumbs', className, {
                'is-small': isSmall,
            })}
        >
            {shouldShowDropdown && <BreadcrumbDropdown crumbs={crumbs.slice(0, -1)} onCrumbClick={onCrumbClick} />}
            {lastCrumb && (
                <Breadcrumb
                    delimiter={delimiter}
                    isLast
                    name={lastCrumb.name}
                    onClick={() => onCrumbClick(lastCrumb)}
                />
            )}
        </nav>
    );
};

export default Breadcrumbs;
