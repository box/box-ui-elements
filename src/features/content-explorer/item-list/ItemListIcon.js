import * as React from 'react';
import PropTypes from 'prop-types';

import { ItemTypePropType, ItemArchiveTypePropType } from '../prop-types';
import IconCell from '../../../elements/common/item/IconCell';

const ItemListIcon = ({ archiveType, extension, type, hasCollaborations = false, isExternallyOwned = false }) => {
    const rowData = {
        type,
        extension,
        hasCollaborations,
        isExternallyOwned,
        archiveType,
    };
    return <IconCell rowData={rowData} />;
};

ItemListIcon.propTypes = {
    type: ItemTypePropType,
    extension: PropTypes.string,
    hasCollaborations: PropTypes.bool,
    isExternallyOwned: PropTypes.bool,
    archiveType: ItemArchiveTypePropType,
};

export default ItemListIcon;
