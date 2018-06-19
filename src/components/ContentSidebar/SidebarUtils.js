/**
 * @flow
 * @file Utility for sidebar
 * @author Box
 */

import { hasSkills as hasSkillsData } from './Skills/skillUtils';

class SidebarUtils {
    /**
     * Determines if we can render the details sidebar.
     * Only relies on props.
     *
     * @private
     * @param {ContentSidebarProps} props - User passed in props
     * @param {BoxItem} file - box file
     * @return {Boolean} true if we should render
     */
    static canHaveDetailsSidebar({
        hasProperties,
        hasNotices,
        hasAccessStats,
        hasClassification,
        hasVersions
    }: ContentSidebarProps): boolean {
        return !!hasProperties || !!hasAccessStats || !!hasClassification || !!hasVersions || !!hasNotices;
    }

    /**
     * Determines if we can render the sidebar.
     * Only relies on props.
     *
     * @private
     * @param {string} id - file id
     * @return {Boolean} true if we should have a sidebar
     */
    static canHaveSidebar(props: ContentSidebarProps): boolean {
        const { hasActivityFeed, hasSkills, hasMetadata } = props;
        return SidebarUtils.canHaveDetailsSidebar(props) || !!hasActivityFeed || !!hasSkills || !!hasMetadata;
    }

    /**
     * Determines if we should bother rendering the skills sidebar.
     * Relies on props and file data.
     *
     * @private
     * @param {ContentSidebarProps} props - User passed in props
     * @param {BoxItem} file - box file
     * @return {Boolean} true if we should render
     */
    static shouldRenderSkillsSidebar(props: ContentSidebarProps, file?: BoxItem): boolean {
        return !!file && !!props.hasSkills && hasSkillsData(file);
    }

    /**
     * Determines if we should bother rendering the skills sidebar.
     * Relies on props and file data.
     *
     * @private
     * @param {ContentSidebarProps} props - User passed in props
     * @param {BoxItem} file - box file
     * @return {Boolean} true if we should render
     */
    static shouldRenderDetailsSidebar(props: ContentSidebarProps): boolean {
        return SidebarUtils.canHaveDetailsSidebar(props);
    }

    /**
     * Determines if we should bother rednering the metadata sidebar.
     * Relies on props and file data.
     *
     * @private
     * @param {ContentSidebarProps} props - User passed in props
     * @param {BoxItem} file - box file
     * @return {Boolean} true if we should render
     */
    static shouldRenderMetadataSidebar(props: ContentSidebarProps): boolean {
        return !!props.hasMetadata;
    }

    /**
     * Determines if we should bother rendering the activity sidebar.
     * Relies on props and file data.
     *
     * @private
     * @param {ContentSidebarProps} props - User passed in props
     * @param {BoxItem} file - box file
     * @return {Boolean} true if we should render
     */
    static shouldRenderActivitySidebar(props: ContentSidebarProps): boolean {
        return !!props.hasActivityFeed;
    }

    /**
     * Determines if we should bother rendering the sidebar.
     * Relies on props and file data.
     *
     * @private
     * @param {string} id - file id
     * @param {Boolean|void} [forceFetch] - To void cache
     * @return {Boolean} true if we should fetch or render
     */
    static shouldRenderSidebar(props: ContentSidebarProps, file?: BoxItem): boolean {
        return (
            !!file &&
            (SidebarUtils.shouldRenderDetailsSidebar(props) ||
                SidebarUtils.shouldRenderSkillsSidebar(props, file) ||
                SidebarUtils.shouldRenderActivitySidebar(props) ||
                SidebarUtils.shouldRenderMetadataSidebar(props))
        );
    }
}

export default SidebarUtils;
