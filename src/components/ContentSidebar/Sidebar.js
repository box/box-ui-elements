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

const currentUser = { name: 'Aubrey Graham', id: '7' };

const msOneDayAgo = 86400 * 1000;
const TIME_STRING_SEPT_27_2017 = '2017-08-27T10:40:41-07:00';

const feedState = [
    {
        createdAt: new Date().toISOString(),
        id: 'bb6d6c62-f411-43e8-840f-e17bb3611d34',
        action: 'applied',
        type: 'keywords',
        words: 'cartoon font logo brand clip art illustration line artwork'
    },
    {
        createdAt: new Date(Date.now() - 5 * msOneDayAgo).toISOString(),
        id: '123122432',
        taggedMessage: '私は、これは言うことを知りません ＠[2031225629:リュ]',
        createdBy: {
            name: 'The man formerly known as Prince and other things',
            id: 1
        },
        type: 'comment'
    },
    {
        createdAt: Date.now() - 1 * msOneDayAgo,
        id: '1231231234',
        taggedMessage: 'An error comment',
        isPending: true,
        error: {
            title: 'An error occured',
            message: 'Stuff got fudged up, who knows what happened. Probably your fault tho...',
            action: {
                text: 'Fix it',
                onAction: () => console.log('confirm')
            }
        },
        createdBy: { name: 'Kanye West', id: 10 },
        type: 'comment'
    },
    {
        createdAt: Date.now(),
        id: '148953',
        versionNumber: 1,
        createdBy: { name: 'Kanye West', id: 10 },
        action: 'upload',
        type: 'file_version'
    },
    {
        createdAt: Date.now(),
        id: '1489531',
        versionNumber: 2,
        createdBy: { name: 'Kanye West', id: 10 },
        action: 'upload',
        type: 'file_version'
    },
    {
        createdAt: Date.now(),
        id: '1489532',
        versionNumber: 3,
        createdBy: { name: 'Abel Tesfaye', id: 13 },
        action: 'upload',
        type: 'file_version'
    },
    {
        createdAt: Date.now(),
        id: '1489533',
        versionNumber: 4,
        createdBy: { name: 'Abel Tesfaye', id: 13 },
        action: 'upload',
        type: 'file_version'
    },
    {
        createdAt: new Date(Date.now() - 1500 * 1000).toISOString(),
        dueDate: Date.now(),
        id: '123125312',
        taggedMessage: 'Do it! Do it! Do it! Do it! Do it! Do it! Do it! Do it! .',
        createdBy: { name: 'Aubrey Graham', id: 7 },
        isPending: true,
        error: {
            title: 'An error occured',
            message: 'Stuff got fudged up, who knows what happened. Probably your fault tho...',
            action: {
                text: 'Fix it',
                onAction: () => console.log('confirm')
            }
        },
        assignees: [
            {
                id: 0,
                user: { name: 'Kanye West', id: 10 },
                status: 'incomplete'
            },
            {
                id: 1,
                user: { name: 'The man formerly known as Prince and other things', id: 3 },
                status: 'incomplete'
            },
            {
                id: 2,
                user: { name: 'Shawn Carter', id: 2 },
                status: 'completed'
            },
            {
                id: 3,
                user: { name: 'Beyonce', id: 4 },
                status: 'rejected'
            }
        ],
        type: 'task'
    },
    {
        createdAt: Date.now(),
        dueDate: null,
        id: '123125',
        taggedMessage: 'Click this link http://www.google.com Also, <b>This text should not show up bold</b>',
        createdBy: { name: 'Aubrey Graham', id: 8 },
        assignees: [
            {
                id: 0,
                user: { name: 'Kanye West', id: 10 },
                status: 'incomplete'
            },
            {
                id: 1,
                user: { name: 'The man formerly known as Prince and other things', id: 3 },
                status: 'incomplete'
            },
            {
                id: 2,
                user: { name: 'Shawn Carter', id: 2 },
                status: 'completed'
            },
            {
                id: 3,
                user: { name: 'Beyonce', id: 4 },
                status: 'rejected'
            }
        ],
        type: 'task'
    },
    {
        createdAt: Date.now(),
        id: '123123',
        taggedMessage:
            'Hey bru, how u doing @[2030326577:Young Jeezy]? @[123:Kanye] is dope! <a href="http://www.box.com">This should not show up as a link</a>',
        createdBy: { name: 'Kanye West', id: 2 },
        type: 'comment'
    },
    {
        createdAt: Date.now(),
        id: '123123123',
        taggedMessage: 'A pending comment',
        isPending: true,
        createdBy: { name: 'Kanye West', id: 2 },
        type: 'comment'
    },
    {
        createdAt: TIME_STRING_SEPT_27_2017,
        dueDate: Date.now(),
        id: '12312445',
        taggedMessage: 'Do it! Do it! Do it! Do it! Do it! Do it! Do it! Do it! .',
        createdBy: { name: 'Aubrey Graham', id: 8 },
        assignees: [
            {
                id: 0,
                user: { name: 'Kanye West', id: 10 },
                status: 'incomplete'
            },
            {
                id: 1,
                user: { name: 'The man formerly known as Prince and other things', id: 3 },
                status: 'incomplete'
            },
            {
                id: 2,
                user: { name: 'Shawn Carter', id: 2 },
                status: 'completed'
            }
        ],
        type: 'task',
        isPending: true
    },
    {
        createdAt: Date.now(),
        id: '148954',
        versionNumber: 1,
        createdBy: {
            name: 'The man formerly known as Prince and other things',
            id: 1
        },
        action: 'restore',
        type: 'file_version'
    },
    {
        createdAt: Date.now(),
        id: '14895356',
        versionNumber: 9,
        createdBy: { name: 'Abel Tesfaye', id: 13 },
        action: 'upload',
        type: 'file_version'
    },
    {
        createdAt: Date.now(),
        id: '14895357',
        versionNumber: 7,
        createdBy: { name: 'Abel Tesfaye', id: 13 },
        action: 'upload',
        type: 'file_version'
    },
    {
        createdAt: Date.now(),
        id: '14895358',
        versionNumber: 7,
        createdBy: { name: 'Abel Tesfaye', id: 13 },
        action: 'upload',
        type: 'file_version'
    },
    {
        createdAt: Date.now(),
        id: '14895359',
        versionNumber: 6,
        createdBy: { name: 'Abel Tesfaye', id: 13 },
        action: 'upload',
        type: 'file_version'
    },
    {
        createdAt: Date.now(),
        id: '14895360',
        versionNumber: 5,
        createdBy: { name: 'Abel Tesfaye', id: 13 },
        action: 'upload',
        type: 'file_version'
    },
    {
        createdAt: Date.now(),
        id: '14895361',
        versionNumber: 4,
        createdBy: { name: 'Abel Tesfaye', id: 13 },
        action: 'upload',
        type: 'file_version'
    }
];

