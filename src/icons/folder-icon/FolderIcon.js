// @flow
import * as React from 'react';

import IconFolderCollab from '../imported/IconFolderShared32';
import IconFolderExternal from '../imported/IconFolderExternal32';
import IconFolderPersonal from '../imported/IconFolderPersonal32';

type Props = {
    /** Dimension of the icon */
    dimension?: number,
    /** If true displays collaborated folder icon */
    isCollab?: boolean,
    /** If true displays externally collaborated folder icon */
    isExternal?: boolean,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
};

const FolderIcon = ({ dimension = 32, isCollab = false, isExternal = false, title }: Props) => {
    if (isExternal) {
        return <IconFolderExternal height={dimension} title={title} width={dimension} />;
    }

    if (isCollab) {
        return <IconFolderCollab height={dimension} title={title} width={dimension} />;
    }

    return <IconFolderPersonal height={dimension} title={title} width={dimension} />;
};

export default FolderIcon;
