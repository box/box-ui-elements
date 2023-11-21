// @flow
import * as React from 'react';
import { text } from '@storybook/addon-knobs';
import { IntlProvider } from 'react-intl';
import ContentPreview from '../ContentPreview';
import notes from './ContentPreview.notes.md';

export const Preview = () => {
    const fileId = text('File ID', global.FILE_ID);
    const token = text('Access Token', global.TOKEN);

    return (
        <IntlProvider locale="en">
            <ContentPreview
                key={`${fileId}-${token}`}
                features={global.FEATURES}
                fileId={fileId}
                hasHeader
                token={token}
            />
        </IntlProvider>
    );
};

export const PreviewWithAnnotations = () => {
    const fileId = text('File ID', global.FILE_ID);
    const token = text('Access Token', global.TOKEN);

    return (
        <IntlProvider locale="en">
            <ContentPreview
                key={`${fileId}-${token}`}
                contentSidebarProps={{
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
                }}
                features={global.FEATURES}
                fileId={fileId}
                hasHeader
                showAnnotations
                token={token}
            />
        </IntlProvider>
    );
};

export const PreviewWithSidebar = () => {
    const fileId = text('File ID', global.FILE_ID);
    const token = text('Access Token', global.TOKEN);

    return (
        <IntlProvider locale="en">
            <ContentPreview
                key={`${fileId}-${token}`}
                contentSidebarProps={{
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
                }}
                features={global.FEATURES}
                fileId={fileId}
                hasHeader
                token={token}
            />
        </IntlProvider>
    );
};

export const PreviewWithBoxAI = () => {
    const fileId = text('File ID', global.FILE_ID);
    const token = text('Access Token', global.TOKEN);

    return (
        <IntlProvider locale="en">
            <ContentPreview
                key={`${fileId}-${token}`}
                contentAnswersProps={{
                    show: true,
                }}
                features={global.FEATURES}
                fileId={fileId}
                hasHeader
                token={token}
            />
        </IntlProvider>
    );
};

export default {
    title: 'Elements|ContentPreview',
    component: ContentPreview,
    parameters: {
        notes,
    },
};