const approverSelectorContacts = [
    {
        id: '213',
        name: 'Kylo Ren',
        item: { id: '213', email: 'kren@box.com', name: 'Kylo Ren' }
    },
    {
        id: '214',
        name: 'Han Solo',
        item: { id: '213', email: 'hsolo@box.com', name: 'Han Solo' }
    }
];

const mentionSelectorContacts = [
    { id: 1, name: 'Ken', item: { email: 'ken@box.com', id: 1, name: 'Ken' } },
    { id: 2, name: 'Ryu', item: { email: 'ryu@box.com', id: 2, name: 'Ryu' } },
    {
        id: 3,
        name: 'Guile',
        item: { email: 'guile@box.com', id: 3, name: 'Guile' }
    }
];

const translations = {
    translationEnabled: true,
    onTranslate: ({ id, taggedMessage }) => console.log(`AJAX translation: ${id} - ${taggedMessage}`)
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
        currentUser,
        approverSelectorContacts,
        mentionSelectorContacts
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
        <ActivityFeed feedState={feedState} inputState={inputState} handlers={handlers} translations={translations} />
    );

    return (
        <TabView defaultSelectedIndex={shouldShowSkills ? 0 : 1}>
            <Tab title={intl.formatMessage(messages.sidebarDetailsTitle)}>{Details}</Tab>
            <Tab title='Activity'>{ActivityFeedSidebar}</Tab>
        </TabView>
    );
};

export default injectIntl(Sidebar);
