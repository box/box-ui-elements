/**
 * @flow
 * @file Versions sidebar component
 * @author Box
 */

import React from 'react';
import VersionHistoryLink from 'box-react-ui/lib/features/item-details/VersionHistoryLink';
import withErrorHandling from './withErrorHandling';
import type { BoxItem, FileVersions } from '../../flowTypes';
import { DETAILS_TARGETS } from '../../interactionTargets';
import { isBoxNote } from '../../util/file';

type Props = {
    onVersionHistoryClick?: Function,
    versions?: FileVersions,
    file: BoxItem
};

const SidebarVersions = ({
    onVersionHistoryClick,
    versions = {
        total_count: 0,
        entries: []
    },
    file
}: Props) => {
    const { total_count } = versions;

    if (!total_count || isBoxNote(file)) {
        return null;
    }

    return (
        <VersionHistoryLink
            data-resin-target={DETAILS_TARGETS.VERSION_HISTORY}
            onClick={onVersionHistoryClick}
            versionCount={total_count + 1}
        />
    );
};

export { SidebarVersions as SidebarVersionsComponent };
export default withErrorHandling(SidebarVersions);
