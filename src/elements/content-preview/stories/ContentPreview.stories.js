// @flow
import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ContentPreview from '../ContentPreview';

export const basic = {};

export const withAnnotations = {
    args: {
        contentSidebarProps: {
            detailsSidebarProps: {
                hasAccessStats: true,
                hasClassification: true,
                hasNotices: true,
                hasProperties: true,
                hasRetentionPolicy: true,
                hasVersions: true,
            },
            features: global.FEATURES,
            hasActivityFeed: true,
            hasMetadata: true,
            hasSkills: true,
            hasVersions: true,
        },
        showAnnotations: true,
    },
};

export const withSidebar = {
    args: {
        contentSidebarProps: {
            detailsSidebarProps: {
                hasAccessStats: true,
                hasClassification: true,
                hasNotices: true,
                hasProperties: true,
                hasRetentionPolicy: true,
                hasVersions: true,
            },
            features: global.FEATURE_FLAGS,
            hasActivityFeed: true,
            hasMetadata: true,
            hasSkills: true,
            hasVersions: true,
        },
    },
};

export const withBoxAI = {
    args: {
        contentAnswersProps: {
            show: true,
            isCitationsEnabled: true,
            isMarkdownEnabled: true,
        },
    },
};

export default {
    title: 'Elements/ContentPreview',
    component: ContentPreview,
    render: ({ ...args }: any) => (
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
