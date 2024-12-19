import * as React from 'react';
import { FolderExternal, FolderPersonal, FolderShared } from '@box/blueprint-web-assets/icons/Content';
import { useIntl } from 'react-intl';

import messages from '../../elements/common/messages';

export interface FolderIconProps {
    /** Dimension of the icon */
    dimension?: number;
    /** If true displays collaborated folder icon */
    isCollab?: boolean;
    /** If true displays externally collaborated folder icon */
    isExternal?: boolean;
}

const FolderIcon = ({ dimension = 32, isCollab = false, isExternal = false }: FolderIconProps) => {
    const { formatMessage } = useIntl();
    if (isExternal) {
        return (
            <FolderExternal aria-label={formatMessage(messages.externalFolder)} height={dimension} width={dimension} />
        );
    }

    if (isCollab) {
        return (
            <FolderShared
                aria-label={formatMessage(messages.collaboratedFolder)}
                height={dimension}
                width={dimension}
            />
        );
    }

    return <FolderPersonal aria-label={formatMessage(messages.personalFolder)} height={dimension} width={dimension} />;
};

export default FolderIcon;
