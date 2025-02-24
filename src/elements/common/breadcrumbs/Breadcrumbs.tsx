import * as React from 'react';
import { useIntl } from 'react-intl';
import Breadcrumb from './Breadcrumb';
import BreadcrumbDropdown from './BreadcrumbDropdown';
import type { Crumb, Delimiter } from '../../../common/types/core';
import { DEFAULT_ROOT } from '../../../constants';
import messages from '../messages';
import './Breadcrumbs.scss';

export interface BreadcrumbsProps {
    crumbs: Crumb[];
    delimiter?: Delimiter;
    isSmall?: boolean;
    onCrumbClick: (crumb: Crumb) => void;
    rootId: string;
}

/**
 * Filters out ancestors to root from the crumbs.
 * This is useful when the root is not All Files.
 *
 * @private
 * @param {string} rootId the root folder id
 * @param {Array} crumbs list of crumbs
 * @return {Array} crumbs
 */
function filterCrumbs(rootId: string, crumbs: Crumb[]): Crumb[] {
    const rootIndex = crumbs.findIndex((crumb: Crumb) => crumb.id === rootId);
    return rootIndex === -1 ? crumbs : crumbs.slice(rootIndex);
}

/**
 * Creates an individual breadcrumb
 *
 * @private
 * @param {Object} crumb single crumb data
 * @param {boolean} isLast is this the last crumb
 * @return {Element}
 */
function getBreadcrumb(
    crumbs: Crumb | Crumb[],
    isLast: boolean,
    onCrumbClick: (crumb: Crumb) => void,
    delimiter: Delimiter,
) {
    if (Array.isArray(crumbs)) {
        return (
            <span className="be-breadcrumb-more">
                <BreadcrumbDropdown crumbs={crumbs} onCrumbClick={id => onCrumbClick(crumbs.find(c => c.id === id)!)} />
            </span>
        );
    }

    return <Breadcrumb delimiter={delimiter} isLast={isLast} name={crumbs.name} onClick={() => onCrumbClick(crumbs)} />;
}

const Breadcrumbs = ({ crumbs = [], delimiter, isSmall = false, onCrumbClick, rootId }: BreadcrumbsProps) => {
    const { formatMessage } = useIntl();

    if (!rootId || crumbs.length === 0) {
        return <span />;
    }

    // The crumbs given may have ancestors higher than the root. We need to filter them out.
    const filteredCrumbs = filterCrumbs(rootId, crumbs);

    // Make sure "All Files" crumb is localized
    const defaultRootCrumb = filteredCrumbs.find(({ id }) => id === DEFAULT_ROOT);
    if (defaultRootCrumb) {
        defaultRootCrumb.name = formatMessage(messages.rootBreadcrumb);
    }

    const { length } = filteredCrumbs;

    // Always show the last/leaf breadcrumb.
    const crumb = filteredCrumbs[length - 1];
    const onClick = crumb.id ? () => onCrumbClick(crumb) : undefined;
    const lastBreadcrumb = <Breadcrumb isLast name={crumb.name} onClick={onClick} />;

    // Always show the second last/parent breadcrumb when there are at least 2 crumbs.
    const secondLastBreadcrumb =
        length > 1 ? getBreadcrumb(filteredCrumbs[length - 2], false, onCrumbClick, delimiter) : null;

    // Only show the more dropdown when there were at least 3 crumbs.
    const moreBreadcrumbs =
        length > 2 ? getBreadcrumb([...filteredCrumbs.slice(0, length - 1)], false, onCrumbClick, delimiter) : null;

    // Only show the root breadcrumb when there are at least 3 crumbs.
    const firstBreadcrumb = length > 2 ? getBreadcrumb(filteredCrumbs[0], false, onCrumbClick, delimiter) : null;

    return (
        <nav aria-label="Folder path" className={`be-breadcrumbs${isSmall ? ' is-small' : ''}`}>
            {isSmall ? null : firstBreadcrumb}
            {isSmall ? null : moreBreadcrumbs}
            {secondLastBreadcrumb}
            {lastBreadcrumb}
        </nav>
    );
};

export default Breadcrumbs;
