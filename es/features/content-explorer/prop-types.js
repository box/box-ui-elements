import PropTypes from 'prop-types';
import ContentExplorerModes from './modes';
import { TYPE_ARCHIVE, TYPE_ARCHIVE_FILE, TYPE_ARCHIVE_FOLDER, TYPE_ARCHIVE_WEB_LINK, TYPE_FILE, TYPE_FOLDER, TYPE_WEBLINK } from '../../constants';
const ContentExplorerModePropType = PropTypes.oneOf([ContentExplorerModes.COPY, ContentExplorerModes.MOVE_COPY, ContentExplorerModes.MULTI_SELECT, ContentExplorerModes.SELECT_FILE, ContentExplorerModes.SELECT_FOLDER]);
const FolderPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
});
const FoldersPathPropType = PropTypes.arrayOf(FolderPropType);
const ItemTypePropType = PropTypes.oneOf([TYPE_FILE, TYPE_FOLDER, TYPE_WEBLINK]);
const ItemArchiveTypePropType = PropTypes.oneOf([TYPE_ARCHIVE, TYPE_ARCHIVE_FOLDER, TYPE_ARCHIVE_WEB_LINK, TYPE_ARCHIVE_FILE]);
const ItemPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  type: ItemTypePropType,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  archiveType: ItemArchiveTypePropType,
  extension: PropTypes.string,
  hasCollaborations: PropTypes.bool,
  isExternallyOwned: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isActionDisabled: PropTypes.bool
});
const PlaceholderPropType = PropTypes.shape({
  isLoading: PropTypes.bool.isRequired,
  loadingPlaceholderColumnWidths: PropTypes.arrayOf(PropTypes.string)
});
const ItemOrPlaceholderPropType = PropTypes.oneOfType([ItemPropType, PlaceholderPropType]);
const ItemsPropType = PropTypes.arrayOf(ItemOrPlaceholderPropType);
const ItemsMapPropType = PropTypes.objectOf(ItemPropType);
const BreadcrumbPropType = PropTypes.shape({
  className: PropTypes.string,
  itemsBeforeOverflow: PropTypes.number,
  overflowIcon: PropTypes.node,
  threshold: PropTypes.number
});
export { BreadcrumbPropType, ContentExplorerModePropType, FolderPropType, FoldersPathPropType, ItemTypePropType, ItemPropType, ItemsPropType, ItemsMapPropType, ItemArchiveTypePropType };
//# sourceMappingURL=prop-types.js.map