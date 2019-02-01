// @flow
import * as React from 'react';

import IconFolderCollab from '../folder/IconFolderCollab';
import IconFolderExternal from '../folder/IconFolderExternal';
import IconFolderPersonal from '../folder/IconFolderPersonal';

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
