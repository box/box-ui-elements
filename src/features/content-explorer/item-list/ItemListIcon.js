import PropTypes from 'prop-types';

import { ItemTypePropType } from '../prop-types';
import { getIcon } from '../../../elements/common/item/iconCellRenderer';

const ItemListIcon = ({ type, extension = '', hasCollaborations = false, isExternallyOwned = false }) =>
    getIcon({ type, extension, has_collaborations: hasCollaborations, is_externally_owned: isExternallyOwned });

ItemListIcon.propTypes = {
    type: ItemTypePropType,
    extension: PropTypes.string,
    hasCollaborations: PropTypes.bool,
    isExternallyOwned: PropTypes.bool,
};

export default ItemListIcon;
