// @flow

import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import PlainButton from '../../components/plain-button';
import Button from '../../components/button';
import GuideTooltip from '../../components/guide-tooltip';
import TextInputWithCopyButton from '../../components/text-input-with-copy-button';
import Toggle from '../../components/toggle/Toggle';
import Tooltip from '../../components/tooltip';
import { convertToMs } from '../../utils/datetime';
import IconMail from '../../icons/general/IconMail';
import IconClock from '../../icons/general/IconClock';
import IconGlobe from '../../icons/general/IconGlobe';
import { bdlWatermelonRed } from '../../styles/variables';
import type { ItemType } from '../../common/types/core';
import type { TargetingApi } from '../targeting/types';
import { isBoxNote } from '../../utils/file';
import Browser from '../../utils/Browser';

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
    USMConfig,
} from './flowTypes';
import {
    ANYONE_IN_COMPANY,
    ANYONE_WITH_LINK,
    CAN_EDIT,
    CAN_VIEW_DOWNLOAD,
    CAN_VIEW_ONLY,
    PEOPLE_IN_ITEM,
} from './constants';

type Props = {
    addSharedLink: () => void,
    autoCreateSharedLink?: boolean,
    autofocusSharedLink?: boolean,
    changeSharedLinkAccessLevel: (newAccessLevel: accessLevelType) => Promise<{ accessLevel: accessLevelType }>,
    changeSharedLinkPermissionLevel: (
        newPermissionLevel: permissionLevelType,
    ) => Promise<{ permissionLevel: permissionLevelType }>,
    config?: USMConfig,
    intl: any,
    isAllowEditSharedLinkForFileEnabled: boolean,
    item: itemtype,
    itemType: ItemType,
    onCopyError?: () => void,
    onCopyInit?: () => void,
    onCopySuccess?: () => void,
    onDismissTooltip: (componentIdentifier: tooltipComponentIdentifierType) => void,
    onEmailSharedLinkClick: Function,
    onSettingsClick?: Function,
    onToggleSharedLink: Function,
    sharedLink: sharedLinkType,
    sharedLinkEditTagTargetingApi?: TargetingApi,
    sharedLinkEditTooltipTargetingApi?: TargetingApi,
    showSharedLinkSettingsCallout: boolean,
    submitting: boolean,
    tooltips: { [componentIdentifier: tooltipComponentIdentifierType]: React.Node },
    trackingProps: sharedLinkTrackingType,
    triggerCopyOnLoad?: boolean,
};

type State = {
    isAutoCreatingSharedLink: boolean,
    isCopySuccessful: ?boolean,
    isPermissionElevatedToEdit: boolean,
    isSharedLinkEditTooltipShown: boolean,
};

class SharedLinkSection extends React.Component<Props, State> {
    static defaultProps = {
        trackingProps: {},
        autoCreateSharedLink: false,
    };

    toggleRef: HTMLInputElement | null;

    constructor(props: Props) {
        super(props);

        this.state = {
            isAutoCreatingSharedLink: false,
            isCopySuccessful: null,
            isSharedLinkEditTooltipShown: false,
            isPermissionElevatedToEdit: false,
        };
    }

    componentDidMount() {
        const { sharedLink, autoCreateSharedLink, addSharedLink, submitting } = this.props;

        if (
            autoCreateSharedLink &&
            !this.state.isAutoCreatingSharedLink &&
            sharedLink &&
            !sharedLink.url &&
            !submitting &&
            !sharedLink.isNewSharedLink
        ) {
            this.setState({ isAutoCreatingSharedLink: true });
            addSharedLink();
        }
    }

