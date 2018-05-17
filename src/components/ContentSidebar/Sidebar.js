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
import type {
    FileAccessStats,
    BoxItem,
    Errors,
    Comments,
    Tasks,
    User,
    FileVersions,
    SidebarView
} from '../../flowTypes';
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
    rootElement: HTMLElement,
    appElement: HTMLElement,
    onAccessStatsClick?: Function,
    onDescriptionChange: Function,
    onClassificationClick?: Function,
    onVersionHistoryClick?: Function,
    onSkillChange: Function,
    onCommentCreate?: Function,
    onCommentDelete?: Function,
    onTaskCreate?: Function,
    onTaskDelete?: Function,
    onTaskUpdate?: Function,
    onTaskAssignmentUpdate?: Function,
    getApproverWithQuery?: Function,
    getMentionWithQuery?: Function,
    versions?: FileVersions,
    comments?: Comments,
    tasks?: Tasks,
    accessStats?: FileAccessStats,
    accessStatsError?: Errors,
    fileError?: Errors,
    commentsError?: Errors,
    tasksError?: Errors,
    currentUserError?: Errors,
    getAvatarUrl: (string) => Promise<?string>
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
     * Called when sidebar gets new properties
     *
     * @private
     * @return {void}
     */
    componentWillReceiveProps(nextProps: Props): void {
        const newView = this.getDefaultView(nextProps);
        const { view }: State = this.state;
        if (view && newView !== view) {
            this.setState({ view: newView });
        }
    }

    /**
     * Determines the default view
     *
     * @private
     * @return {string} default view
     */
    getDefaultView(props: Props): SidebarView {
        const { hasSkills, hasActivityFeed, file } = props;
        let view = hasSkills && hasSkillsData(file) ? SIDEBAR_VIEW_SKILLS : undefined;
        view = view || (hasActivityFeed ? SIDEBAR_VIEW_ACTIVITY : undefined);
        view = view || SIDEBAR_VIEW_DETAILS;
        return view;
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
            rootElement,
            appElement,
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
            getAvatarUrl
        }: Props = this.props;

        const { view } = this.state;
        const hasSidebarSkills = hasSkills && hasSkillsData(file);
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
                            appElement={appElement}
                            rootElement={rootElement}
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
                        <SkillsSidebar
                            file={file}
                            getPreviewer={getPreviewer}
                            appElement={appElement}
                            rootElement={rootElement}
                            onSkillChange={onSkillChange}
                        />
                    )}
                {view === SIDEBAR_VIEW_ACTIVITY &&
                    hasActivityFeed && (
                        <ActivitySidebar
                            currentUser={currentUser}
                            file={file}
                            tasks={tasks}
                            tasksError={tasksError}
                            comments={comments}
                            commentsError={commentsError}
                            versions={versions}
                            onCommentCreate={onCommentCreate}
                            onCommentDelete={onCommentDelete}
                            onTaskCreate={onTaskCreate}
                            onTaskDelete={onTaskDelete}
                            onTaskUpdate={onTaskUpdate}
                            onTaskAssignmentUpdate={onTaskAssignmentUpdate}
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
