/**
 * @flow
 * @file Versions sidebar component
 * @author Box
 */

import React from 'react';
import AccessStatsComponent from 'box-react-ui/lib/features/access-stats/AccessStats';
import SidebarSection from './SidebarSection';
import type { AccessStats } from '../../flowTypes';

type Props = {
    onAccessStatsClick?: Function,
    accessStats: AccessStats
};

const SidebarVersions = ({
    onAccessStatsClick,
    accessStats = {
        preview_count: 0,
        comment_count: 0,
        download_count: 0,
        edit_count: 0
    }
}: Props) => {
    const { preview_count, comment_count, download_count, edit_count } = accessStats;

    if (!preview_count && !comment_count && !download_count) {
        return null;
    }

    return (
        <SidebarSection title='Access Stats'>
            <AccessStatsComponent
                commentCount={comment_count}
                downloadCount={download_count}
                previewCount={preview_count}
                editCount={edit_count}
                openAccessStatsModal={onAccessStatsClick}
            />
        </SidebarSection>
    );
};

export default SidebarVersions;
