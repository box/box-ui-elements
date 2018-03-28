/**
 * @flow
 * @file Versions sidebar component
 * @author Box
 */

import React from 'react';
import AccessStatsComponent from 'box-react-ui/lib/features/access-stats/AccessStats';
import { FormattedMessage, injectIntl } from 'react-intl';
import SidebarSection from './SidebarSection';
import type { AccessStats } from '../../flowTypes';
import messages from '../messages';

type Props = {
    onAccessStatsClick?: Function,
    accessStats: AccessStats
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
        edit_count: 0
    }
}: Props) => {
    const { preview_count, comment_count, download_count, edit_count } = accessStats;

    if (!preview_count && !comment_count && !download_count && !edit_count) {
        return null;
    }

    return (
        <SidebarSection title={<FormattedMessage {...messages.sidebarAccessStats} />}>
            <AccessStatsComponent
                commentCount={comment_count}
                downloadCount={download_count}
                previewCount={preview_count}
                editCount={edit_count}
                openAccessStatsModal={onAccessStatsClick}
                maxEvents={MAX_EVENTS}
            />
        </SidebarSection>
    );
};

export default injectIntl(SidebarVersions);
