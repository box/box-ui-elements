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
    hasProperties,
    hasNotices,
    hasAccessStats,
    hasClassification,
    hasVersions
}: {
    hasNotices: boolean,
    hasProperties: boolean,
    hasAccessStats: boolean,
    hasClassification: boolean,
    hasVersions: boolean
}): boolean => !!hasProperties || !!hasAccessStats || !!hasClassification || !!hasVersions || !!hasNotices;

/**
 * Determines if we should bother rednering the sidebar
 *
 * @private
 * @param {string} id - file id
 * @param {Boolean|void} [forceFetch] - To void cache
 * @return {Boolean} true if we should fetch or render
 */
const shouldRenderSidebar = (props: ContentSidebarProps): boolean => {
    const { hasActivityFeed, hasSkills, hasMetadata } = props;
    return !!shouldRenderDetailsSidebar(props) || !!hasActivityFeed || !!hasSkills || !!hasMetadata;
};

export { shouldRenderDetailsSidebar, shouldRenderSidebar };
