import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';

import Button from '../../../components/button';
import DropdownMenu from '../../../components/dropdown-menu/DropdownMenu';
import IconBreadcrumbArrow from '../../../icons/general/IconBreadcrumbArrow';
import IconFolderTree from '../../../icons/general/IconFolderTree';
import { Menu, MenuItem } from '../../../components/menu';
import PlainButton from '../../../components/plain-button';

import { FoldersPathPropType } from '../prop-types';
import messages from '../messages';

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
                    <MenuItem key={folder.name} onClick={event => onBreadcrumbClick(i, event)}>
                        {folder.name}
                    </MenuItem>
                ))}
            </Menu>
        </DropdownMenu>

        <div>
            <IconBreadcrumbArrow className="icon-breadcrumb-main" height={7.5} width={5} color="#909090" />
            <PlainButton
                className="folder-title-breadcrumb"
                data-testid="breadcrumb-lnk"
                isDisabled
                title={foldersPath[foldersPath.length - 1].name}
            >
                <span className="folder-title-breadcrumb-text">{`${
                    foldersPath[foldersPath.length - 1].name
                } (${numTotalItems})`}</span>
            </PlainButton>
        </div>
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
