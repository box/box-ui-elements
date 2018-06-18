/**
 * @flow
 * @file Preview sidebar component
 * @author Box
 */

import * as React from 'react';
import DetailsSidebar from './DetailsSidebar';
import SkillsSidebar from './SkillsSidebar';
import ActivitySidebar from './ActivitySidebar';
import { hasSkills as hasSkillsData } from './Skills/skillUtils';
import { shouldRenderDetailsSidebar } from './sidebarUtil';
import SidebarNav from './SidebarNav';
import { SIDEBAR_VIEW_SKILLS, SIDEBAR_VIEW_ACTIVITY, SIDEBAR_VIEW_DETAILS } from '../../constants';
import './Sidebar.scss';

type Props = {
    currentUser?: User,
    file: BoxItem,
    getPreviewer: Function,
    hasSkills: boolean,
    hasProperties: boolean,
    hasMetadata: boolean,
    hasNotices: boolean,
    hasAccessStats: boolean,
    hasClassification: boolean,
    hasActivityFeed: boolean,
    hasVersions: boolean,
    onAccessStatsClick?: Function,
    onDescriptionChange: Function,
    onClassificationClick?: Function,
    onVersionHistoryClick?: Function,
    onSkillChange: Function,
    onCommentCreate?: Function,
    onCommentDelete?: Function,
    onTaskCreate?: Function,
    onTaskDelete?: Function,
    onTaskUpdate: Function,
    onTaskAssignmentUpdate?: Function,
    getApproverWithQuery?: Function,
    getMentionWithQuery?: Function,
    translations?: Translations,
    versions?: FileVersions,
    comments?: Comments,
    tasks?: Tasks,
    approverSelectorContacts?: SelectorItems,
    mentionSelectorContacts?: SelectorItems,
    accessStats?: FileAccessStats,
    accessStatsError?: Errors,
    fileError?: Errors,
    commentsError?: Errors,
    tasksError?: Errors,
    currentUserError?: Errors,
    getAvatarUrl: (string) => Promise<?string>,
    getUserProfileUrl?: (string) => Promise<string>
};

type State = {
    view?: SidebarView
};

class Sidebar extends React.Component<Props, State> {
    props: Props;
    state: State;

    /**
     * [constructor]
     *
     * @private
     * @return {Sidebar}
     */
    constructor(props: Props) {
        super(props);
        this.state = { view: this.getDefaultView(props) };
    }

    /**
     * Should update the view if the view isn't applicable
     *
     * @private
     * @return {void}
     */
    componentWillReceiveProps(nextProps: Props): void {
        const { view }: State = this.state;
        if (
            (view === SIDEBAR_VIEW_SKILLS && !this.canHaveSkillsSidebar(nextProps)) ||
            (view === SIDEBAR_VIEW_ACTIVITY && !this.canHaveActivitySidebar(nextProps))
        ) {
            this.setState({ view: this.getDefaultView(nextProps) });
        }
    }

    /**
     * Determines if skills sidebar is allowed
     *
     * @private
     * @return {string} default view
     */
    canHaveSkillsSidebar(props: Props): boolean {
        const { hasSkills, file } = props;
        return hasSkills && hasSkillsData(file);
    }

    /**
     * Determines if activity sidebar is allowed
     *
     * @private
     * @return {string} default view
     */
    canHaveActivitySidebar(props: Props): boolean {
        const { hasActivityFeed } = props;
        return hasActivityFeed;
    }

    /**
     * Determines the default view
     *
     * @private
     * @return {string} default view
     */
    getDefaultView(props: Props): SidebarView {
        if (this.canHaveSkillsSidebar(props)) {
            return SIDEBAR_VIEW_SKILLS;
        } else if (this.canHaveActivitySidebar(props)) {
            return SIDEBAR_VIEW_ACTIVITY;
        }
        return SIDEBAR_VIEW_DETAILS;
    }

    /**
     * Toggle the sidebar view state
     *
     * @param {string} view - the selected view
     * @return {void}
     */
    onToggle = (view: SidebarView): void => {
        this.setState({ view: view === this.state.view ? undefined : view });
    };

    render() {
        const {
            currentUser,
            file,
            getPreviewer,
            hasSkills,
            hasProperties,
            hasMetadata,
            hasNotices,
            hasAccessStats,
            hasClassification,
            hasActivityFeed,
            hasVersions,
            onAccessStatsClick,
            onDescriptionChange,
            onSkillChange,
            onClassificationClick,
            onVersionHistoryClick,
            onCommentCreate,
            onCommentDelete,
            onTaskCreate,
            onTaskDelete,
            onTaskUpdate,
            onTaskAssignmentUpdate,
            getApproverWithQuery,
            getMentionWithQuery,
            accessStats,
            accessStatsError,
            fileError,
            tasks,
            tasksError,
            comments,
            commentsError,
            versions,
            approverSelectorContacts,
            mentionSelectorContacts,
            getAvatarUrl,
            getUserProfileUrl
        }: Props = this.props;

        const { view } = this.state;
        const hasSidebarSkills = this.canHaveSkillsSidebar(this.props);
        const hasDetails = shouldRenderDetailsSidebar({
            hasProperties,
            hasAccessStats,
            hasClassification,
            hasNotices,
            hasVersions
        });

        return (
            <React.Fragment>
                <SidebarNav
                    onToggle={this.onToggle}
                    selectedView={view}
                    hasSkills={hasSkills && hasSkillsData(file)}
                    hasMetadata={hasMetadata}
                    hasActivityFeed={hasActivityFeed}
                    hasDetails={hasDetails}
                />
                {view === SIDEBAR_VIEW_DETAILS &&
                    hasDetails && (
                        <DetailsSidebar
                            file={file}
                            hasProperties={hasProperties}
                            hasMetadata={hasMetadata}
                            hasNotices={hasNotices}
                            hasAccessStats={hasAccessStats}
                            hasClassification={hasClassification}
                            hasVersions={hasVersions}
                            onSkillChange={onSkillChange}
                            onAccessStatsClick={onAccessStatsClick}
                            onClassificationClick={onClassificationClick}
                            onDescriptionChange={onDescriptionChange}
                            onVersionHistoryClick={onVersionHistoryClick}
                            accessStats={accessStats}
                            accessStatsError={accessStatsError}
                            fileError={fileError}
                        />
                    )}
                {view === SIDEBAR_VIEW_SKILLS &&
                    hasSidebarSkills && (
                        <SkillsSidebar file={file} getPreviewer={getPreviewer} onSkillChange={onSkillChange} />
                    )}
                {view === SIDEBAR_VIEW_ACTIVITY &&
                    hasActivityFeed && (
                        <ActivitySidebar
                            currentUser={currentUser}
                            file={file}
                            tasks={tasks}
                            tasksError={tasksError}
                            comments={comments}
                            approverSelectorContacts={approverSelectorContacts}
                            mentionSelectorContacts={mentionSelectorContacts}
                            commentsError={commentsError}
                            versions={versions}
                            onCommentCreate={onCommentCreate}
                            onCommentDelete={onCommentDelete}
                            onTaskCreate={onTaskCreate}
                            onTaskDelete={onTaskDelete}
                            onTaskUpdate={onTaskUpdate}
                            onTaskAssignmentUpdate={onTaskAssignmentUpdate}
                            getUserProfileUrl={getUserProfileUrl}
                            getApproverWithQuery={getApproverWithQuery}
                            getMentionWithQuery={getMentionWithQuery}
                            getAvatarUrl={getAvatarUrl}
                        />
                    )}
            </React.Fragment>
        );
    }
}

export default Sidebar;
