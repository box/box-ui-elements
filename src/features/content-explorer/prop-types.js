import PropTypes from 'prop-types';

import ContentExplorerModes from './modes';
import ItemTypes from './item-types';

const ContentExplorerModePropType = PropTypes.oneOf([
    ContentExplorerModes.SELECT_FILE,
    ContentExplorerModes.SELECT_FOLDER,
    ContentExplorerModes.MOVE_COPY,
    ContentExplorerModes.MULTI_SELECT,
]);

const FolderPropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
});

const FoldersPathPropType = PropTypes.arrayOf(FolderPropType);

const ItemTypePropType = PropTypes.oneOf([ItemTypes.FILE, ItemTypes.FOLDER, ItemTypes.BOOKMARK]);

const ItemPropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: ItemTypePropType,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    extension: PropTypes.string,
    hasCollaborations: PropTypes.bool,
    isExternallyOwned: PropTypes.bool,
    isDisabled: PropTypes.bool,
    isActionDisabled: PropTypes.bool,
});

const PlaceholderPropType = PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    loadingPlaceholderColumnWidths: PropTypes.arrayOf(PropTypes.string),
});

const ItemOrPlaceholderPropType = PropTypes.oneOfType([ItemPropType, PlaceholderPropType]);

const ItemsPropType = PropTypes.arrayOf(ItemOrPlaceholderPropType);

const ItemsMapPropType = PropTypes.objectOf(ItemPropType);

export {
    ContentExplorerModePropType,
    FolderPropType,
    FoldersPathPropType,
    ItemTypePropType,
    ItemPropType,
    ItemsPropType,
    ItemsMapPropType,
};
