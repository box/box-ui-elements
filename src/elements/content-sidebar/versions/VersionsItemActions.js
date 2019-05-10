/**
 * @flow
 * @file Versions Item Action component
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import DropdownMenu from '../../../components/dropdown-menu';
import IconClockPast from '../../../icons/general/IconClockPast';
import IconDownload from '../../../icons/general/IconDownload';
import IconEllipsis from '../../../icons/general/IconEllipsis';
import IconOpenWith from '../../../icons/general/IconOpenWith';
import IconTrash from '../../../icons/general/IconTrash';
import IconUpload from '../../../icons/general/IconUpload';
import messages from './messages';
import PlainButton from '../../../components/plain-button';
import { Menu, MenuItem } from '../../../components/menu';
import './VersionsItemActions.scss';

type Props = {
    isCurrent: boolean,
    isDeleted: boolean,
    isDownloadable: boolean,
    onDelete?: () => void,
    onDownload?: () => void,
    onPreview?: () => void,
    onPromote?: () => void,
    onRestore?: () => void,
    permissions: BoxItemVersionPermission,
};

const ICON_SIZE = { height: 12, width: 12 };

const handleMenuClose = (event: SyntheticEvent<>) => {
    event.stopPropagation();
};

const handleToggleClick = (event: SyntheticMouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
};

const VersionsItemActions = ({
    isCurrent = false,
    isDeleted = false,
    isDownloadable = false,
    onDelete,
    onDownload,
    onPreview,
    onPromote,
    onRestore,
    permissions,
}: Props) => {
    const { can_delete, can_download, can_preview, can_upload } = permissions;
    const showDelete = can_delete && !isDeleted && !isCurrent;
    const showDownload = can_download && !isDeleted && isDownloadable;
    const showPreview = can_preview && !isDeleted;
    const showPromote = can_upload && !isDeleted && !isCurrent;
    const showRestore = can_delete && isDeleted;

    if (!showDelete && !showDownload && !showPreview && !showPromote && !showRestore) {
        return null;
    }

    return (
        <DropdownMenu
            className="bcs-VersionsItemActions"
            constrainToScrollParent
            isRightAligned
            onMenuClose={handleMenuClose}
        >
            <PlainButton className="bcs-VersionsItemActions-toggle" onClick={handleToggleClick}>
                <IconEllipsis height={4} width={14} title={<FormattedMessage {...messages.versionActionToggle} />} />
            </PlainButton>
            <Menu>
                {showPreview && (
                    <MenuItem className="bcs-VersionsItemActions-item" onClick={onPreview}>
                        <IconOpenWith {...ICON_SIZE} />
                        <FormattedMessage {...messages.versionActionPreview} />
                    </MenuItem>
                )}

                {showDownload && (
                    <MenuItem className="bcs-VersionsItemActions-item" onClick={onDownload}>
                        <IconDownload {...ICON_SIZE} />
                        <FormattedMessage {...messages.versionActionDownload} />
                    </MenuItem>
                )}
                {showPromote && (
                    <MenuItem className="bcs-VersionsItemActions-item" onClick={onPromote}>
                        <IconUpload {...ICON_SIZE} />
                        <FormattedMessage {...messages.versionActionPromote} />
                    </MenuItem>
                )}
                {showRestore && (
                    <MenuItem className="bcs-VersionsItemActions-item" onClick={onRestore}>
                        <IconClockPast height={14} width={14} />
                        <FormattedMessage {...messages.versionActionRestore} />
                    </MenuItem>
                )}
                {showDelete && (
                    <MenuItem className="bcs-VersionsItemActions-item" onClick={onDelete}>
                        <IconTrash {...ICON_SIZE} />
                        <FormattedMessage {...messages.versionActionDelete} />
                    </MenuItem>
                )}
            </Menu>
        </DropdownMenu>
    );
};

export default VersionsItemActions;
