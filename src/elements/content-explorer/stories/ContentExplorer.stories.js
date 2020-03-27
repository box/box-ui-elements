// @flow
import * as React from 'react';
import { IntlProvider } from 'react-intl';

import ContentExplorer from '../ContentExplorer';
import notes from './ContentExplorer.notes.md';

export const withPreview = () => (
    <IntlProvider locale="en">
        <ContentExplorer features={global.FEATURES} rootFolderId={global.FOLDER_ID} token={global.TOKEN} />
    </IntlProvider>
);

export const withPreviewSidebar = () => (
    <IntlProvider locale="en">
        <ContentExplorer
            contentPreviewProps={{
                contentSidebarProps: {
                    detailsSidebarProps: {
                        hasProperties: true,
                        hasNotices: true,
                        hasAccessStats: true,
                        hasClassification: true,
                        hasRetentionPolicy: true,
                        hasVersions: true,
                    },
                    features: global.FEATURES,
                    hasActivityFeed: true,
                    hasMetadata: true,
                    hasSkills: true,
                },
            }}
            features={global.FEATURES}
            rootFolderId={global.FOLDER_ID}
            token={global.TOKEN}
        />
    </IntlProvider>
);

export default {
    title: 'Elements|ContentExplorer',
    component: ContentExplorer,
    parameters: {
        notes,
    },
};
