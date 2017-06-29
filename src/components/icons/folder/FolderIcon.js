/**
 * @flow
 * @file Determines folder icon
 * @author Box
 */

import React from 'react';
import { IconFolderCollab, IconFolderExternal, IconFolderPersonal } from './';

type Props = {
    isExternal: boolean,
    isCollab: boolean,
    dimension: number
};

const FolderIcon = ({ isExternal = false, isCollab = false, dimension = 32 }: Props) => {
    if (isExternal) {
        return <IconFolderExternal height={dimension} width={dimension} />;
    }

    if (isCollab) {
        return <IconFolderCollab height={dimension} width={dimension} />;
    }

    return <IconFolderPersonal height={dimension} width={dimension} />;
};

export default FolderIcon;
