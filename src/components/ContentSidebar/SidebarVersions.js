/**
 * @flow
 * @file Versions sidebar component
 * @author Box
 */

import React from 'react';
import VersionHistoryLink from 'box-react-ui/lib/features/item-details/VersionHistoryLink';
import SidebarSection from './SidebarSection';
import type { FileVersions } from '../../flowTypes';

type Props = {
    onVersionHistoryClick?: Function,
    versions: FileVersions
};

const SidebarVersions = ({
    onVersionHistoryClick,
    versions = {
        total_count: 0
    }
}: Props) => {
    const { total_count } = versions;

    if (!total_count) {
        return null;
    }

    return (
        <SidebarSection>
            <VersionHistoryLink onClick={onVersionHistoryClick} versionCount={total_count + 1} />
        </SidebarSection>
    );
};

export default SidebarVersions;
