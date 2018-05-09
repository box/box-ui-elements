/**
 * @flow
 * @file Utility for sidebar
 * @author Box
 */

import type { ContentSidebarProps } from './ContentSidebar';

/**
 * Determines if we should bother rednering the sidebar
 *
 * @private
 * @param {string} id - file id
 * @param {Boolean|void} [forceFetch] - To void cache
 * @return {Boolean} true if we should fetch or render
 */
const shouldRenderDetailsSidebar = ({
    hasSkills,
    hasProperties,
    hasMetadata,
    hasNotices,
    hasAccessStats,
    hasClassification,
    hasVersions
}: {
    hasSkills: boolean,
    hasNotices: boolean,
    hasProperties: boolean,
    hasMetadata: boolean,
    hasAccessStats: boolean,
    hasClassification: boolean,
    hasVersions: boolean
}): boolean =>
    !!hasSkills ||
    !!hasProperties ||
    !!hasMetadata ||
    !!hasAccessStats ||
    !!hasClassification ||
    !!hasVersions ||
    !!hasNotices;

/**
 * Determines if we should bother rednering the sidebar
 *
 * @private
 * @param {string} id - file id
 * @param {Boolean|void} [forceFetch] - To void cache
 * @return {Boolean} true if we should fetch or render
 */
const shouldRenderSidebar = (props: ContentSidebarProps): boolean => {
    const { isVisible, hasActivityFeed } = props;

    let isSidebarVisible = true; // uncontrolled component
    if (typeof isVisible === 'boolean') {
        // controlled component
        isSidebarVisible = isVisible;
    }

    return isSidebarVisible && (!!shouldRenderDetailsSidebar(props) || !!hasActivityFeed);
};

export { shouldRenderDetailsSidebar, shouldRenderSidebar };
