/**
 * @flow
 * @file Versions sidebar component
 * @author Box
 */

import React from 'react';
import AccessStats from 'box-react-ui/lib/features/access-stats/AccessStats';
import { injectIntl, FormattedMessage } from 'react-intl';
import SidebarSection from './SidebarSection';
import messages from '../messages';
import { INTERACTION_TARGET, SECTION_TARGETS, DETAILS_TARGETS } from '../../interactionTargets';
import { isBoxNote } from '../../util/file';
import withErrorHandling from './withErrorHandling';

type Props = {
    onAccessStatsClick?: Function,
    accessStats?: FileAccessStats,
    file: BoxItem,
    error?: MessageDescriptor,
    intl: any,
    isLoading?: boolean,
};

const SidebarAccessStats = ({
    onAccessStatsClick,
    accessStats = {
        preview_count: 0,
        comment_count: 0,
        download_count: 0,
        edit_count: 0,
        has_count_overflowed: false,
    },
    file,
    error,
    intl,
    isLoading = false,
}: Props) => {
    const { preview_count, comment_count, download_count, edit_count } = accessStats;

    if (isLoading) {
        return null;
    }

    const errorMessage = error ? intl.formatMessage(error) : undefined;

    return (
        <SidebarSection
            interactionTarget={SECTION_TARGETS.ACCESS_STATS}
            title={<FormattedMessage {...messages.sidebarAccessStats} />}
        >
            <AccessStats
                errorMessage={errorMessage}
                commentCount={comment_count}
                commentStatButtonProps={{
                    [INTERACTION_TARGET]: DETAILS_TARGETS.ACCESS_STATS.COMMENTS,
                }}
                downloadCount={download_count}
                downloadStatButtonProps={{
                    [INTERACTION_TARGET]: DETAILS_TARGETS.ACCESS_STATS.DOWNLOADS,
                }}
                previewCount={preview_count}
                previewStatButtonProps={{
                    [INTERACTION_TARGET]: DETAILS_TARGETS.ACCESS_STATS.PREVIEWS,
                }}
                viewStatButtonProps={{
                    [INTERACTION_TARGET]: DETAILS_TARGETS.ACCESS_STATS.VIEWS,
                }}
                editCount={edit_count}
                editStatButtonProps={{
                    [INTERACTION_TARGET]: DETAILS_TARGETS.ACCESS_STATS.EDITS,
                }}
                openAccessStatsModal={onAccessStatsClick}
                isBoxNote={isBoxNote(file)}
                viewMoreButtonProps={{
                    [INTERACTION_TARGET]: DETAILS_TARGETS.ACCESS_STATS.VIEW_DETAILS,
                }}
            />
        </SidebarSection>
    );
};

export { SidebarAccessStats as SidebarAccessStatsComponent };
export default withErrorHandling(injectIntl(SidebarAccessStats));
