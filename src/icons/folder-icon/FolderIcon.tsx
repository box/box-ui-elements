import * as React from 'react';

import { Archive, FolderArchive } from '@box/blueprint-web-assets/icons/Content';
import IconFolderCollab from '../../icon/content/FolderShared32';
import IconFolderExternal from '../../icon/content/FolderExternal32';
import IconFolderPersonal from '../../icon/content/FolderPersonal32';

interface FolderIconProps {
    /** Dimension of the icon */
    dimension?: number;
    /** If true displays archive icon */
    isArchive?: boolean;
    /** If true displays archived folder icon */
    isArchivedFolder?: boolean;
    /** If true displays collaborated folder icon */
    isCollab?: boolean;
    /** If true displays externally collaborated folder icon */
    isExternal?: boolean;
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.ReactElement<string>;
}

const FolderIcon = ({
    dimension = 32,
    isArchive = false,
    isArchivedFolder = false,
    isCollab = false,
    isExternal = false,
    title,
}: FolderIconProps) => {
    if (isExternal) {
        return <IconFolderExternal height={dimension} title={title} width={dimension} />;
    }

    if (isCollab) {
        return <IconFolderCollab height={dimension} title={title} width={dimension} />;
    }

    if (isArchive) {
        return <Archive height={dimension} title={title} width={dimension} />;
    }

    if (isArchivedFolder) {
        return <FolderArchive height={dimension} title={title} width={dimension} />;
    }

    return <IconFolderPersonal height={dimension} title={title} width={dimension} />;
};

export default FolderIcon;
