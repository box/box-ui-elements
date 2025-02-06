// @flow
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { noop, isEmpty } from 'lodash';
import getProp from 'lodash/get';

import Button from '../../components/button/Button';
import DropdownMenu from '../../components/dropdown-menu/DropdownMenu';
import Menu from '../../components/menu/Menu';
import MenuItem from '../../components/menu/MenuItem';
import Browser from '../../utils/Browser';
import IconEllipsis from '../../icons/general/IconEllipsis';
import { bdlGray } from '../../styles/variables';

import messages from '../common/messages';
import {
    PERMISSION_CAN_DOWNLOAD,
    PERMISSION_CAN_RENAME,
    PERMISSION_CAN_DELETE,
    PERMISSION_CAN_SHARE,
    PERMISSION_CAN_PREVIEW,
    TYPE_FILE,
    TYPE_WEBLINK,
    FIELD_PERMISSIONS_CAN_UPLOAD,
    PERMISSION_CAN_UPLOAD,
} from '../../constants';

import type { CommonGridViewFunctions } from './flowTypes';
import type { BoxItem } from '../../common/types/core';

import './MoreOptionsCell.scss';
import { ONLYOFFICE_SUPPORTED_EXTENSIONS } from '../../constants';

type Props = {
    canDelete: boolean,
    canDownload: boolean,
    canPreview: boolean,
    canRename: boolean,
    canShare: boolean,
    intl: IntlShape,
    canAddToFavoriteCollection: boolean,
    canRemoveFromFavoriteCollection: boolean,
    onItemAddFavoriteCollection: (item: BoxItem) => void,
    onItemRemoveFromFavoriteCollection: (item: BoxItem) => void,
    isSmall: boolean,
    item: BoxItem,
    ...$Exact<CommonGridViewFunctions>,
};

