/**
 * @flow
 * @file Utility for sidebar
 * @author Box
 */

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

/**
 * Returns true if there is a comment or version
 *
 * @param {BoxItem} file - box file
 * @return {boolean} true if there are comments or versions to display in the activity feed
 */
const hasActivityFeedItems = (file: BoxItem): boolean => {
    // We are unable to quickly display whether there are tasks, so just check comments and versions
    const { version_number: versionNumber = '1', comment_count: commentCount = 0 } = file;
    return parseInt(versionNumber, 10) > 1 || commentCount > 0;
};

export { shouldRenderDetailsSidebar, shouldRenderSidebar, hasActivityFeedItems };
