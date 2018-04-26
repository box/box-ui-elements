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
import { hasSkills as hasSkillsData } from './Skills/skillUtils';
import messages from '../messages';
import type { BoxItem, FileVersions, Errors, FileAccessStats } from '../../flowTypes';
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
    intl: any,
    versions?: FileVersions,
    accessStats?: FileAccessStats,
    accessStatsError?: Errors,
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
    onClassificationClick,
    onVersionHistoryClick,
    versions,
    accessStats,
    accessStatsError,
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
            accessStatsError={accessStatsError}
            fileError={fileError}
            versionError={versionError}
        />
    );

    if (!hasActivityFeed) {
        return Details;
    }

    return (
        <TabView defaultSelectedIndex={shouldShowSkills ? 0 : 1}>
            <Tab title={intl.formatMessage(messages.sidebarDetailsTitle)}>{Details}</Tab>
            <Tab title='Activity' />
        </TabView>
    );
};

export default injectIntl(Sidebar);
