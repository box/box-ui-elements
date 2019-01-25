import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import BookmarkIcon from '../../../icons/bookmark-icon';
import FileIcon from '../../../icons/file-icon';
import FolderIcon from '../../../icons/folder-icon';

import ItemTypes from '../item-types';
import { ItemTypePropType } from '../prop-types';
import messages from '../messages';

const ItemListIcon = ({ type, extension = '', hasCollaborations = false, isExternallyOwned = false }) => {
    switch (type) {
        case ItemTypes.FOLDER: {
            let titleID = 'personalFolder';
            if (hasCollaborations) {
                titleID = 'collaboratedFolder';
            } else if (isExternallyOwned) {
                titleID = 'externalFolder';
            }
            return (
                <FolderIcon
                    isCollab={hasCollaborations}
                    isExternal={isExternallyOwned}
                    title={<FormattedMessage {...messages[titleID]} />}
                />
            );
        }
        case ItemTypes.FILE:
            return <FileIcon extension={extension} title={<FormattedMessage {...messages.file} />} />;
        case ItemTypes.BOOKMARK:
            return <BookmarkIcon title={<FormattedMessage {...messages.bookmark} />} />;
        default:
            // Use generic file icon as fallback
            return <FileIcon title={<FormattedMessage {...messages.file} />} />;
    }
};

ItemListIcon.propTypes = {
    type: ItemTypePropType,
    extension: PropTypes.string,
    hasCollaborations: PropTypes.bool,
    isExternallyOwned: PropTypes.bool,
};

export default ItemListIcon;
