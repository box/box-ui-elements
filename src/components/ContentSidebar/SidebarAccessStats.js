/**
 * @flow
 * @file Versions sidebar component
 * @author Box
 */

import React from 'react';
import AccessStats from 'box-react-ui/lib/features/access-stats/AccessStats';
import { FormattedMessage, injectIntl } from 'react-intl';
import SidebarSection from './SidebarSection';
import type { FileAccessStats, BoxItem } from '../../flowTypes';
import messages from '../messages';
import { BOX_NOTE_EXTENSION } from '../../constants';

type Props = {
    onAccessStatsClick?: Function,
    accessStats?: FileAccessStats,
    file: BoxItem
};

// The AccessStats component requires a maximum number of events
// TODO (@ddemicco): Revisit this during API integration
const MAX_EVENTS = Number.MAX_SAFE_INTEGER;

const SidebarVersions = ({
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
                maxEvents={MAX_EVENTS}
                isBoxNote={file.extension === BOX_NOTE_EXTENSION}
            />
        </SidebarSection>
    );
};

export default injectIntl(SidebarVersions);