    // We handle didUpdate but not didMount because
    // the component initially renders with empty data
    // in order to start showing UI components.
    // When getInitialData completes in the parent we
    // rerender with correct sharedLink data and can
    // check whether to auto create a new one.
    // Note: we are assuming the 2nd render is safe
    // to start doing this check.
    componentDidUpdate(prevProps: Props) {
        const {
            sharedLink,
            autoCreateSharedLink,
            addSharedLink,
            sharedLinkEditTooltipTargetingApi,
            submitting,
            triggerCopyOnLoad,
            onCopyError = () => {},
            onCopySuccess = () => {},
            onCopyInit = () => {},
        } = this.props;

        const {
            isAutoCreatingSharedLink,
            isCopySuccessful,
            isSharedLinkEditTooltipShown,
            isPermissionElevatedToEdit,
        } = this.state;

        if (
            autoCreateSharedLink &&
            !isAutoCreatingSharedLink &&
            !sharedLink.url &&
            !submitting &&
            !sharedLink.isNewSharedLink
        ) {
            this.setState({ isAutoCreatingSharedLink: true });
            addSharedLink();
        }

        if (!prevProps.sharedLink.url && sharedLink.url) {
            this.setState({ isAutoCreatingSharedLink: false });
            if (this.toggleRef) {
                this.toggleRef.focus();
            }
        }

        if (
            prevProps.sharedLink.permissionLevel !== '' &&
            prevProps.sharedLink.permissionLevel !== CAN_EDIT &&
            sharedLink.permissionLevel === CAN_EDIT
        ) {
            this.setState({ isPermissionElevatedToEdit: true });
        }

        if (
            isPermissionElevatedToEdit &&
            (sharedLink.permissionLevel !== CAN_EDIT || sharedLink.accessLevel !== ANYONE_IN_COMPANY)
        ) {
            this.setState({ isPermissionElevatedToEdit: false });
        }

        if (
            Browser.canWriteToClipboard() &&
            triggerCopyOnLoad &&
            !isAutoCreatingSharedLink &&
            sharedLink.url &&
            isCopySuccessful === null
        ) {
            onCopyInit();
            navigator.clipboard
                .writeText(sharedLink.url)
                .then(() => {
                    this.setState({ isCopySuccessful: true });
                    onCopySuccess();
                })
                .catch(() => {
                    this.setState({ isCopySuccessful: false });
                    onCopyError();
                });
        }

        // if ESL ftux tooltip is showing on initial mount, we call onShow
        const allowedPermissionLevels = this.getAllowedPermissionLevels();

        if (
            allowedPermissionLevels.includes(CAN_EDIT) &&
            sharedLinkEditTooltipTargetingApi &&
            sharedLinkEditTooltipTargetingApi.canShow &&
            !isSharedLinkEditTooltipShown
        ) {
            const { onShow } = sharedLinkEditTooltipTargetingApi;
            onShow();
            this.setState({ isSharedLinkEditTooltipShown: true });
        }
    }

    canAddSharedLink = (isSharedLinkEnabled: boolean, canAddLink: boolean) => {
        return !isSharedLinkEnabled && canAddLink;
    };

    canRemoveSharedLink = (isSharedLinkEnabled: boolean, canRemoveLink: boolean) => {
        return isSharedLinkEnabled && canRemoveLink;
    };

    getAllowedPermissionLevels = (): Array<permissionLevelType> => {
        const { isAllowEditSharedLinkForFileEnabled, sharedLink } = this.props;

        const {
            canChangeAccessLevel,
            isEditSettingAvailable,
            isDownloadSettingAvailable,
            permissionLevel,
        } = sharedLink;

        let allowedPermissionLevels = [CAN_EDIT, CAN_VIEW_DOWNLOAD, CAN_VIEW_ONLY];

        if (!canChangeAccessLevel) {
            // remove all but current level
            allowedPermissionLevels = allowedPermissionLevels.filter(level => level === permissionLevel);
        }

        // if we cannot set the download value, we remove this option from the dropdown
        if (!isDownloadSettingAvailable) {
            allowedPermissionLevels = allowedPermissionLevels.filter(level => level !== CAN_VIEW_DOWNLOAD);
        }

        // if the user cannot edit, we remove this option from the dropdown
        if (!isEditSettingAvailable || !isAllowEditSharedLinkForFileEnabled) {
            allowedPermissionLevels = allowedPermissionLevels.filter(level => level !== CAN_EDIT);
        }

        return allowedPermissionLevels;
    };

