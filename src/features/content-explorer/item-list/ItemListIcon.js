import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { ItemTypePropType } from '../prop-types';
import { getIcon } from '../../../elements/common/item/iconCellRenderer';

const ItemListIcon = ({ intl, type, extension = '', hasCollaborations = false, isExternallyOwned = false }) =>
    getIcon(intl, { type, extension, has_collaborations: hasCollaborations, is_externally_owned: isExternallyOwned });

ItemListIcon.propTypes = {
    intl: PropTypes.any,
    type: ItemTypePropType,
    extension: PropTypes.string,
    hasCollaborations: PropTypes.bool,
    isExternallyOwned: PropTypes.bool,
};

export { ItemListIcon as ItemListIconCore };
export default injectIntl(ItemListIcon);
