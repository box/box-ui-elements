/**
 * @flow
 * @file Versions sidebar component
 * @author Box
 */

import React from 'react';
import VersionHistoryLink from 'box-react-ui/lib/features/item-details/VersionHistoryLink';

import { DETAILS_TARGETS } from '../../interactionTargets';
import { isBoxNote } from '../../util/file';

type Props = {
    onVersionHistoryClick?: Function,
    file: BoxItem,
};

const SidebarVersions = ({ onVersionHistoryClick, file }: Props) => {
    const { version_number } = file;

    const versionNumber = parseInt(version_number, 10);

    if (isBoxNote(file) || !versionNumber || versionNumber <= 1) {
        return null;
    }

    return (
        <VersionHistoryLink
            data-resin-target={DETAILS_TARGETS.VERSION_HISTORY}
            onClick={onVersionHistoryClick}
            versionCount={versionNumber}
        />
    );
};

export default SidebarVersions;
