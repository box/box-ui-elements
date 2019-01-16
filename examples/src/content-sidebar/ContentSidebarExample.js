import * as React from 'react';
import ContentSidebar from '../../../src/elements/content-sidebar';
import withConfig from '../withConfig';
import './ContentSidebarExample.scss';

const ContentSidebarExample = props => (
    <ContentSidebar
        {...props}
        detailsSidebarProps={{
            hasProperties: true,
            hasNotices: true,
            hasAccessStats: true,
            hasClassification: true,
            hasRetentionPolicy: true,
            hasVersions: true,
        }}
        hasActivityFeed
        hasMetadata
        hasSkills
    />
);

export default withConfig(ContentSidebarExample);
