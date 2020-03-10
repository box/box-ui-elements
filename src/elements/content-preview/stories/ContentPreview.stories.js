// @flow
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { text } from '@storybook/addon-knobs';

import ContentPreview from '../ContentPreview';
import notes from './ContentPreview.notes.md';

export const Preview = () => (
    <IntlProvider locale="en">
        <ContentPreview
            features={global.FEATURES}
            fileId={text('File ID', global.FILE_ID)}
            token={text('Token', global.TOKEN)}
        />
    </IntlProvider>
);

export const PreviewWithAnnotations = () => {
    return (
        <IntlProvider locale="en">
            <ContentPreview
                features={global.FEATURES}
                fileId={text('File ID', global.FILE_ID)}
                hasHeader
                showAnnotations
                token={text('Access Token', global.TOKEN)}
            />
        </IntlProvider>
    );
};

export const PreviewWithSidebar = () => (
    <IntlProvider locale="en">
        <ContentPreview
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
            fileId={text('File ID', global.FILE_ID)}
            hasHeader
            token={text('Token', global.TOKEN)}
        />
    </IntlProvider>
);

export default {
    title: 'Elements|ContentPreview',
    component: ContentPreview,
    parameters: {
        notes,
    },
};
