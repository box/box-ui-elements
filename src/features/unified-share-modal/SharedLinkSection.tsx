import * as React from 'react';
import noop from 'lodash/noop';
import { FormattedMessage, injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import type { TooltipPosition, TooltipTheme, TooltipCustomPosition } from '../../components/tooltip/Tooltip';

import PlainButton from '../../components/plain-button';
import ButtonAdapter from '../../components/button/ButtonAdapter';
import { ButtonType } from '../../components/button/Button';
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

const tooltipPositions = {
    MIDDLE_RIGHT: 'middle-right' as TooltipPosition,
    MIDDLE_LEFT: 'middle-left' as TooltipPosition,
    TOP_CENTER: 'top-center' as TooltipPosition,
    TOP_LEFT: 'top-left' as TooltipPosition,
    TOP_RIGHT: 'top-right' as TooltipPosition,
    BOTTOM_CENTER: 'bottom-center' as TooltipPosition,
};

const tooltipThemes = {
    CALLOUT: 'callout' as TooltipTheme,
};

type TooltipPositionType = TooltipPosition | TooltipCustomPosition;
type TooltipThemeType = TooltipTheme;

type Props = {
    addSharedLink: () => void;
    autoCreateSharedLink?: boolean;
    autofocusSharedLink?: boolean;
    changeSharedLinkAccessLevel: (newAccessLevel: accessLevelType) => Promise<{ accessLevel: accessLevelType }>;
    changeSharedLinkPermissionLevel: (
        newPermissionLevel: permissionLevelType,
    ) => Promise<{ permissionLevel: permissionLevelType }>;
    config?: USMConfig;
    intl: IntlShape;
    isAllowEditSharedLinkForFileEnabled: boolean;
    item: itemtype;
    itemType: ItemType;
    onCopyError?: () => void;
    onCopyInit?: () => void;
    onCopySuccess?: () => void;
    onDismissTooltip: (componentIdentifier: tooltipComponentIdentifierType) => void;
    onEmailSharedLinkClick: () => void;
    onSettingsClick?: () => void;
    onToggleSharedLink: () => void;
    sharedLink: sharedLinkType;
    sharedLinkEditTagTargetingApi?: TargetingApi;
    sharedLinkEditTooltipTargetingApi?: TargetingApi;
    showSharedLinkSettingsCallout: boolean;
    submitting: boolean;
    tooltips: Record<tooltipComponentIdentifierType, React.ReactNode>;
    trackingProps: sharedLinkTrackingType;
    triggerCopyOnLoad?: boolean;
};

type State = {
    isAutoCreatingSharedLink: boolean;
    isCopySuccessful: boolean | null;
    isSharedLinkEditTooltipShown: boolean;
};

class SharedLinkSection extends React.Component<Props, State> {
    static defaultProps = {
        trackingProps: {},
        autoCreateSharedLink: false,
    };

    toggleRef: HTMLInputElement | null = null;

    constructor(props: Props) {
        super(props);

        this.state = {
            isAutoCreatingSharedLink: false,
            isCopySuccessful: null,
            isSharedLinkEditTooltipShown: false,
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

        const { isAutoCreatingSharedLink, isCopySuccessful, isSharedLinkEditTooltipShown } = this.state;

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
            allowedPermissionLevels = allowedPermissionLevels.filter(level => level === permissionLevel);
        }

        if (!isDownloadSettingAvailable) {
            allowedPermissionLevels = allowedPermissionLevels.filter(level => level !== CAN_VIEW_DOWNLOAD);
        }

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

        const { isCopySuccessful, isSharedLinkEditTooltipShown } = this.state;

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
            copyButtonProps: copyButtonTrackingProps,
            onChangeSharedLinkAccessLevel,
            onChangeSharedLinkPermissionLevel,
            onSharedLinkAccessMenuOpen,
            onSharedLinkCopy = noop,
            sendSharedLinkButtonProps,
            sharedLinkAccessMenuButtonProps: sharedLinkAccessMenuButtonTrackingProps,
            sharedLinkPermissionsMenuButtonProps: sharedLinkPermissionsMenuButtonTrackingProps,
        } = trackingProps;

        const shouldTriggerCopyOnLoad = !!triggerCopyOnLoad && !!isCopySuccessful;

        /**
         * The email button should be rendered by default.
         * Only hide the button if there is a config prop that declares showEmailSharedLinkForm to be false.
         */
        const hideEmailButton = config && config.showEmailSharedLinkForm === false;

        const isEditableBoxNote = isBoxNote(convertToBoxItem(item)) && isEditAllowed;
        const allowedPermissionLevels = this.getAllowedPermissionLevels();

        const copyButtonProps = {
            ...copyButtonTrackingProps,
            'data-target-id': 'Button-CopySharedLink',
        };

        const sharedLinkAccessMenuButtonProps = {
            ...sharedLinkAccessMenuButtonTrackingProps,
            'data-target-id': 'Button-SharedLinkAccessMenuLabel',
        };

        const sharedLinkPermissionsMenuButtonProps = {
            ...sharedLinkPermissionsMenuButtonTrackingProps,
            'data-target-id': 'Button-SharedLinkPermissionsMenuLabel',
        };

        return (
            <>
                <div className="shared-link-field-row">
                    <Tooltip
                        className="usm-ftux-tooltip"
                        isShown={!!tooltips['shared-link-copy-button']}
                        onDismiss={() => onDismissTooltip('shared-link-copy-button')}
                        position={tooltipPositions.MIDDLE_RIGHT}
                        showCloseButton
                        text={tooltips['shared-link-copy-button']}
                        theme={tooltipThemes.CALLOUT}
                    >
                        <TextInputWithCopyButton
                            aria-label={intl.formatMessage(messages.sharedLinkURLLabel)}
                            autofocus={autofocusSharedLink}
                            buttonProps={copyButtonProps}
                            className="shared-link-field-container"
                            disabled={submitting}
                            label=""
                            onCopySuccess={() => onSharedLinkCopy(permissionLevel)}
                            triggerCopyOnLoad={shouldTriggerCopyOnLoad}
                            type="url"
                            value={url}
                        />
                    </Tooltip>
                    {!hideEmailButton && (
                        <Tooltip position={tooltipPositions.TOP_LEFT} text={intl.formatMessage(messages.sendSharedLink)}>
                            <ButtonAdapter
                                aria-label={intl.formatMessage(messages.sendSharedLink)}
                                className="email-shared-link-btn"
                                data-target-id="Button-SendSharedLink"
                                isDisabled={submitting}
                                onClick={onEmailSharedLinkClick}
                                type={ButtonType.BUTTON}
                                {...sendSharedLinkButtonProps}
                            >
                                <IconMail />
                            </ButtonAdapter>
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
                            position={tooltipPositions.BOTTOM_CENTER}
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
                        <Tooltip text={intl.formatMessage(messages.sharedLinkPermissionsEditTooltip)}>
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
                        {permissionLevel === CAN_EDIT && (
                            <FormattedMessage
                                data-testid="shared-link-editable-publicly-available-message"
                                {...messages.sharedLinkEditablePubliclyAvailable}
                            />
                        )}
                        {permissionLevel !== CAN_EDIT && (
                            <FormattedMessage
                                data-testid="shared-link-publicly-available-message"
                                {...messages.sharedLinkPubliclyAvailable}
                            />
                        )}
                    </div>
                )}
                {accessLevel === ANYONE_IN_COMPANY && permissionLevel === CAN_EDIT && (
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
                    position={tooltipPositions.MIDDLE_RIGHT}
                    showCloseButton
                    text={
                        tooltips['shared-link-settings'] || intl.formatMessage(messages.sharedLinkSettingsCalloutText)
                    }
                    theme={tooltipThemes.CALLOUT}
                >
                    <PlainButton
                        {...sharedLinkSettingsButtonProps}
                        aria-haspopup="dialog"
                        className="shared-link-settings-btn"
                        data-target-id="PlainButton-SharedLinkSettings"
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
        const { intl, item, onDismissTooltip, onToggleSharedLink, sharedLink, submitting, tooltips } = this.props;
        const { canChangeAccessLevel, expirationTimestamp, url } = sharedLink;
        const isSharedLinkEnabled = !!url;
        const canAddSharedLink = !isSharedLinkEnabled && item.grantedPermissions.itemShare;
        const canRemoveSharedLink = isSharedLinkEnabled && canChangeAccessLevel;
        const isToggleEnabled = (canAddSharedLink || canRemoveSharedLink) && !submitting;

        let linkText;
        if (isSharedLinkEnabled) {
            linkText = <FormattedMessage {...messages.linkShareOn} />;
            if (expirationTimestamp && expirationTimestamp !== 0) {
                linkText = (
                    <span>
                        <FormattedMessage {...messages.linkShareOn} />
                        <Tooltip
                            position={tooltipPositions.TOP_CENTER}
                            text={intl.formatMessage(messages.sharedLinkExpirationTooltip, {
                                expiration: convertToMs(expirationTimestamp),
                            })}
                        >
                            <span
                                aria-label={intl.formatMessage(messages.expiresMessage)}
                                className="shared-link-expiration-badge"
                                role="img"
                            >
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
            <Toggle
                data-target-id="Toggle-CreateSharedLink"
                isDisabled={!isToggleEnabled}
                isOn={isSharedLinkEnabled}
                label={linkText}
                name="toggle"
                onChange={onToggleSharedLink}
                ref={ref => {
                    this.toggleRef = ref;
                }}
            />
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
                            position={tooltipPositions.MIDDLE_LEFT}
                            showCloseButton
                            text={sharedLinkToggleTooltip}
                            theme={tooltipThemes.CALLOUT}
                        >
                            {toggleComponent}
                        </Tooltip>
                    );
                }
                return (
                    <Tooltip position={tooltipPositions.TOP_RIGHT} text={intl.formatMessage(messages.sharedLinkDisabledTooltipCopy)}>
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
                        position={tooltipPositions.TOP_RIGHT}
                        text={intl.formatMessage(tooltipDisabledMessage)}
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

export default injectIntl(SharedLinkSection);
