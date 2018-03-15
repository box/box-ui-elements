/**
 * @flow
 * @file Versions sidebar component
 * @author Box
 */

import React from 'react';
import VersionHistoryLink from 'box-react-ui/lib/features/item-details/VersionHistoryLink';
import type { FileVersions } from '../../flowTypes';

type Props = {
    onVersionHistoryClick?: Function,
    versions: FileVersions
};

const SidebarVersions = ({ onVersionHistoryClick, versions }: Props) => {
    const { total_count } = versions;

    if (!total_count) {
        return null;
    }

    return (
        <section className='bcs-section'>
            <VersionHistoryLink onClick={onVersionHistoryClick} versionCount={total_count + 1} />
        </section>
    );
};

SidebarVersions.defaultProps = {
    versions: {
        total_count: 0
    }
};

export default SidebarVersions;
