import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';

import Button from '../../../components/button';
import DropdownMenu from '../../../components/dropdown-menu/DropdownMenu';
import IconBreadcrumbArrow from '../../../icons/general/IconBreadcrumbArrow';
import IconFolderTree from '../../../icons/general/IconFolderTree';
import { Menu, MenuItem } from '../../../components/menu';

import { FoldersPathPropType } from '../prop-types';
import messages from '../messages';
import { bdlGray50 } from '../../../styles/variables';

const ContentExplorerFolderTreeBreadcrumbs = ({
    foldersPath,
    intl: { formatMessage },
    isUpButtonDisabled = false,
    numTotalItems,
    onBreadcrumbClick,
}) => (
    <div className="content-explorer-folder-tree-container">
        <DropdownMenu>
            <Button
                aria-label={formatMessage(messages.clickToGoBack)}
                className="content-explorer-folder-tree-button"
                type="button"
                title="file path"
                isDisabled={isUpButtonDisabled}
            >
                <IconFolderTree height={18} width={18} />
            </Button>

            <Menu>
                {foldersPath.map((folder, i) => (
                    <MenuItem
                        data-testid="breadcrumb-lnk"
                        key={folder.name}
                        onClick={event => onBreadcrumbClick(i, event)}
                    >
                        {folder.name}
                    </MenuItem>
                ))}
            </Menu>
        </DropdownMenu>

        <IconBreadcrumbArrow className="icon-breadcrumb-main" height={7.5} width={5} color={bdlGray50} />

        <span className="folder-title-breadcrumb-text" title={foldersPath[foldersPath.length - 1].name}>
            {`${foldersPath[foldersPath.length - 1].name} (${numTotalItems})`}
        </span>
    </div>
);

ContentExplorerFolderTreeBreadcrumbs.propTypes = {
    foldersPath: FoldersPathPropType.isRequired,
    intl: PropTypes.any,
    isUpButtonDisabled: PropTypes.bool,
    onBreadcrumbClick: PropTypes.func,
    numTotalItems: PropTypes.number,
};

export { ContentExplorerFolderTreeBreadcrumbs as ContentExplorerFolderTreeBreadcrumbsBase };
export default injectIntl(ContentExplorerFolderTreeBreadcrumbs);
