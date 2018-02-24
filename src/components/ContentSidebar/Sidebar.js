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
import type { BoxItem } from '../../flowTypes';
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
    rootElement: HTMLElement,
    appElement: HTMLElement,
    onInteraction: Function,
    onDescriptionChange: Function,
    descriptionTextareaProps: Object,
    intl: any
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
    rootElement,
    appElement,
    onInteraction,
    onDescriptionChange,
    descriptionTextareaProps,
    intl
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
            appElement={appElement}
            rootElement={rootElement}
            onInteraction={onInteraction}
            onDescriptionChange={onDescriptionChange}
            descriptionTextareaProps={descriptionTextareaProps}
        />
    );

    if (!hasActivityFeed) {
        return Details;
    }

    return (
        <TabView defaultSelectedIndex={shouldShowSkills ? 0 : 1}>
            <Tab title={intl.formatMessage(messages.sidebarDetailsTitle)}>{Details}</Tab>
            <Tab title='Activity'>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
                scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap
                into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the
                release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing
                software like Aldus PageMaker including versions of Lorem Ipsum.
            </Tab>
        </TabView>
    );
};

export default injectIntl(Sidebar);
