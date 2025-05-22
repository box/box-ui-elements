import * as React from 'react';
import PropTypes from 'prop-types';

import { ItemTypePropType, ItemArchiveTypePropType } from '../prop-types';
import IconCell from '../../../elements/common/item/IconCell';

const ItemListIcon = ({
    archiveType,
    extension,
    type,
    hasCollaborations = false,
    isExternallyOwned = false,
    dimension = 32,
}) => {
    const rowData = {
        type,
        extension,
        has_collaborations: hasCollaborations,
        is_externally_owned: isExternallyOwned,
        archive_type: archiveType,
    };
    return <IconCell rowData={rowData} dimension={dimension} />;
};

ItemListIcon.propTypes = {
    type: ItemTypePropType,
    extension: PropTypes.string,
    hasCollaborations: PropTypes.bool,
    isExternallyOwned: PropTypes.bool,
    archiveType: ItemArchiveTypePropType,
};

export default ItemListIcon;
