// @flow
import * as React from 'react';
import { IntlProvider } from 'react-intl';

import ContentPreview from '../ContentPreview';
import notes from './ContentPreview.notes.md';

export const Preview = () => (
    <IntlProvider locale="en">
        <ContentPreview hasHeader features={global.FEATURES} fileId={global.FILE_ID} token={global.TOKEN} />
    </IntlProvider>
);

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
            hasHeader
            features={global.FEATURES}
            fileId={global.FILE_ID}
            token={global.TOKEN}
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
