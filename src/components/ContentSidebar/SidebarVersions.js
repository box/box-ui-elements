/**
 * @flow
 * @file Versions sidebar component
 * @author Box
 */

import React from 'react';
import VersionHistoryLink from 'box-react-ui/lib/features/item-details/VersionHistoryLink';
import type { BoxItem } from '../../flowTypes';
import { isBoxNote } from '../../util/file';

type Props = {
    onVersionHistoryClick?: Function,
    file: BoxItem
};

const SidebarVersions = ({ onVersionHistoryClick, file }: Props) => {
    const { version_number } = file;

    if (isBoxNote(file) || !version_number) {
        return null;
    }

    return <VersionHistoryLink onClick={onVersionHistoryClick} versionCount={parseInt(version_number, 10)} />;
};

export default SidebarVersions;
