// @flow

'no babel-plugin-flow-react-proptypes';

// turn off this plugin because it breaks the IntlShape flow type
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import type { IntlShape } from 'react-intl';

import PlainButton from '../../components/plain-button';
import Button from '../../components/button';
import TextInputWithCopyButton from '../../components/text-input-with-copy-button';
import Toggle from '../../components/toggle/Toggle';
import Tooltip from '../../components/tooltip';
import { convertToMs } from '../../utils/datetime';
import IconMail from '../../icons/general/IconMail';
import IconClock from '../../icons/general/IconClock';
import IconGlobe from '../../icons/general/IconGlobe';
import { bdlWatermelonRed } from '../../styles/variables';
import type { ItemType } from '../../common/types/core';
import { isBoxNote } from '../../utils/file';

import convertToBoxItem from './utils/item';
import SharedLinkAccessMenu from './SharedLinkAccessMenu';
import SharedLinkPermissionMenu from './SharedLinkPermissionMenu';
import messages from './messages';
import type {
    accessLevelType,
    item as itemtype,
    permissionLevelType,
    sharedLinkType,
    sharedLinkTrackingType,
    tooltipComponentIdentifierType,
} from './flowTypes';
import { PEOPLE_IN_ITEM, ANYONE_WITH_LINK, CAN_VIEW_DOWNLOAD, CAN_VIEW_ONLY } from './constants';

type Props = {
    autofocusSharedLink?: boolean,
    changeSharedLinkAccessLevel: (newAccessLevel: accessLevelType) => Promise<{ accessLevel: accessLevelType }>,
    changeSharedLinkPermissionLevel: (
        newPermissionLevel: permissionLevelType,
    ) => Promise<{ permissionLevel: permissionLevelType }>,
    intl: IntlShape,
    item: itemtype,
    itemType: ItemType,
    onDismissTooltip: (componentIdentifier: tooltipComponentIdentifierType) => void,
    onEmailSharedLinkClick: Function,
    onSettingsClick?: Function,
    onToggleSharedLink: Function,
    sharedLink: sharedLinkType,
    showSharedLinkSettingsCallout: boolean,
    submitting: boolean,
    tooltips: { [componentIdentifier: tooltipComponentIdentifierType]: React.Node },
    trackingProps: sharedLinkTrackingType,
    triggerCopyOnLoad?: boolean,
};