const MoreOptions = ({
    canPreview,
    canShare,
    canDownload,
    canDelete,
    canRename,
    canAddToFavoriteCollection,
    canRemoveFromFavoriteCollection,
    onItemAddFavoriteCollection,
    onItemRemoveFromFavoriteCollection,
    onItemSelect,
    onItemDelete,
    onItemDownload,
    onItemRename,
    onItemShare,
    onItemPreview,
    intl,
    onItemEdit,
    isSmall,
    item,
}: Props) => {


    const { permissions, type, collaboration_role } = item;

    const isBookmarked = type === TYPE_WEBLINK;

    if (!permissions || isBookmarked) {
        return <span />;
    }

    const isWatermarked = getProp(item, 'watermark_info.is_watermarked', false);
    const classification = getProp(item, 'classification.name', null);

    const unenableDownloadLablesStr = sessionStorage.getItem("unenableDownloadViewerLables") || '';
    const unenableDownloadLables = unenableDownloadLablesStr.split(",");

    const canDownloadRepresentation = () => {
      const isViewerRole = collaboration_role === "viewer"; 
      const downloadLablesStr = sessionStorage.getItem("enableWatermarkingDownloadLables") || '';
      const downloadLables = downloadLablesStr.split(",");
      const representations = item?.representations?.entries || []
      const contentUrl = representations.find(item => item.representation === 'pdf')
     
      return contentUrl && isWatermarked && isViewerRole && (downloadLables.includes(classification) || (downloadLablesStr === "ENABLE_WATERMARKING_DOWNLOAD_LABELS_ALL"));
    }

    const onFocus = () => {
        window.navigator.serviceWorker.controller.postMessage({
            action: 'startFetching',
            userId: window?.__app_config?.user?.id,
            userName: window?.__app_config?.user?.login_code || window?.__app_config?.user?.name,
            pageName: 'explorer',
            isMenuOpened: true,
            enterpriseId: window?.__app_config?.enterpriseId
        });
        onItemSelect(item, noop, true);
    };
    const onDelete = () => onItemDelete(item);
    const onDownload = () => onItemDownload(item, canDownloadRepresentation());
    const onRename = () => onItemRename(item);
    const onShare = () => onItemShare(item);
    const onPreview = () => onItemPreview(item);
    const onAddToFavoriteCollection = () => onItemAddFavoriteCollection(item);
    const onRemoveFromFavoriteCollection = () => onItemRemoveFromFavoriteCollection(item);
    const onEdit = () => onItemEdit(item);
    const onPreviewInNewTab = () => {
      const prevUrl = item?.parent?.id ? `?prev_url=/?folderId=${item?.parent?.id}` : '';
      const previewUrl = `${window.location.origin}/preview/${item.id}` + prevUrl
      window.open(previewUrl, '_blank')
    };

    const enableOpenPreviewNewTabFlg = sessionStorage.getItem("enableOpenPreviewNewTabFlg") || '';
    const allowPreviewInNewTab = enableOpenPreviewNewTabFlg === '1';
    const allowPreview = type === TYPE_FILE && canPreview && permissions[PERMISSION_CAN_PREVIEW];
    const allowOpen = type === TYPE_WEBLINK;
    const allowDelete = canDelete && permissions[PERMISSION_CAN_DELETE];
    const allowShare = canShare && permissions[PERMISSION_CAN_SHARE];
    const allowRename = canRename && permissions[PERMISSION_CAN_RENAME];
    const allowDownload =
        ((canDownload && permissions[PERMISSION_CAN_DOWNLOAD]) || canDownloadRepresentation()) && type === TYPE_FILE && !Browser.isMobile() && !(unenableDownloadLables.includes(classification) || (unenableDownloadLablesStr === "UNENABLE_DOWNLOAD_VIEWER_LABELS_ALL"));

    const allowUpload = permissions[PERMISSION_CAN_UPLOAD];

    const allowAddToFavoriteCollection = canAddToFavoriteCollection;
    const allowRemoveFromFavoriteCollection = canRemoveFromFavoriteCollection;

    const { enableOnlyofficeFlg } = window.__app_config || {};

    const allowEdit =
        enableOnlyofficeFlg &&
        permissions[PERMISSION_CAN_DOWNLOAD] &&
        allowUpload &&
        item.type === TYPE_FILE &&
        ONLYOFFICE_SUPPORTED_EXTENSIONS.includes(item.extension) &&
        ['owner', 'co-owner', 'editor', 'viewer uploader'].includes(collaboration_role);

    const allowed =
        allowDelete ||
        allowRename ||
        allowDownload ||
        allowPreview ||
        allowShare ||
        allowOpen ||
        allowAddToFavoriteCollection ||
        allowRemoveFromFavoriteCollection ||
        allowEdit;

    if (!allowed) {
        return <span />;
    }

    return (
        <div className="bce-more-options">
            <DropdownMenu constrainToScrollParent isRightAligned className="more-options-menu">
                <Button
                    aria-label={intl.formatMessage(messages.moreOptions)}
                    className="bce-btn-more-options"
                    data-testid="bce-btn-more-options"
                    onFocus={onFocus}
                    type="button"
                    onTouchStart={onFocus}
                >
                    <IconEllipsis color={bdlGray} height={10} width={16} />
                </Button>
                <Menu style={!collaboration_role ? { display: 'none' } : {}}>
                    {allowPreview && (
                        <MenuItem onClick={onPreview}>
                            <FormattedMessage {...messages.preview} />
                        </MenuItem>
                    )}
                    {allowPreview && allowPreviewInNewTab && (
                        <MenuItem onClick={onPreviewInNewTab}>
                            <FormattedMessage {...messages.previewInNewTab} />
                        </MenuItem>
                    )}
                    {allowOpen && (
                        <MenuItem onClick={onPreview}>
                            <FormattedMessage {...messages.open} />
                        </MenuItem>
                    )}
                    {allowDelete && (
                        <MenuItem onClick={onDelete}>
                            <FormattedMessage {...messages.delete} />
                        </MenuItem>
                    )}
                    {allowDownload && (
                        <MenuItem onClick={onDownload}>
                            <FormattedMessage {...messages.download} />
                        </MenuItem>
                    )}
                    {allowRename && (
                        <MenuItem onClick={onRename}>
                            <FormattedMessage {...messages.rename} />
                        </MenuItem>
                    )}
                    {allowShare && (
                        <MenuItem onClick={onShare}>
                            <FormattedMessage {...messages.share} />
                        </MenuItem>
                    )}
                    {allowAddToFavoriteCollection && (
                        // fixme
                        <MenuItem onClick={onAddToFavoriteCollection}>
                            <FormattedMessage {...messages.addToFavoritesLabel} />
                        </MenuItem>
                    )}
                    {allowRemoveFromFavoriteCollection && (
                        // fixme
                        <MenuItem onClick={onRemoveFromFavoriteCollection}>
                            <FormattedMessage {...messages.removeFavoritesLabel} />
                        </MenuItem>
                    )}
                    {allowEdit && (
                        <MenuItem onClick={onEdit}>
                            <FormattedMessage {...messages.editLabel} />
                        </MenuItem>
                    )}
                </Menu>
            </DropdownMenu>
            {allowShare && !isSmall && (
                <Button onClick={onShare} onFocus={onFocus} type="button">
                    <FormattedMessage {...messages.share} />
                </Button>
            )}
        </div>
    );
};

export default injectIntl(MoreOptions);
