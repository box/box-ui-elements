import * as React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Tooltip from '../../components/tooltip';
import { Menu, MenuItem } from '../../components/menu';
import IconSharedLink from '../../icons/general/IconSharedLink';
import IconInviteCollaborators from '../../icons/general/IconInviteCollaborators';
import IconCollaboratorsRestricted from '../../icons/general/IconCollaboratorsRestricted';
import IconSharedLinkRestricted from '../../icons/general/IconSharedLinkRestricted';

import messages from './messages';

import './ShareMenu.scss';

const OWNER_COOWNER_ONLY = 'owner_coowner_only';
const INSUFFICIENT_PERMISSIONS = 'insufficient_permissions';

const ShareMenu = ({
    canInvite,
    canShare,
    className = '',
    getSharedLinkProps = {},
    inviteCollabsProps = {},
    inviteRestrictionCode,
    isDownloadAllowed,
    isPreviewAllowed,
    onGetSharedLinkSelect,
    onInviteCollabSelect,
    ...rest
}) => {
    const inviteCollabsOption = (
        <MenuItem
            className="invite-collaborators"
            isDisabled={!canInvite}
            onClick={onInviteCollabSelect}
            {...inviteCollabsProps}
        >
            {canInvite ? <IconInviteCollaborators /> : <IconCollaboratorsRestricted />}
            <div>
                <div>
                    <FormattedMessage {...messages.inviteCollabs} />
                </div>
                <div className="share-option-description">
                    <FormattedMessage {...messages.editAndComment} />
                </div>
            </div>
        </MenuItem>
    );

    const inviteCollabTooltip =
        inviteRestrictionCode === OWNER_COOWNER_ONLY ? (
            <FormattedMessage {...messages.ownerCoownerOnlyTooltip} />
        ) : (
            <FormattedMessage {...messages.insufficientPermissionsTooltip} />
        );

    let sharedLinkPermissions;

    if (isDownloadAllowed && isPreviewAllowed) {
        sharedLinkPermissions = <FormattedMessage {...messages.viewAndDownload} />;
    } else if (isPreviewAllowed) {
        sharedLinkPermissions = <FormattedMessage {...messages.viewOnly} />;
    } else if (isDownloadAllowed) {
        sharedLinkPermissions = <FormattedMessage {...messages.downloadOnly} />;
    } else {
        sharedLinkPermissions = <FormattedMessage {...messages.shortcutOnly} />;
    }

    return (
        <Menu className={`share-menu ${className}`} {...rest}>
            {canInvite ? (
                inviteCollabsOption
            ) : (
                <Tooltip position="middle-left" text={inviteCollabTooltip}>
                    {inviteCollabsOption}
                </Tooltip>
            )}
            <MenuItem
                className="get-shared-link"
                isDisabled={!canShare}
                onClick={onGetSharedLinkSelect}
                {...getSharedLinkProps}
            >
                {canShare ? <IconSharedLink /> : <IconSharedLinkRestricted />}
                <div>
                    <div>
                        <FormattedMessage {...messages.getSharedLink} />
                    </div>
                    <div className="share-option-description">{sharedLinkPermissions}</div>
                </div>
            </MenuItem>
        </Menu>
    );
};

ShareMenu.propTypes = {
    canInvite: PropTypes.bool.isRequired,
    canShare: PropTypes.bool.isRequired,
    className: PropTypes.string,
    getSharedLinkProps: PropTypes.object,
    inviteCollabsProps: PropTypes.object,
    inviteRestrictionCode: PropTypes.oneOf([INSUFFICIENT_PERMISSIONS, OWNER_COOWNER_ONLY]),
    isDownloadAllowed: PropTypes.bool.isRequired,
    isPreviewAllowed: PropTypes.bool.isRequired,
    onGetSharedLinkSelect: PropTypes.func.isRequired,
    onInviteCollabSelect: PropTypes.func.isRequired,
};

export { OWNER_COOWNER_ONLY, INSUFFICIENT_PERMISSIONS };
export default ShareMenu;
