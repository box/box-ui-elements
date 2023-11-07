// @flow

import * as React from 'react';
import { IntlProvider } from 'react-intl';
import ContentExplorer from '../ContentExplorer';

export const withPreview = (args: any) => (
    <IntlProvider locale="en">
        <ContentExplorer features={global.FEATUREFLIPS} {...args} />
    </IntlProvider>
);

export const withPreviewSidebar = (args: any) => (
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
                    features: global.FEATUREFLIPS,
                    hasActivityFeed: true,
                    hasMetadata: true,
                    hasSkills: true,
                },
            }}
            features={global.FEATUREFLIPS}
            {...args}
        />
    </IntlProvider>
);

export default {
    title: 'Elements/ContentExplorer',
    component: ContentExplorer,
    tags: ['autodocs'],
    args: {
        folderId: global.FOLDER_ID,
        token: global.TOKEN,
    },
};
