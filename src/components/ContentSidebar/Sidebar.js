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
import hasSkillsData from './skillUtils';
import messages from '../messages';
import type { BoxItem, FileVersions } from '../../flowTypes';
import './Sidebar.scss';

type Props = {
    file: BoxItem,
    getPreviewer: Function,
    hasTitle: boolean,
    hasSkills: boolean,
    hasProperties: boolean,
    hasMetadata: boolean,
    hasAccessStats: boolean,
    hasClassification: boolean,
    hasActivityFeed: boolean,
    hasVersions: boolean,
    rootElement: HTMLElement,
    appElement: HTMLElement,
    onInteraction: Function,
    onDescriptionChange: Function,
    onVersionHistoryClick?: Function,
    descriptionTextareaProps: Object,
    intl: any,
    versions: FileVersions
};

const Sidebar = ({
    file,
    getPreviewer,
    hasTitle,
    hasSkills,
    hasProperties,
    hasMetadata,
    hasAccessStats,
    hasClassification,
    hasActivityFeed,
    hasVersions,
    rootElement,
    appElement,
    onInteraction,
    onDescriptionChange,
    intl,
    onVersionHistoryClick,
    versions
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
            hasAccessStats={hasAccessStats}
            hasClassification={hasClassification}
            hasVersions={hasVersions}
            appElement={appElement}
            rootElement={rootElement}
            onInteraction={onInteraction}
            onDescriptionChange={onDescriptionChange}
            onVersionHistoryClick={onVersionHistoryClick}
            versions={versions}
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
