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
import { SECTION_TARGETS, DETAILS_TARGETS } from '../../interactionTargets';
import { isBoxNote } from '../../util/file';
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
        <SidebarSection
            interactionTarget={SECTION_TARGETS.ACCESS_STATS}
            title={<FormattedMessage {...messages.sidebarAccessStats} />}
        >
            <AccessStats
                commentCount={comment_count}
                commentStatButtonProps={{ 'data-resin-target': DETAILS_TARGETS.ACCESS_STATS.COMMENTS }}
                downloadCount={download_count}
                downloadStatButtonProps={{ 'data-resin-target': DETAILS_TARGETS.ACCESS_STATS.DOWNLOADS }}
                previewCount={preview_count}
                previewStatButtonProps={{ 'data-resin-target': DETAILS_TARGETS.ACCESS_STATS.PREVIEWS }}
                editCount={edit_count}
                editStatButtonProps={{ 'data-resin-target': DETAILS_TARGETS.ACCESS_STATS.EDITS }}
                openAccessStatsModal={onAccessStatsClick}
                isBoxNote={isBoxNote(file)}
                viewStatButtonProps={{ 'data-resin-target': DETAILS_TARGETS.ACCESS_STATS.VIEW_DETAILS }}
            />
        </SidebarSection>
    );
};

export { SidebarAccessStats as SidebarAccessStatsComponent };
export default withErrorHandling(SidebarAccessStats);
