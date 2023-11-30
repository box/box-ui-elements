// @flow
import * as React from 'react';
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
        },
    },
};

export default {
    title: 'Elements/ContentPreview',
    component: ContentPreview,
    render: ({ ...args }: any) => <ContentPreview key={`${args.fileId}-${args.token}`} {...args} />,
    args: {
        features: global.FEATURE_FLAGS,
        fileId: global.FILE_ID,
        hasHeader: true,
        token: global.TOKEN,
    },
};
