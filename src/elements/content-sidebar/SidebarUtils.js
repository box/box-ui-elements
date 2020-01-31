/**
 * @flow
 * @file Utility for sidebar
 * @author Box
 */
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import AsyncLoad from '../common/async-load';
import messages from '../common/messages';
import SidebarLoading from './SidebarLoading';
import SidebarLoadingError from './SidebarLoadingError';
import { hasSkills as hasSkillsData } from './skills/skillUtils';
import { mark } from '../../utils/performance';
import {
    SIDEBAR_VIEW_SKILLS,
    SIDEBAR_VIEW_ACTIVITY,
    SIDEBAR_VIEW_METADATA,
    SIDEBAR_VIEW_DETAILS,
    SIDEBAR_VIEW_VERSIONS,
} from '../../constants';
import type { MetadataSidebarProps } from './MetadataSidebar';
import type { MetadataEditor } from '../../common/types/metadata';
import type { BoxItem } from '../../common/types/core';

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
        return !!file && SidebarUtils.canHaveSkillsSidebar(props) && hasSkillsData(file);
    }

    /**
     * Determines if we should bother rendering the metadata sidebar.
     * Relies on props and metadata data and feature enabled or not.
     *
     * @private
     * @param {ContentSidebarProps} props - User passed in props
     * @param {Array<MetadataEditor>} editors - metadata editors
     * @return {Boolean} true if we should render
     */
    static shouldRenderMetadataSidebar(props: ContentSidebarProps, editors?: Array<MetadataEditor>): boolean {
        const { metadataSidebarProps = {} }: ContentSidebarProps = props;
        const { isFeatureEnabled = true }: MetadataSidebarProps = metadataSidebarProps;

        return (
            SidebarUtils.canHaveMetadataSidebar(props) &&
            (isFeatureEnabled || (Array.isArray(editors) && editors.length > 0))
        );
    }

    /**
     * Determines if we should bother rendering the sidebar.
     * Relies on props and file data.
     *
     * @param {ContentSidebarProps} props - User passed in props
     * @param {BoxItem} file - box file
     * @param {Array<MetadataEditor>} editors - metadata editors
     * @return {Boolean} true if we should fetch or render
     */
    static shouldRenderSidebar(props: ContentSidebarProps, file?: BoxItem, editors?: Array<MetadataEditor>): boolean {
        return (
            !!file &&
            (SidebarUtils.canHaveDetailsSidebar(props) ||
                SidebarUtils.shouldRenderSkillsSidebar(props, file) ||
                SidebarUtils.canHaveActivitySidebar(props) ||
                SidebarUtils.shouldRenderMetadataSidebar(props, editors))
        );
    }

    /**
     * Gets the title for a given sidebar view
     *
     * @param {string} view - the view name
     * @return {React.Node} - the node to render
     */
    static getTitleForView(view: string): React.Node {
        switch (view) {
            case SIDEBAR_VIEW_SKILLS:
                return <FormattedMessage {...messages.sidebarSkillsTitle} />;
            case SIDEBAR_VIEW_DETAILS:
                return <FormattedMessage {...messages.sidebarDetailsTitle} />;
            case SIDEBAR_VIEW_METADATA:
                return <FormattedMessage {...messages.sidebarMetadataTitle} />;
            case SIDEBAR_VIEW_ACTIVITY:
                return <FormattedMessage {...messages.sidebarActivityTitle} />;
            default:
                return null;
        }
    }

    /**
     * Marks and gets the loader for a given sidebar view
     *
     * @param {String} view - the view name
     * @param {String} markName -  the name to be used by performance.mark
     * @return {Function} - a function which will resolve the module to load
     */
    static getLoaderForView(view: string, markName: string): Promise<any> {
        mark(markName);
        let importFn;
        switch (view) {
            case SIDEBAR_VIEW_SKILLS:
                importFn = import(/* webpackMode: "lazy", webpackChunkName: "skills-sidebar" */ './SkillsSidebar');
                break;
            case SIDEBAR_VIEW_DETAILS:
                importFn = import(/* webpackMode: "lazy", webpackChunkName: "details-sidebar" */ './DetailsSidebar');
                break;
            case SIDEBAR_VIEW_METADATA:
                importFn = import(/* webpackMode: "lazy", webpackChunkName: "metadata-sidebar" */ './MetadataSidebar');
                break;
            case SIDEBAR_VIEW_ACTIVITY:
                importFn = import(/* webpackMode: "lazy", webpackChunkName: "activity-sidebar" */ './ActivitySidebar');
                break;
            case SIDEBAR_VIEW_VERSIONS:
                importFn = import(/* webpackMode: "lazy", webpackChunkName: "versions-sidebar" */ './versions');
                break;
            default:
                return Promise.resolve(null);
        }

        return importFn;
    }

    /**
     * Gets the component which async loads a given sidebar view
     *
     * @param {String} view - the view name
     * @param {String} markName -  the name to be used by performance.mark
     * @param {Object} props - additional props
     * @return {React.Node} - the node to render
     */
    static getAsyncSidebarContent(view: string, markName: string, props: Object = {}) {
        return AsyncLoad({
            errorComponent: SidebarLoadingError,
            fallback: <SidebarLoading title={this.getTitleForView(view)} />,
            loader: () => this.getLoaderForView(view, markName),
            ...props,
        });
    }
}

export default SidebarUtils;
