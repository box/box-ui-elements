/**
 * @flow
 * @file Preview sidebar component
 * @author Box
 */

import React from 'react';
import { injectIntl } from 'react-intl';
import TabView from 'box-react-ui/lib/components/tab-view/TabView';
import Tab from 'box-react-ui/lib/components/tab-view/Tab';
import DetailsSidebar from './DetailsSidebar';
import ActivityFeed from './ActivityFeed/activity-feed/ActivityFeed';
import { hasSkills as hasSkillsData } from './Skills/skillUtils';
import messages from '../messages';
import type { AccessStats, BoxItem, FileVersions, Errors } from '../../flowTypes';
import './Sidebar.scss';

type Props = {
    file: BoxItem,
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
    descriptionTextareaProps: Object,
    activityFeedState?: Array<any>,
    onCommentCreate?: Function,
    onCommentDelete?: Function,
    onTaskCreate?: Function,
    onTaskDelete?: Function,
    onTaskUpdate?: Function,
    onTaskAssignmentUpdate?: Function,
    getCollaboratorWithQuery?: Function,
    intl: any,
    versions?: FileVersions,
    accessStats?: AccessStats,
    fileError?: Errors,
    versionError?: Errors
};

const Sidebar = ({
    file,
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
    onClassificationClick,
    onVersionHistoryClick,
    onCommentCreate,
    onCommentDelete,
    onTaskCreate,
    onTaskDelete,
    onTaskUpdate,
    onTaskAssignmentUpdate,
    getCollaboratorWithQuery,
    versions,
    accessStats,
    fileError,
    versionError
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
            onAccessStatsClick={onAccessStatsClick}
            onInteraction={onInteraction}
            onClassificationClick={onClassificationClick}
            onDescriptionChange={onDescriptionChange}
            onVersionHistoryClick={onVersionHistoryClick}
            versions={versions}
            accessStats={accessStats}
            fileError={fileError}
            versionError={versionError}
        />
    );

    if (!hasActivityFeed) {
        return Details;
    }

    const inputState = {
        currentUser: getPreviewer ? getPreviewer() : null,
        approverSelectorContacts: [],
        mentionSelectorContacts: []
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
        contacts: {
            getApproverWithQuery: getCollaboratorWithQuery,
            getMentionWithQuery: getCollaboratorWithQuery
        },
        versions: {
            info: onVersionHistoryClick
        }
    };

    const ActivityFeedSidebar = (
        <ActivityFeed feedState={activityFeedState} inputState={inputState} handlers={handlers} />
    );

    return (
        <TabView defaultSelectedIndex={shouldShowSkills ? 0 : 1}>
            <Tab title={intl.formatMessage(messages.sidebarDetailsTitle)}>{Details}</Tab>
            <Tab title={intl.formatMessage(messages.activityFeedTitle)}>{ActivityFeedSidebar}</Tab>
        </TabView>
    );
};

export default injectIntl(Sidebar);
