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
    file: BoxItem,
    _internalProps: Object
};

const SidebarVersions = ({ _internalProps, file }: Props) => {
    const { version_number } = file;

    const versionNumber = parseInt(version_number, 10);

    if (isBoxNote(file) || !versionNumber || versionNumber <= 1) {
        return null;
    }

    return (
        <VersionHistoryLink
            data-resin-target={DETAILS_TARGETS.VERSION_HISTORY}
            onClick={_internalProps.onVersionHistoryClick}
            versionCount={versionNumber}
        />
    );
};

export default SidebarVersions;
