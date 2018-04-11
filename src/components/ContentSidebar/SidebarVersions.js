/**
 * @flow
 * @file Versions sidebar component
 * @author Box
 */

import React from 'react';
import VersionHistoryLink from 'box-react-ui/lib/features/item-details/VersionHistoryLink';
import type { BoxItem, FileVersions } from '../../flowTypes';
import { BOX_NOTE_EXTENSION } from '../../constants';

type Props = {
    onVersionHistoryClick?: Function,
    versions?: FileVersions,
    file: BoxItem
};

const SidebarVersions = ({
    onVersionHistoryClick,
    versions = {
        total_count: 0
    },
    file
}: Props) => {
    const { total_count } = versions;

    if (!total_count || file.extension === BOX_NOTE_EXTENSION) {
        return null;
    }

    return <VersionHistoryLink onClick={onVersionHistoryClick} versionCount={total_count + 1} />;
};

export default SidebarVersions;
