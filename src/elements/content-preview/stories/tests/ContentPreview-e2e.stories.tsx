import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ContentPreview from '../../ContentPreview';
import { testFileIds } from '../../../../../test/support/constants';

export const fileVersion = {
    args: {
        collection: Object.values(testFileIds),
        contentSidebarProps: {
            hasActivityFeed: true,
            hasSkills: true,
            hasVersions: true,
            detailsSidebarProps: {
                hasAccessStats: true,
                hasClassification: true,
                hasNotices: true,
                hasProperties: true,
                hasRetentionPolicy: true,
                hasVersions: true,
            },
        },
        fileId: testFileIds.FILE_ID_DOC_VERSIONED,
    },
};

export const noSidebar = {
    args: {
        fileId: testFileIds.FILE_ID_SKILLS,
    },
};

export const withSidebar = {
    args: {
        collection: Object.values(testFileIds),
        contentSidebarProps: {
            hasActivityFeed: true,
            hasSkills: true,
            detailsSidebarProps: {
                hasAccessStats: true,
                hasClassification: true,
                hasNotices: true,
                hasProperties: true,
                hasRetentionPolicy: true,
                hasVersions: true,
            },
        },
        fileId: testFileIds.FILE_ID_SKILLS,
    },
};

export default {
    title: 'Elements/ContentPreview/tests/e2e',
    component: ContentPreview,
    render: ({ ...args }) => (
        <Router>
            <ContentPreview key={`${args.fileId}-${args.token}`} {...args} />
        </Router>
    ),
    args: {
        features: global.FEATURE_FLAGS,
        fileId: global.FILE_ID,
        hasHeader: true,
        token: global.TOKEN,
    },
    parameters: {
        chromatic: {
            disableSnapshot: true,
        },
    },
};
