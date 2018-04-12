/**
 * @flow
 * @file Versions sidebar component
 * @author Box
 */

import React from 'react';
import AccessStats from 'box-react-ui/lib/features/access-stats/AccessStats';
import { FormattedMessage } from 'react-intl';
import SidebarSection from './SidebarSection';
import type { FileAccessStats, BoxItem } from '../../flowTypes';
import messages from '../messages';
import { BOX_NOTE_EXTENSION } from '../../constants';
import withErrorHandling from './withErrorHandling';

type Props = {
    onAccessStatsClick?: Function,
    accessStats?: FileAccessStats,
    file: BoxItem
};

const SidebarAccessStats = ({
    onAccessStatsClick,
    accessStats = {
        preview_count: 0,
        comment_count: 0,
        download_count: 0,
        edit_count: 0,
        has_count_overflowed: false
    },
    file
}: Props) => {
    const { preview_count, comment_count, download_count, edit_count } = accessStats;

    if (!preview_count && !comment_count && !download_count && !edit_count) {
        return null;
    }

    return (
        <SidebarSection title={<FormattedMessage {...messages.sidebarAccessStats} />}>
            <AccessStats
                commentCount={comment_count}
                downloadCount={download_count}
                previewCount={preview_count}
                editCount={edit_count}
                openAccessStatsModal={onAccessStatsClick}
                isBoxNote={file.extension === BOX_NOTE_EXTENSION}
            />
        </SidebarSection>
    );
};

export { SidebarAccessStats as SidebarAccessStatsComponent };
export default withErrorHandling(SidebarAccessStats);
