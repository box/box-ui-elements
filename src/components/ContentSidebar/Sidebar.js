/**
 * @flow
 * @file Preview sidebar component
 * @author Box
 */

import React from 'react';
import { injectIntl } from 'react-intl';
import TabView from 'box-react-ui/lib/components/tab-view/TabView';
import Tab from 'box-react-ui/lib/components/tab-view/Tab';
import API from '../../api';
import DetailsSidebar from './DetailsSidebar';
import ActivityFeed from './ActivityFeed/activity-feed/ActivityFeed';
import { hasSkills as hasSkillsData } from './Skills/skillUtils';
import messages from '../messages';
import type { FileAccessStats, BoxItem, Errors, Comments, Tasks } from '../../flowTypes';
import { TAB_TARGETS } from '../../interactionTargets';
import './Sidebar.scss';

type Props = {
    file: BoxItem,
    api: API,
    getPreviewer: Function,
    hasTitle: boolean,
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
    onInteraction: Function,
    onDescriptionChange: Function,
    onClassificationClick?: Function,
    onVersionHistoryClick?: Function,
    onSkillChange: Function,
    descriptionTextareaProps: Object,
    activityFeedState?: Array<any>,
    onCommentCreate?: Function,
    onCommentDelete?: Function,
    onTaskCreate?: Function,
    onTaskDelete?: Function,
    onTaskUpdate?: Function,
    onTaskAssignmentUpdate?: Function,
    intl: any,
    comments?: Comments,
    tasks?: Tasks,
    accessStats?: FileAccessStats,
    accessStatsError?: Errors,
    fileError?: Errors,
    commentsError?: Errors,
    tasksError?: Errors
};

const Sidebar = ({
    file,
    api,
    getPreviewer,
    hasTitle,
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
    onInteraction,
    onDescriptionChange,
    intl,
    activityFeedState,
    onSkillChange,
    onClassificationClick,
    onVersionHistoryClick,
    onCommentCreate,
    onCommentDelete,
    onTaskCreate,
    onTaskDelete,
    onTaskUpdate,
    onTaskAssignmentUpdate,
    accessStats,
    accessStatsError,
    fileError
}: Props) => {
    const shouldShowSkills = hasSkills && hasSkillsData(file);

    const Details = (
        <DetailsSidebar
            file={file}
            getPreviewer={getPreviewer}
            hasTitle={hasTitle}
            hasSkills={shouldShowSkills}
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
            onInteraction={onInteraction}
            onClassificationClick={onClassificationClick}
            onDescriptionChange={onDescriptionChange}
            onVersionHistoryClick={onVersionHistoryClick}
            accessStats={accessStats}
            accessStatsError={accessStatsError}
            fileError={fileError}
        />
    );

    if (!hasActivityFeed) {
        return Details;
    }

    const inputState = {
        currentUser: getPreviewer()
    };

    const handlers = {
        comments: {
            create: onCommentCreate,
            delete: onCommentDelete
        },
        tasks: {
            create: onTaskCreate,
            delete: onTaskDelete,
            edit: onTaskUpdate,
            onTaskAssignmentUpdate
        },
        versions: {
            info: onVersionHistoryClick
        }
    };

    const ActivityFeedSidebar = (
        <ActivityFeed file={file} api={api} feedState={activityFeedState} inputState={inputState} handlers={handlers} />
    );

    return (
        <TabView defaultSelectedIndex={shouldShowSkills ? 0 : 1}>
            <Tab
                title={intl.formatMessage(messages.sidebarDetailsTitle)}
                data-resin-target={TAB_TARGETS.SELECT_DETAILS}
            >
                {Details}
            </Tab>
            <Tab title={intl.formatMessage(messages.activityFeedTitle)} data-resin-target={TAB_TARGETS.SELECT_ACTIVITY}>
                {ActivityFeedSidebar}
            </Tab>
        </TabView>
    );
};

export default injectIntl(Sidebar);
