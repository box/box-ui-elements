// @flow

'no babel-plugin-flow-react-proptypes';

// turn off this plugin because it breaks the IntlShape flow type
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import type { IntlShape } from 'react-intl';

import PlainButton from 'components/plain-button';
import Button from 'components/button';
import TextInputWithCopyButton from 'components/text-input-with-copy-button';
import Toggle from 'components/toggle/Toggle';
import Tooltip from 'components/tooltip';
import { convertToMs } from 'utils/datetime';
import IconMail from '../../icons/general/IconMail';
import IconClock from '../../icons/general/IconClock';
import { amaranth } from '../../styles/variables';
import type { itemType } from '../../common/box-types';

import SharedLinkAccessMenu from './SharedLinkAccessMenu';
import SharedLinkPermissionMenu from './SharedLinkPermissionMenu';
import messages from './messages';
import type { accessLevelType, item, permissionLevelType, sharedLinkType, sharedLinkTrackingType } from './flowTypes';
import { PEOPLE_IN_ITEM, CAN_VIEW_DOWNLOAD, CAN_VIEW_ONLY } from './constants';

type Props = {
    autofocusSharedLink?: boolean,
    changeSharedLinkAccessLevel: (newAccessLevel: accessLevelType) => Promise<{ accessLevel: accessLevelType }>,
    changeSharedLinkPermissionLevel: (
        newPermissionLevel: permissionLevelType,
    ) => Promise<{ permissionLevel: permissionLevelType }>,
    classificationName?: string,
    intl: IntlShape,
    item: item,
    itemType: itemType,
    onEmailSharedLinkClick: Function,
    onSettingsClick?: Function,
    onToggleSharedLink: Function,
    sharedLink: sharedLinkType,
    showSharedLinkSettingsCallout: boolean,
    submitting: boolean,
    trackingProps: sharedLinkTrackingType,
    triggerCopyOnLoad?: boolean,
};

class SharedLinkSection extends Component<Props> {
    static defaultProps = {
        trackingProps: {},
    };

    canAddSharedLink = (isSharedLinkEnabled: boolean, canAddLink: boolean) => {
        return !isSharedLinkEnabled && canAddLink;
    };

    canRemoveSharedLink = (isSharedLinkEnabled: boolean, canRemoveLink: boolean) => {
        return isSharedLinkEnabled && canRemoveLink;
    };

    renderSharedLink() {
        const {
            autofocusSharedLink,
            changeSharedLinkAccessLevel,
            changeSharedLinkPermissionLevel,
            classificationName,
            itemType,
            onEmailSharedLinkClick,
            sharedLink,
            submitting,
            trackingProps,
            triggerCopyOnLoad,
        } = this.props;
        const {
            accessLevel,
            allowedAccessLevels,
            canChangeAccessLevel,
            enterpriseName,
            isDownloadSettingAvailable,
            permissionLevel,
            url,
        } = sharedLink;

        const {
            copyButtonProps,
            onChangeSharedLinkAccessLevel,
            onChangeSharedLinkPermissionLevel,
            onSharedLinkCopy,
            sendSharedLinkButtonProps,
            sharedLinkAccessMenuButtonProps,
            sharedLinkPermissionsMenuButtonProps,
        } = trackingProps;

        let allowedPermissionLevels = [CAN_VIEW_DOWNLOAD, CAN_VIEW_ONLY];

        if (!canChangeAccessLevel) {
            // remove all but current level
            allowedPermissionLevels = allowedPermissionLevels.filter(level => level === permissionLevel);
        }

        // if we cannot set the download value, we remove this option from the dropdown
        if (!isDownloadSettingAvailable) {
            allowedPermissionLevels = allowedPermissionLevels.filter(level => level !== CAN_VIEW_DOWNLOAD);
        }

        const autofocus = !!(autofocusSharedLink && (sharedLink.isNewSharedLink || triggerCopyOnLoad));
        return (
            <React.Fragment>
                <div className="shared-link-field-row">
                    <TextInputWithCopyButton
                        autofocus={autofocus}
                        buttonProps={copyButtonProps}
                        className="shared-link-field-container"
                        disabled={submitting}
                        label=""
                        onCopySuccess={onSharedLinkCopy}
                        type="url"
                        triggerCopyOnLoad={triggerCopyOnLoad}
                        value={url}
                    />
                    <Tooltip text={<FormattedMessage {...messages.sendSharedLink} />} position="top-left">
                        <Button
                            className="email-shared-link-btn"
                            isDisabled={submitting}
                            onClick={onEmailSharedLinkClick}
                            type="button"
                            {...sendSharedLinkButtonProps}
                        >
                            <IconMail />
                        </Button>
                    </Tooltip>
                </div>

                <div className="shared-link-access-row">
                    <SharedLinkAccessMenu
                        accessLevel={accessLevel}
                        allowedAccessLevels={allowedAccessLevels}
                        changeAccessLevel={changeSharedLinkAccessLevel}
                        classificationName={classificationName}
                        enterpriseName={enterpriseName}
                        itemType={itemType}
                        submitting={submitting}
                        trackingProps={{
                            onChangeSharedLinkAccessLevel,
                            sharedLinkAccessMenuButtonProps,
                        }}
                    />
                    {accessLevel !== PEOPLE_IN_ITEM && (
                        <SharedLinkPermissionMenu
                            allowedPermissionLevels={allowedPermissionLevels}
                            canChangePermissionLevel={canChangeAccessLevel}
                            changePermissionLevel={changeSharedLinkPermissionLevel}
                            permissionLevel={permissionLevel}
                            submitting={submitting}
                            trackingProps={{
                                onChangeSharedLinkPermissionLevel,
                                sharedLinkPermissionsMenuButtonProps,
                            }}
                        />
                    )}
                </div>
            </React.Fragment>
        );
    }

