/* @flow */
import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';

import TextInputWithCopyButton from '../../components/text-input-with-copy-button';
import Tooltip from '../../components/tooltip';
import PlainButton from '../../components/plain-button';
import { convertToMs } from '../../utils/datetime';
import IconExpirationInverted from '../../icons/general/IconExpirationInverted';
import IconSettingInverted from '../../icons/general/IconSettingInverted';

import SharedLinkAccess from './SharedLinkAccess';
import messages from './messages';
import { accessLevelPropType, allowedAccessLevelsPropType, permissionLevelPropType } from './propTypes';

import './SharedLink.scss';

type Props = {
    accessDropdownMenuProps?: Object,
    accessLevel?: accessLevelPropType,
    accessMenuButtonProps?: Object,
    allowedAccessLevels?: allowedAccessLevelsPropType,
    canRemoveLink?: boolean,
    changeAccessLevel: Function,
    changePermissionLevel?: Function,
    copyButtonProps?: Object,
    enterpriseName?: string,
    expiration?: number,
    intl: IntlShape,
    isDownloadAllowed?: boolean,
    isEditAllowed?: boolean,
    isPreviewAllowed?: boolean,
    itemType: string,
    onCopySuccess?: Function,
    onSettingsClick?: Function,
    permissionLevel?: permissionLevelPropType,
    removeLink: Function,
    removeLinkButtonProps?: Object,
    settingsButtonProps?: Object,
    sharedLink: string,
    submitting?: boolean,
};

const SharedLink = (props: Props) => {
    const {
        accessDropdownMenuProps,
        accessLevel,
        accessMenuButtonProps,
        allowedAccessLevels,
        canRemoveLink,
        changeAccessLevel,
        changePermissionLevel,
        copyButtonProps,
        enterpriseName,
        expiration,
        intl,
        isDownloadAllowed,
        isEditAllowed,
        isPreviewAllowed,
        itemType,
        onCopySuccess,
        onSettingsClick,
        permissionLevel,
        removeLink,
        removeLinkButtonProps,
        settingsButtonProps = {},
        sharedLink,
        submitting,
    } = props;

    return (
        <div className="shared-link">
            <div className="shared-link-icons">
                {expiration ? (
                    <Tooltip
                        position="middle-left"
                        text={
                            <FormattedMessage
                                {...messages.sharedLinkExpirationTooltip}
                                values={{
                                    expiration: convertToMs(expiration),
                                }}
                            />
                        }
                    >
                        <span className="shared-link-expiration">
                            <IconExpirationInverted height={16} width={16} />
                        </span>
                    </Tooltip>
                ) : null}
                {onSettingsClick && (
                    <PlainButton
                        {...settingsButtonProps}
                        aria-label={intl.formatMessage(messages.settingsButtonLabel)}
                        className="shared-link-settings-btn"
                        onClick={onSettingsClick}
                        type="button"
                    >
                        <IconSettingInverted />
                    </PlainButton>
                )}
            </div>
            <TextInputWithCopyButton
                buttonProps={copyButtonProps}
                className="shared-link-container"
                disabled={submitting}
                label={<FormattedMessage {...messages.sharedLinkLabel} />}
                onCopySuccess={onCopySuccess}
                type="url"
                value={sharedLink}
            />
            <SharedLinkAccess
                accessDropdownMenuProps={accessDropdownMenuProps}
                accessLevel={accessLevel}
                accessMenuButtonProps={accessMenuButtonProps}
                allowedAccessLevels={allowedAccessLevels}
                canRemoveLink={canRemoveLink}
                changeAccessLevel={changeAccessLevel}
                changePermissionLevel={changePermissionLevel}
                enterpriseName={enterpriseName}
                isDownloadAllowed={isDownloadAllowed}
                isEditAllowed={isEditAllowed}
                isPreviewAllowed={isPreviewAllowed}
                itemType={itemType}
                permissionLevel={permissionLevel}
                removeLink={removeLink}
                removeLinkButtonProps={removeLinkButtonProps}
                submitting={submitting}
            />
        </div>
    );
};

export { SharedLink as SharedLinkBase };
export default injectIntl(SharedLink);
