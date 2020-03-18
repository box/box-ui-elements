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
import Tooltip from '../../../components/tooltip/Tooltip';
import VersionsItemAction from './VersionsItemAction';
import { Menu } from '../../../components/menu';
import './VersionsItemActions.scss';

type Props = {
    fileId: string,
    isCurrent?: boolean,
    isRetained?: boolean,
    onDelete?: () => void,
    onDownload?: () => void,
    onPreview?: () => void,
    onPromote?: () => void,
    onRestore?: () => void,
    showDelete?: boolean,
    showDownload?: boolean,
    showPreview?: boolean,
    showPromote?: boolean,
    showRestore?: boolean,
};

const handleMenuClose = (event: SyntheticEvent<> | MouseEvent) => {
    event.stopPropagation();
};

const handleToggleClick = (event: SyntheticMouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
};

const VersionsItemActions = ({
    fileId,
    isCurrent = false,
    isRetained = false,
    onDelete,
    onDownload,
    onPreview,
    onPromote,
    onRestore,
    showDelete = false,
    showDownload = false,
    showPreview = false,
    showPromote = false,
    showRestore = false,
}: Props) => {
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
                    {(text: string) => <span className="accessibility-hidden">{text}</span>}
                </FormattedMessage>
            </PlainButton>

            <Menu
                className="bcs-VersionsItemActions-menu"
                data-resin-component="preview" // Needed for resin events due to tether moving menu to body
                data-resin-feature="versions" // Needed for resin events due to tether moving menu to body
            >
                {showPreview && (
                    <VersionsItemAction action="preview" fileId={fileId} isCurrent={isCurrent} onClick={onPreview}>
                        <IconOpenWith />
                        <FormattedMessage {...messages.versionActionPreview} />
                    </VersionsItemAction>
                )}

                {showDownload && (
                    <VersionsItemAction action="download" fileId={fileId} isCurrent={isCurrent} onClick={onDownload}>
                        <IconDownload />
                        <FormattedMessage {...messages.versionActionDownload} />
                    </VersionsItemAction>
                )}
                {showPromote && (
                    <VersionsItemAction action="promote" fileId={fileId} isCurrent={isCurrent} onClick={onPromote}>
                        <IconUpload />
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
                    <Tooltip
                        position="middle-left"
                        text={<FormattedMessage {...messages.versionActionDisabledRetention} />}
                        isTabbable={false}
                        isDisabled={!isRetained}
                    >
                        <VersionsItemAction
                            action="remove"
                            fileId={fileId}
                            isCurrent={isCurrent}
                            isDisabled={isRetained}
                            onClick={onDelete}
                        >
                            <IconTrash />
                            <FormattedMessage {...messages.versionActionDelete} />
                        </VersionsItemAction>
                    </Tooltip>
                )}
            </Menu>
        </DropdownMenu>
    );
};

export default VersionsItemActions;