class SharedLinkSection extends React.Component<Props> {
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
            item,
            itemType,
            onDismissTooltip,
            onEmailSharedLinkClick,
            sharedLink,
            submitting,
            trackingProps,
            triggerCopyOnLoad,
            tooltips,
        } = this.props;
        const {
            accessLevel,
            accessLevelsDisabledReason,
            allowedAccessLevels,
            canChangeAccessLevel,
            enterpriseName,
            isEditAllowed,
            isDownloadSettingAvailable,
            permissionLevel,
            url,
        } = sharedLink;

        const {
            copyButtonProps,
            onChangeSharedLinkAccessLevel,
            onChangeSharedLinkPermissionLevel,
            onSharedLinkAccessMenuOpen,
            onSharedLinkCopy,
            sendSharedLinkButtonProps,
            sharedLinkAccessMenuButtonProps,
            sharedLinkPermissionsMenuButtonProps,
        } = trackingProps;

        const isEditableBoxNote = isBoxNote(convertToBoxItem(item)) && isEditAllowed;
        let allowedPermissionLevels = [CAN_VIEW_DOWNLOAD, CAN_VIEW_ONLY];

        if (!canChangeAccessLevel) {
            // remove all but current level
            allowedPermissionLevels = allowedPermissionLevels.filter(level => level === permissionLevel);
        }

        // if we cannot set the download value, we remove this option from the dropdown
        if (!isDownloadSettingAvailable) {
            allowedPermissionLevels = allowedPermissionLevels.filter(level => level !== CAN_VIEW_DOWNLOAD);
        }

        return (
            <>
                <div className="shared-link-field-row">
                    <Tooltip
                        className="usm-ftux-tooltip"
                        isShown={!!tooltips['shared-link-copy-button']}
                        onDismiss={() => onDismissTooltip('shared-link-copy-button')}
                        position="middle-right"
                        showCloseButton
                        text={tooltips['shared-link-copy-button']}
                        theme="callout"
                    >
                        <TextInputWithCopyButton
                            autofocus={autofocusSharedLink}
                            buttonProps={copyButtonProps}
                            className="shared-link-field-container"
                            disabled={submitting}
                            label=""
                            onCopySuccess={onSharedLinkCopy}
                            triggerCopyOnLoad={triggerCopyOnLoad}
                            type="url"
                            value={url}
                        />
                    </Tooltip>
                    <Tooltip position="top-left" text={<FormattedMessage {...messages.sendSharedLink} />}>
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
                        accessLevelsDisabledReason={accessLevelsDisabledReason}
                        allowedAccessLevels={allowedAccessLevels}
                        changeAccessLevel={changeSharedLinkAccessLevel}
                        enterpriseName={enterpriseName}
                        itemType={itemType}
                        onDismissTooltip={() => onDismissTooltip('shared-link-access-menu')}
                        tooltipContent={tooltips['shared-link-access-menu'] || null}
                        submitting={submitting}
                        trackingProps={{
                            onChangeSharedLinkAccessLevel,
                            onSharedLinkAccessMenuOpen,
                            sharedLinkAccessMenuButtonProps,
                        }}
                    />
                    {!isEditableBoxNote && accessLevel !== PEOPLE_IN_ITEM && (
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
                    {isEditableBoxNote && (
                        <Tooltip text={<FormattedMessage {...messages.sharedLinkPermissionsEditTooltip} />}>
                            <PlainButton isDisabled className="can-edit-btn">
                                <FormattedMessage {...messages.sharedLinkPermissionsEdit} />
                            </PlainButton>
                        </Tooltip>
                    )}
                </div>
                {accessLevel === ANYONE_WITH_LINK && (
                    <div className="security-indicator-note">
                        <span className="security-indicator-icon-globe">
                            <IconGlobe height={12} width={12} />
                        </span>
                        <FormattedMessage {...messages.sharedLinkPubliclyAvailable} />
                    </div>
                )}
            </>
        );
    }

    renderSharedLinkSettingsLink() {
        const {
            intl,
            onDismissTooltip,
            onSettingsClick,
            showSharedLinkSettingsCallout,
            trackingProps,
            tooltips,
        } = this.props;
        const { sharedLinkSettingsButtonProps } = trackingProps;

        return (
            <div className="shared-link-settings-btn-container">
                <Tooltip
                    className="usm-ftux-tooltip"
                    isShown={!!tooltips['shared-link-settings'] || showSharedLinkSettingsCallout}
                    onDismiss={() => onDismissTooltip('shared-link-settings')}
                    position="middle-right"
                    showCloseButton
                    text={
                        tooltips['shared-link-settings'] || (
                            <FormattedMessage {...messages.sharedLinkSettingsCalloutText} />
                        )
                    }
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
        const { item, onDismissTooltip, onToggleSharedLink, sharedLink, submitting, tooltips } = this.props;

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
                            position="top-center"
                            text={
                                <FormattedMessage
                                    {...messages.sharedLinkExpirationTooltip}
                                    values={{
                                        expiration: convertToMs(expirationTimestamp),
                                    }}
                                />
                            }
                        >
                            <span className="shared-link-expiration-badge">
                                <IconClock color={bdlWatermelonRed} />
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
                    label={linkText}
                    name="toggle"
                    onChange={onToggleSharedLink}
                />
            </div>
        );

        if (!submitting) {
            if (this.canAddSharedLink(isSharedLinkEnabled, item.grantedPermissions.itemShare)) {
                const sharedLinkToggleTooltip = tooltips['shared-link-toggle'];
                if (sharedLinkToggleTooltip) {
                    return (
                        <Tooltip
                            className="usm-ftux-tooltip"
                            isShown
                            onDismiss={() => onDismissTooltip('shared-link-toggle')}
                            position="middle-left"
                            showCloseButton
                            text={sharedLinkToggleTooltip}
                            theme="callout"
                        >
                            {toggleComponent}
                        </Tooltip>
                    );
                }
                return (
                    <Tooltip
                        position="top-right"
                        text={<FormattedMessage {...messages.sharedLinkDisabledTooltipCopy} />}
                    >
                        {toggleComponent}
                    </Tooltip>
                );
            }

            if (!this.canRemoveSharedLink(isSharedLinkEnabled, canChangeAccessLevel)) {
                return (
                    <Tooltip position="top-right" text={<FormattedMessage {...messages.removeLinkTooltip} />}>
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
                {/* eslint-disable-next-line jsx-a11y/label-has-for */}
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