    renderSharedLinkSettingsLink() {
        const { intl, onSettingsClick, showSharedLinkSettingsCallout, trackingProps } = this.props;
        const { sharedLinkSettingsButtonProps } = trackingProps;

        return (
            <div className="shared-link-settings-btn-container">
                <Tooltip
                    isShown={showSharedLinkSettingsCallout}
                    position="middle-right"
                    showCloseButton
                    text={<FormattedMessage {...messages.sharedLinkSettingsCalloutText} />}
                    theme="callout"
                >
                    <PlainButton
                        {...sharedLinkSettingsButtonProps}
                        aria-label={intl.formatMessage(messages.settingsButtonLabel)}
                        className="shared-link-settings-btn"
                        onClick={onSettingsClick}
                        type="button"
                    >
                        <FormattedMessage {...messages.sharedLinkSettings} />
                    </PlainButton>
                </Tooltip>
            </div>
        );
    }

    renderToggle() {
        const { item, onToggleSharedLink, sharedLink, submitting } = this.props;

        const { canChangeAccessLevel, expirationTimestamp } = sharedLink;

        const isSharedLinkEnabled = !!sharedLink.url;
        let linkText;

        if (isSharedLinkEnabled) {
            linkText = <FormattedMessage {...messages.linkShareOn} />;
            if (expirationTimestamp && expirationTimestamp !== 0) {
                linkText = (
                    <span>
                        <FormattedMessage {...messages.linkShareOn} />
                        <Tooltip
                            text={
                                <FormattedMessage
                                    {...messages.sharedLinkExpirationTooltip}
                                    values={{
                                        expiration: convertToMs(expirationTimestamp),
                                    }}
                                />
                            }
                            position="top-center"
                        >
                            <span className="shared-link-expiration-badge">
                                <IconClock color={amaranth} />
                            </span>
                        </Tooltip>
                    </span>
                );
            }
        } else {
            linkText = <FormattedMessage {...messages.linkShareOff} />;
        }

        const isToggleEnabled =
            (this.canAddSharedLink(isSharedLinkEnabled, item.grantedPermissions.itemShare) ||
                this.canRemoveSharedLink(isSharedLinkEnabled, canChangeAccessLevel)) &&
            !submitting;

        const toggleComponent = (
            <div className="share-toggle-container">
                <Toggle
                    isDisabled={!isToggleEnabled}
                    isOn={isSharedLinkEnabled}
                    onChange={onToggleSharedLink}
                    label={linkText}
                    name="toggle"
                />
            </div>
        );

        if (!submitting) {
            if (this.canAddSharedLink(isSharedLinkEnabled, item.grantedPermissions.itemShare)) {
                return (
                    <Tooltip
                        text={<FormattedMessage {...messages.sharedLinkDisabledTooltipCopy} />}
                        position="top-right"
                    >
                        {toggleComponent}
                    </Tooltip>
                );
            }

            if (!this.canRemoveSharedLink(isSharedLinkEnabled, canChangeAccessLevel)) {
                return (
                    <Tooltip text={<FormattedMessage {...messages.removeLinkTooltip} />} position="top-right">
                        {toggleComponent}
                    </Tooltip>
                );
            }
        }

        return toggleComponent;
    }

    render() {
        const { sharedLink, onSettingsClick } = this.props;
        const isSharedLinkEnabled = !!sharedLink.url;

        return (
            <div>
                <hr />
                <label>
                    <span className="label">
                        <FormattedMessage {...messages.sharedLinkSectionLabel} />
                    </span>
                </label>
                <div className="shared-link-toggle-row">
                    {this.renderToggle()}
                    {isSharedLinkEnabled && onSettingsClick && this.renderSharedLinkSettingsLink()}
                </div>
                {isSharedLinkEnabled && this.renderSharedLink()}
            </div>
        );
    }
}

export default SharedLinkSection;
