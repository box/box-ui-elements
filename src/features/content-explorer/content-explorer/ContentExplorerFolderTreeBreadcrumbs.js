import * as React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';

import Arrow16 from '../../../icon/fill/Arrow16';
import Button from '../../../components/button';
import DropdownMenu from '../../../components/dropdown-menu/DropdownMenu';
import IconFolderTree from '../../../icons/general/IconFolderTree';
import { Menu, MenuItem } from '../../../components/menu';

import { FoldersPathPropType } from '../prop-types';
// eslint-disable-next-line import/no-named-as-default
import messages from '../messages';
import {
    FOLDER_TREE_ICON_HEIGHT,
    FOLDER_TREE_ICON_WIDTH,
    BREADCRUMB_ARROW_ICON_HEIGHT,
    BREADCRUMB_ARROW_ICON_WIDTH,
    BREADCRUMB_ARROW_ICON_VIEWBOX,
} from './constants';

const ContentExplorerFolderTreeBreadcrumbs = ({
    foldersPath,
    intl: { formatMessage, formatNumber },
    isFolderTreeButtonHidden,
    numTotalItems,
    onBreadcrumbClick,
}) => {
    const currentFolderName = foldersPath[foldersPath.length - 1].name;
    const foldersPathWithoutLast = foldersPath.slice(0, -1);
    return (
        <div className="bdl-ContentExplorerFolderTreeBreadcrumbs">
            {!isFolderTreeButtonHidden && (
                <DropdownMenu>
                    <Button
                        aria-label={formatMessage(messages.clickToViewPath)}
                        className="bdl-ContentExplorerFolderTreeBreadcrumbs-button"
                        title={formatMessage(messages.filePath)}
                        type="button"
                    >
                        <IconFolderTree height={FOLDER_TREE_ICON_HEIGHT} width={FOLDER_TREE_ICON_WIDTH} />
                    </Button>
                    <Menu>
                        {foldersPathWithoutLast.map((folder, i) => (
                            <MenuItem
                                data-testid="folder-tree-item"
                                key={folder.id}
                                onClick={event => onBreadcrumbClick(i, event)}
                            >
                                {folder.name}
                            </MenuItem>
                        ))}
                    </Menu>
                </DropdownMenu>
            )}
            {!isFolderTreeButtonHidden && (
                <Arrow16
                    className="bdl-ContentExplorerFolderTreeBreadcrumbs-icon"
                    height={BREADCRUMB_ARROW_ICON_HEIGHT}
                    viewBox={BREADCRUMB_ARROW_ICON_VIEWBOX}
                    width={BREADCRUMB_ARROW_ICON_WIDTH}
                />
            )}
            <span className="bdl-ContentExplorerFolderTreeBreadcrumbs-text" title={currentFolderName}>
                <FormattedMessage
                    {...messages.folderTreeBreadcrumbsText}
                    values={{ folderName: currentFolderName, totalItems: formatNumber(numTotalItems) }}
                />
            </span>
        </div>
    );
};

ContentExplorerFolderTreeBreadcrumbs.propTypes = {
    foldersPath: FoldersPathPropType.isRequired,
    intl: PropTypes.any,
    isFolderTreeButtonHidden: PropTypes.bool,
    numTotalItems: PropTypes.number.isRequired,
    onBreadcrumbClick: PropTypes.func,
};

export { ContentExplorerFolderTreeBreadcrumbs as ContentExplorerFolderTreeBreadcrumbsBase };
export default injectIntl(ContentExplorerFolderTreeBreadcrumbs);
