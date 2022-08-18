import * as React from 'react';
import { IntlProvider } from 'react-intl';
import ContentSidebar from '../ContentSidebar';
import notes from './ContentSidebar.notes.md';

export const Sidebar = () => (
    <IntlProvider locale="en">
        <ContentSidebar
            detailsSidebarProps={{
                hasProperties: true,
                hasNotices: true,
                hasAccessStats: true,
                hasClassification: true,
                hasRetentionPolicy: true,
            }}
            features={global.FEATURES}
            fileId={global.FILE_ID}
            hasActivityFeed
            hasMetadata
            hasSkills
            hasVersions
            token={global.TOKEN}
            {...global.PROPS}
        />
    </IntlProvider>
);

export default {
    title: 'Elements|ContentSidebar',
    Component: ContentSidebar,
    parameters: {
        notes,
    },
};
