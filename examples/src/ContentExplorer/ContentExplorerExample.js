import * as React from 'react';
import ContentExplorer from '../../../src/components/ContentExplorer/ContentExplorer';
import withConfig from '../withConfig';
import './ContentExplorerExample.scss';

const ContentExplorerExample = (props) => (
    <ContentExplorer
        {...props}
        contentPreviewProps={{
            contentSidebarProps: {
                hasActivityFeed: true,
                hasSkills: true,
                hasMetadata: true,
                detailsSidebarProps: {
                    hasProperties: true,
                    hasNotices: true,
                    hasAccessStats: true,
                    hasClassification: true,
                    hasRetentionPolicy: true,
                    hasVersions: true
                }
            }
        }}
    />
);

export default withConfig(ContentExplorerExample);