    renderSharedLink() {
        const {
            autofocusSharedLink,
            changeSharedLinkAccessLevel,
            changeSharedLinkPermissionLevel,
            config,
            item,
            itemType,
            intl,
            onDismissTooltip,
            onEmailSharedLinkClick,
            sharedLink,
            sharedLinkEditTagTargetingApi,
            sharedLinkEditTooltipTargetingApi,
            submitting,
            trackingProps,
            triggerCopyOnLoad,
            tooltips,
        } = this.props;

        const { isCopySuccessful, isPermissionElevatedToEdit, isSharedLinkEditTooltipShown } = this.state;

        const {
            accessLevel,
            accessLevelsDisabledReason,
            allowedAccessLevels,
            canChangeAccessLevel,
            enterpriseName,
            isEditAllowed,
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

        const shouldTriggerCopyOnLoad = !!triggerCopyOnLoad && !!isCopySuccessful;

        /**
         * The email button should be rendered by default.
         * Only hide the button if there is a config prop that declares showEmailSharedLinkForm to be false.
         */
        const hideEmailButton = config && config.showEmailSharedLinkForm === false;

        const isEditableBoxNote = isBoxNote(convertToBoxItem(item)) && isEditAllowed;
        const allowedPermissionLevels = this.getAllowedPermissionLevels();

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
                            aria-label={intl.formatMessage(messages.sharedLinkURLLabel)}
                            autofocus={autofocusSharedLink}
                            buttonProps={copyButtonProps}
                            className="shared-link-field-container"
                            disabled={submitting}
                            label=""
                            onCopySuccess={onSharedLinkCopy}
                            triggerCopyOnLoad={shouldTriggerCopyOnLoad}
                            type="url"
                            value={url}
                        />
                    </Tooltip>
                    {!hideEmailButton && (
                        <Tooltip position="top-left" text={<FormattedMessage {...messages.sendSharedLink} />}>
                            <Button
                                aria-label={intl.formatMessage(messages.sendSharedLink)}
                                className="email-shared-link-btn"
                                isDisabled={submitting}
                                onClick={onEmailSharedLinkClick}
                                type="button"
                                {...sendSharedLinkButtonProps}
                            >
                                <IconMail />
                            </Button>
                        </Tooltip>
                    )}
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
                        <GuideTooltip
                            isShown={
                                allowedPermissionLevels.includes(CAN_EDIT) && sharedLinkEditTooltipTargetingApi?.canShow
                            }
                            title={intl.formatMessage(messages.ftuxEditPermissionTooltipTitle)}
                            body={intl.formatMessage(messages.ftuxEditPermissionTooltipBody)}
                            onDismiss={() => {
                                if (sharedLinkEditTooltipTargetingApi) {
                                    const { onClose } = sharedLinkEditTooltipTargetingApi;
                                    onClose();
                                }
                            }}
                            position="bottom-center"
                        >
                            <SharedLinkPermissionMenu
                                allowedPermissionLevels={allowedPermissionLevels}
                                canChangePermissionLevel={canChangeAccessLevel}
                                changePermissionLevel={changeSharedLinkPermissionLevel}
                                isSharedLinkEditTooltipShown={isSharedLinkEditTooltipShown}
                                permissionLevel={permissionLevel}
                                sharedLinkEditTagTargetingApi={sharedLinkEditTagTargetingApi}
                                sharedLinkEditTooltipTargetingApi={sharedLinkEditTooltipTargetingApi}
                                submitting={submitting}
                                trackingProps={{
                                    onChangeSharedLinkPermissionLevel,
                                    sharedLinkPermissionsMenuButtonProps,
                                }}
                            />
                        </GuideTooltip>
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
                        {permissionLevel === CAN_EDIT ? (
                            <FormattedMessage
                                data-testid="shared-link-editable-publicly-available-message"
                                {...messages.sharedLinkEditablePubliclyAvailable}
                            />
                        ) : (
                            <FormattedMessage
                                data-testid="shared-link-publicly-available-message"
                                {...messages.sharedLinkPubliclyAvailable}
                            />
                        )}
                    </div>
                )}
                {accessLevel === ANYONE_IN_COMPANY && isPermissionElevatedToEdit && (
                    <div className="security-indicator-note">
                        <span className="security-indicator-icon-globe">
                            <IconGlobe height={12} width={12} />
                        </span>
                        <FormattedMessage
                            data-testid="shared-link-elevated-editable-company-available-message"
                            {...messages.sharedLinkElevatedEditableCompanyAvailable}
                        />
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
        const { canChangeAccessLevel, expirationTimestamp, url } = sharedLink;
        const isSharedLinkEnabled = !!url;
        const canAddSharedLink = this.canAddSharedLink(isSharedLinkEnabled, item.grantedPermissions.itemShare);
        const canRemoveSharedLink = this.canRemoveSharedLink(isSharedLinkEnabled, canChangeAccessLevel);
        const isToggleEnabled = (canAddSharedLink || canRemoveSharedLink) && !submitting;

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

        const toggleComponent = (
            <div className="share-toggle-container">
                <Toggle
                    isDisabled={!isToggleEnabled}
                    isOn={isSharedLinkEnabled}
                    label={linkText}
                    name="toggle"
                    onChange={onToggleSharedLink}
                    ref={ref => {
                        this.toggleRef = ref;
                    }}
                />
            </div>
        );

        if (!submitting) {
            if (canAddSharedLink) {
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

            if (!isToggleEnabled) {
                const tooltipDisabledMessage = isSharedLinkEnabled
                    ? messages.removeLinkTooltip
                    : messages.disabledCreateLinkTooltip;

                return (
                    <Tooltip
                        className="usm-disabled-message-tooltip"
                        position="top-right"
                        text={<FormattedMessage {...tooltipDisabledMessage} />}
                    >
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
            <div className="be">
                <hr className="bdl-SharedLinkSection-separator" />
                {/* eslint-disable-next-line jsx-a11y/label-has-for */}
                <label>
                    <span className="label bdl-Label">
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
