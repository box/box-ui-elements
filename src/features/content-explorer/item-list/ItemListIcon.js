import React from 'react';
import PropTypes from 'prop-types';

import { ItemTypePropType } from '../prop-types';
import IconCell from '../../../elements/common/item/IconCell';

const ItemListIcon = ({ type, extension, hasCollaborations = false, isExternallyOwned = false }) => {
    const rowData = { type, extension, has_collaborations: hasCollaborations, is_externally_owned: isExternallyOwned };
    return <IconCell rowData={rowData} />;
};

ItemListIcon.propTypes = {
    type: ItemTypePropType,
    extension: PropTypes.string,
    hasCollaborations: PropTypes.bool,
    isExternallyOwned: PropTypes.bool,
};

export default ItemListIcon;
