/**
 * @file Component that creates breadcumbs for both the header and name details
 * @author Box
 */

import * as React from 'react';
import { useIntl } from 'react-intl';

import Breadcrumb from './Breadcrumb';
import BreadcrumbDropdown from './BreadcrumbDropdown';
import BreadcrumbDelimiter from './BreadcrumbDelimiter';
import { Delimiter, Crumb } from '../../../common/types/core';
import { DELIMITER_CARET, DEFAULT_ROOT, DELIMITER_SLASH } from '../../../constants';

import './Breadcrumbs.scss';

import messages from '../messages';

interface Props {
    crumbs: Crumb[];
    delimiter: Delimiter;
    isSmall?: boolean;
    onCrumbClick: (id: string) => void;
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
    onCrumbClick: (id: string) => void,
    delimiter: Delimiter,
): React.ReactElement {
    if (Array.isArray(crumbs)) {
        const condensed = delimiter !== DELIMITER_CARET;
        return (
            <span className="be-breadcrumb-more">
                <BreadcrumbDropdown
                    className={condensed ? 'be-breadcrumbs-condensed' : ''}
                    crumbs={crumbs}
                    onCrumbClick={onCrumbClick}
                />
                <BreadcrumbDelimiter delimiter={condensed ? DELIMITER_SLASH : DELIMITER_CARET} />
            </span>
        );
    }

    const { id, name } = crumbs;
    return <Breadcrumb delimiter={delimiter} isLast={isLast} name={name} onClick={() => onCrumbClick(id)} />;
}

const Breadcrumbs = ({ rootId, crumbs, onCrumbClick, delimiter, isSmall = false }: Props) => {
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
    const onClick = crumb.id ? () => onCrumbClick(crumb.id) : undefined;
    const lastBreadcrumb = <Breadcrumb isLast name={crumb.name} onClick={onClick} />;

    // Always show the second last/parent breadcrumb when there are at least 2 crumbs.
    const secondLastBreadcrumb =
        length > 1 ? getBreadcrumb(filteredCrumbs[length - 2], false, onCrumbClick, delimiter) : null;

    // Only show the more dropdown when there were at least 4 crumbs.
    const moreBreadcrumbs =
        length > 3 ? getBreadcrumb(filteredCrumbs.slice(1, length - 2), false, onCrumbClick, delimiter) : null;

    // Only show the root breadcrumb when there are at least 3 crumbs.
    const firstBreadcrumb = length > 2 ? getBreadcrumb(filteredCrumbs[0], false, onCrumbClick, delimiter) : null;

    return (
        <div className="be-breadcrumbs">
            {isSmall ? null : firstBreadcrumb}
            {isSmall ? null : moreBreadcrumbs}
            {secondLastBreadcrumb}
            {lastBreadcrumb}
        </div>
    );
};

export default Breadcrumbs;
