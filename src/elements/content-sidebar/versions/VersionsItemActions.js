/**
 * @flow
 * @file Versions Item Actions component
 * @author Box
 */

import * as React from 'react';
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
import VersionsItemAction from './VersionsItemAction';
import { Menu } from '../../../components/menu';
import './VersionsItemActions.scss';

type Props = {
    fileId: string,
    isCurrent?: boolean,
    isDeleted?: boolean,
    isDownloadable?: boolean,
    isSelected?: boolean,
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
    fileId,
    isCurrent = false,
    isDeleted = false,
    isDownloadable = false,
    isSelected = false,
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
    const showPreview = can_preview && !isDeleted && !isSelected;
    const showPromote = can_upload && !isDeleted && !isCurrent;
    const showRestore = can_delete && isDeleted;

    if (!showDelete && !showDownload && !showPreview && !showPromote && !showRestore) {
        return null;
    }

    return (
        <DropdownMenu
            className="bcs-VersionsItemActions"
            constrainToScrollParent
            constrainToWindow
            isRightAligned
            onMenuClose={handleMenuClose}
        >
            <PlainButton
                className="bcs-VersionsItemActions-toggle"
                data-resin-iscurrent={isCurrent}
                data-resin-itemid={fileId}
                data-resin-target="overflow"
                onClick={handleToggleClick}
                type="button"
            >
                <IconEllipsis height={4} width={14} />
                <FormattedMessage {...messages.versionActionToggle}>
                    {text => <span className="accessibility-hidden">{text}</span>}
                </FormattedMessage>
            </PlainButton>

            <Menu
                className="bcs-VersionsItemActions-menu"
                data-resin-component="preview" // Needed for resin events due to tether moving menu to body
                data-resin-feature="versions" // Needed for resin events due to tether moving menu to body
            >
                {showPreview && (
                    <VersionsItemAction action="preview" fileId={fileId} isCurrent={isCurrent} onClick={onPreview}>
                        <IconOpenWith {...ICON_SIZE} />
                        <FormattedMessage {...messages.versionActionPreview} />
                    </VersionsItemAction>
                )}

                {showDownload && (
                    <VersionsItemAction action="download" fileId={fileId} isCurrent={isCurrent} onClick={onDownload}>
                        <IconDownload {...ICON_SIZE} />
                        <FormattedMessage {...messages.versionActionDownload} />
                    </VersionsItemAction>
                )}
                {showPromote && (
                    <VersionsItemAction action="promote" fileId={fileId} isCurrent={isCurrent} onClick={onPromote}>
                        <IconUpload {...ICON_SIZE} />
                        <FormattedMessage {...messages.versionActionPromote} />
                    </VersionsItemAction>
                )}
                {showRestore && (
                    <VersionsItemAction action="restore" fileId={fileId} isCurrent={isCurrent} onClick={onRestore}>
                        <IconClockPast height={14} width={14} />
                        <FormattedMessage {...messages.versionActionRestore} />
                    </VersionsItemAction>
                )}
                {showDelete && (
                    <VersionsItemAction action="remove" fileId={fileId} isCurrent={isCurrent} onClick={onDelete}>
                        <IconTrash {...ICON_SIZE} />
                        <FormattedMessage {...messages.versionActionDelete} />
                    </VersionsItemAction>
                )}
            </Menu>
        </DropdownMenu>
    );
};

export default VersionsItemActions;
