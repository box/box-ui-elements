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
     * @param {ContentSidebarProps} props - User passed in props
     * @return {Boolean} true if we should render
     */
    static canHaveDetailsSidebar({ detailsSidebarProps = {} }: ContentSidebarProps): boolean {
        const { hasProperties, hasAccessStats, hasClassification, hasVersions, hasNotices } = detailsSidebarProps;
        return !!hasProperties || !!hasAccessStats || !!hasClassification || !!hasVersions || !!hasNotices;
    }

    /**
     * Determines if we can render the metadata sidebar.
     * Only relies on props.
     *
     * @param {ContentSidebarProps} props - User passed in props
     * @return {Boolean} true if we should render
     */
    static canHaveMetadataSidebar(props: ContentSidebarProps): boolean {
        return !!props.hasMetadata;
    }

    /**
     * Determines if we can render the activity sidebar.
     * Only relies on props.
     *
     * @param {ContentSidebarProps} props - User passed in props
     * @return {Boolean} true if we should render
     */
    static canHaveActivitySidebar(props: ContentSidebarProps): boolean {
        return !!props.hasActivityFeed;
    }

    /**
     * Determines if we can render the skills sidebar.
     * Only relies on props.
     *
     * @param {ContentSidebarProps} props - User passed in props
     * @return {Boolean} true if we should render
     */
    static canHaveSkillsSidebar(props: ContentSidebarProps): boolean {
        return !!props.hasSkills;
    }

    /**
     * Determines if we can render the sidebar.
     * Only relies on props.
     *
     * @param {ContentSidebarProps} props - User passed in props
     * @return {Boolean} true if we should have a sidebar
     */
    static canHaveSidebar(props: ContentSidebarProps): boolean {
        return (
            SidebarUtils.canHaveDetailsSidebar(props) ||
            SidebarUtils.canHaveActivitySidebar(props) ||
            SidebarUtils.canHaveSkillsSidebar(props) ||
            SidebarUtils.canHaveMetadataSidebar(props)
        );
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
     * Determines if we should bother rendering the sidebar.
     * Relies on props and file data.
     *
     * @param {ContentSidebarProps} props - User passed in props
     * @param {BoxItem} file - box file
     * @return {Boolean} true if we should fetch or render
     */
    static shouldRenderSidebar(props: ContentSidebarProps, file?: BoxItem): boolean {
        return (
            !!file &&
            (SidebarUtils.canHaveDetailsSidebar(props) ||
                SidebarUtils.shouldRenderSkillsSidebar(props, file) ||
                SidebarUtils.canHaveActivitySidebar(props) ||
                SidebarUtils.canHaveMetadataSidebar(props))
        );
    }
}

export default SidebarUtils;
