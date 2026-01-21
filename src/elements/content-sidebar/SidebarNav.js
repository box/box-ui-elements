/**
 * @flow
 * @file Preview sidebar nav component
 * @author Box
 */

import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import classNames from 'classnames';
import noop from 'lodash/noop';
import { BoxAiLogo, BoxAiLogo24 } from '@box/blueprint-web-assets/icons/Logo';
import {
    Comment as CommentIcon,
    InformationCircle as InformationCircleIcon,
    Metadata as MetadataIcon,
    MagicWand as MagicWandIcon,
    DocGen as BPDocGenIcon,
} from '@box/blueprint-web-assets/icons/Medium';
import {
    Comment as CommentIconFilled,
    InformationCircle as InformationCircleIconFilled,
    Metadata as MetadataIconFilled,
    MagicWand as MagicWandIconFilled,
} from '@box/blueprint-web-assets/icons/MediumFilled';
import { Size6, Size5, IconIconBlue } from '@box/blueprint-web-assets/tokens/tokens';
import { usePromptFocus } from '@box/box-ai-content-answers';
import AdditionalTabs from './additional-tabs';
import DocGenIcon from '../../icon/fill/DocGenIcon';
import IconChatRound from '../../icons/general/IconChatRound';
import IconDocInfo from '../../icons/general/IconDocInfo';
import IconMagicWand from '../../icons/general/IconMagicWand';
import IconMetadataThick from '../../icons/general/IconMetadataThick';
import SidebarNavButton from './SidebarNavButton';
import SidebarNavSign from './SidebarNavSign';
import SidebarNavTablist from './SidebarNavTablist';
import SidebarToggle from './SidebarToggle';
import messages from '../common/messages';
import { SIDEBAR_NAV_TARGETS } from '../common/interactionTargets';
import {
    SIDEBAR_VIEW_ACTIVITY,
    SIDEBAR_VIEW_BOXAI,
    SIDEBAR_VIEW_DETAILS,
    SIDEBAR_VIEW_DOCGEN,
    SIDEBAR_VIEW_METADATA,
    SIDEBAR_VIEW_SKILLS,
} from '../../constants';
import { useFeatureConfig } from '../common/feature-checking';
import type { NavigateOptions, AdditionalSidebarTab, CustomSidebarPanel } from './flowTypes';
import type { InternalSidebarNavigation, InternalSidebarNavigationHandler } from '../common/types/SidebarNavigation';
import './SidebarNav.scss';
import type { SignSidebarProps } from './SidebarNavSign';

const SIDEBAR_TAB_ICON_PROPS = {
    height: Size5,
    width: Size5,
};

type IconWrapperProps = {
    isActive?: boolean,
    isPreviewModernizationEnabled: boolean,
};

// Icon wrapper components that receive isActive prop from SidebarNavButton
const ActivityIconWrapper = ({ isActive, isPreviewModernizationEnabled }: IconWrapperProps) => {
    if (!isPreviewModernizationEnabled) {
        return <IconChatRound className="bcs-SidebarNav-icon" />;
    }
    return isActive ? (
        <CommentIconFilled {...SIDEBAR_TAB_ICON_PROPS} color={IconIconBlue} />
    ) : (
        <CommentIcon {...SIDEBAR_TAB_ICON_PROPS} />
    );
};

const DetailsIconWrapper = ({ isActive, isPreviewModernizationEnabled }: IconWrapperProps) => {
    if (!isPreviewModernizationEnabled) {
        return <IconDocInfo className="bcs-SidebarNav-icon" />;
    }
    return isActive ? (
        <InformationCircleIconFilled {...SIDEBAR_TAB_ICON_PROPS} color={IconIconBlue} />
    ) : (
        <InformationCircleIcon {...SIDEBAR_TAB_ICON_PROPS} />
    );
};

const MetadataIconWrapper = ({ isActive, isPreviewModernizationEnabled }: IconWrapperProps) => {
    if (!isPreviewModernizationEnabled) {
        return <IconMetadataThick className="bcs-SidebarNav-icon" />;
    }
    return isActive ? (
        <MetadataIconFilled {...SIDEBAR_TAB_ICON_PROPS} color={IconIconBlue} />
    ) : (
        <MetadataIcon {...SIDEBAR_TAB_ICON_PROPS} />
    );
};

const SkillsIconWrapper = ({ isActive, isPreviewModernizationEnabled }: IconWrapperProps) => {
    if (!isPreviewModernizationEnabled) {
        return <IconMagicWand className="bcs-SidebarNav-icon" />;
    }
    return isActive ? (
        <MagicWandIconFilled {...SIDEBAR_TAB_ICON_PROPS} color={IconIconBlue} />
    ) : (
        <MagicWandIcon {...SIDEBAR_TAB_ICON_PROPS} />
    );
};

const DocGenIconWrapper = ({ isActive, isPreviewModernizationEnabled }: IconWrapperProps) => {
    if (!isPreviewModernizationEnabled) {
        return <DocGenIcon className="bcs-SidebarNav-icon" />;
    }
    return isActive ? (
        <BPDocGenIcon {...SIDEBAR_TAB_ICON_PROPS} color={IconIconBlue} />
    ) : (
        <BPDocGenIcon {...SIDEBAR_TAB_ICON_PROPS} />
    );
};

/**
 * Renders a custom panel icon with fallback support.
 * Handles React elements, component types, and provides default icons when none specified.
 */
const renderCustomPanelIcon = (
    icon?: React.ComponentType<any> | React.Element<any>,
    isPreviewModernizationEnabled: boolean,
    defaultModernIcon: React.Node,
    defaultLegacyIcon: React.Node,
): React.Node => {
    if (!icon) {
        return isPreviewModernizationEnabled ? defaultModernIcon : defaultLegacyIcon;
    }

    if (React.isValidElement(icon)) {
        // Icon is already a React element, return as-is
        return (icon: any);
    }

    // Icon is a component type, render it
    const IconComponent: React.ComponentType<any> = (icon: any);
    return <IconComponent className="bcs-SidebarNav-icon" />;
};

type Props = {
    additionalTabs?: Array<AdditionalSidebarTab>,
    customTabs?: Array<CustomSidebarPanel>,
    elementId: string,
    fileId: string,
    hasActivity: boolean,
    hasAdditionalTabs: boolean,
    hasNativeBoxAISidebar: boolean,
    hasDetails: boolean,
    hasDocGen?: boolean,
    hasMetadata: boolean,
    hasSkills: boolean,
    internalSidebarNavigation?: InternalSidebarNavigation,
    internalSidebarNavigationHandler?: InternalSidebarNavigationHandler,
    intl: IntlShape,
    isOpen?: boolean,
    onNavigate?: (SyntheticEvent<>, NavigateOptions) => void,
    onPanelChange?: (name: string, isInitialState: boolean) => void,
    routerDisabled?: boolean,
    signSidebarProps: SignSidebarProps,
};

const SidebarNav = ({
    additionalTabs,
    customTabs,
    elementId,
    fileId,
    hasActivity,
    hasAdditionalTabs,
    hasNativeBoxAISidebar,
    hasDetails,
    hasMetadata,
    hasSkills,
    hasDocGen = false,
    internalSidebarNavigation,
    internalSidebarNavigationHandler,
    intl,
    isOpen,
    onNavigate,
    onPanelChange = noop,
    routerDisabled,
    signSidebarProps,
}: Props) => {
    const { enabled: hasBoxSign } = signSidebarProps || {};
    const { disabledTooltip: boxAIDisabledTooltip, showOnlyNavButton: showOnlyBoxAINavButton } =
        useFeatureConfig('boxai.sidebar');
    const { enabled: isPreviewModernizationEnabled } = useFeatureConfig('previewModernization');

    const { focusPrompt } = usePromptFocus('.be.bcs');

    const handleSidebarNavButtonClick = (sidebarview: string) => {
        onPanelChange(sidebarview, false);

        // If the Box AI sidebar is enabled, focus the Box AI sidebar prompt
        if (sidebarview === SIDEBAR_VIEW_BOXAI) {
            focusPrompt();
        }
    };
    const boxAiTab = customTabs ? customTabs.find(tab => tab.id === SIDEBAR_VIEW_BOXAI) : undefined;
    const otherCustomTabs = customTabs ? customTabs.filter(tab => tab.id !== SIDEBAR_VIEW_BOXAI) : [];
    const hasOtherCustomTabs = otherCustomTabs.length > 0;

    const sidebarTabs = [
        hasNativeBoxAISidebar && (
            <SidebarNavButton
                key={SIDEBAR_VIEW_BOXAI}
                isPreviewModernizationEnabled={isPreviewModernizationEnabled}
                data-resin-target={SIDEBAR_NAV_TARGETS.BOXAI}
                data-target-id="SidebarNavButton-boxAI"
                data-testid="sidebarboxai"
                isDisabled={showOnlyBoxAINavButton}
                onClick={handleSidebarNavButtonClick}
                sidebarView={SIDEBAR_VIEW_BOXAI}
                tooltip={showOnlyBoxAINavButton ? boxAIDisabledTooltip : intl.formatMessage(messages.sidebarBoxAITitle)}
            >
                {isPreviewModernizationEnabled ? (
                    <BoxAiLogo24 {...SIDEBAR_TAB_ICON_PROPS} />
                ) : (
                    <BoxAiLogo height={Size6} width={Size6} />
                )}
            </SidebarNavButton>
        ),
        !hasNativeBoxAISidebar && boxAiTab && (
            <SidebarNavButton
                key={boxAiTab.id}
                isPreviewModernizationEnabled={isPreviewModernizationEnabled}
                data-target-id={`SidebarNavButton-$boxAI`}
                data-testid={`sidebar${boxAiTab.id}`}
                {...boxAiTab.navButtonProps}
                data-resin-target={SIDEBAR_NAV_TARGETS.BOXAI}
                isDisabled={boxAiTab.isDisabled}
                onClick={handleSidebarNavButtonClick}
                sidebarView={boxAiTab.path}
                tooltip={boxAiTab.title ?? boxAiTab.id}
            >
                {renderCustomPanelIcon(
                    boxAiTab.icon,
                    isPreviewModernizationEnabled,
                    <BoxAiLogo24 {...SIDEBAR_TAB_ICON_PROPS} />,
                    <BoxAiLogo height={Size6} width={Size6} />,
                )}
            </SidebarNavButton>
        ),
        hasActivity && (
            <SidebarNavButton
                key={SIDEBAR_VIEW_ACTIVITY}
                isPreviewModernizationEnabled={isPreviewModernizationEnabled}
                data-resin-target={SIDEBAR_NAV_TARGETS.ACTIVITY}
                data-target-id="SidebarNavButton-activity"
                data-testid="sidebaractivity"
                onClick={handleSidebarNavButtonClick}
                sidebarView={SIDEBAR_VIEW_ACTIVITY}
                tooltip={intl.formatMessage(messages.sidebarActivityTitle)}
            >
                <ActivityIconWrapper isPreviewModernizationEnabled={isPreviewModernizationEnabled} />
            </SidebarNavButton>
        ),
        hasDetails && (
            <SidebarNavButton
                key={SIDEBAR_VIEW_DETAILS}
                isPreviewModernizationEnabled={isPreviewModernizationEnabled}
                data-resin-target={SIDEBAR_NAV_TARGETS.DETAILS}
                data-target-id="SidebarNavButton-details"
                data-testid="sidebardetails"
                onClick={handleSidebarNavButtonClick}
                sidebarView={SIDEBAR_VIEW_DETAILS}
                tooltip={intl.formatMessage(messages.sidebarDetailsTitle)}
            >
                <DetailsIconWrapper isPreviewModernizationEnabled={isPreviewModernizationEnabled} />
            </SidebarNavButton>
        ),
        hasSkills && (
            <SidebarNavButton
                key={SIDEBAR_VIEW_SKILLS}
                isPreviewModernizationEnabled={isPreviewModernizationEnabled}
                data-resin-target={SIDEBAR_NAV_TARGETS.SKILLS}
                data-target-id="SidebarNavButton-skills"
                data-testid="sidebarskills"
                onClick={handleSidebarNavButtonClick}
                sidebarView={SIDEBAR_VIEW_SKILLS}
                tooltip={intl.formatMessage(messages.sidebarSkillsTitle)}
            >
                <SkillsIconWrapper isPreviewModernizationEnabled={isPreviewModernizationEnabled} />
            </SidebarNavButton>
        ),
        hasMetadata && (
            <SidebarNavButton
                key={SIDEBAR_VIEW_METADATA}
                isPreviewModernizationEnabled={isPreviewModernizationEnabled}
                data-resin-target={SIDEBAR_NAV_TARGETS.METADATA}
                data-target-id="SidebarNavButton-metadata"
                data-testid="sidebarmetadata"
                onClick={handleSidebarNavButtonClick}
                sidebarView={SIDEBAR_VIEW_METADATA}
                tooltip={intl.formatMessage(messages.sidebarMetadataTitle)}
            >
                <MetadataIconWrapper isPreviewModernizationEnabled={isPreviewModernizationEnabled} />
            </SidebarNavButton>
        ),
        hasDocGen && (
            <SidebarNavButton
                key={SIDEBAR_VIEW_DOCGEN}
                isPreviewModernizationEnabled={isPreviewModernizationEnabled}
                data-resin-target={SIDEBAR_NAV_TARGETS.DOCGEN}
                data-target-id="SidebarNavButton-docgen"
                data-testid="sidebardocgen"
                onClick={handleSidebarNavButtonClick}
                sidebarView={SIDEBAR_VIEW_DOCGEN}
                tooltip={intl.formatMessage(messages.sidebarDocGenTooltip)}
            >
                <DocGenIconWrapper isPreviewModernizationEnabled={isPreviewModernizationEnabled} />
            </SidebarNavButton>
        ),
    ];

    const visibleTabs = sidebarTabs.filter(Boolean);

    if (hasOtherCustomTabs) {
        otherCustomTabs.forEach(customTab => {
            const {
                id: customTabId,
                path: customTabPath,
                icon: CustomTabIcon,
                title: customTabTitle,
                navButtonProps,
            } = customTab;

            const customTabButton = (
                <SidebarNavButton
                    key={customTabId}
                    isPreviewModernizationEnabled={isPreviewModernizationEnabled}
                    data-resin-target={`sidebar${customTabId}`}
                    data-target-id={`SidebarNavButton-${customTabId}`}
                    data-testid={`sidebar${customTabId}`}
                    {...navButtonProps}
                    isDisabled={customTab.isDisabled}
                    onClick={handleSidebarNavButtonClick}
                    sidebarView={customTabPath}
                    tooltip={customTabTitle ?? customTabId}
                >
                    {renderCustomPanelIcon(
                        CustomTabIcon,
                        isPreviewModernizationEnabled,
                        <InformationCircleIcon {...SIDEBAR_TAB_ICON_PROPS} />,
                        <IconDocInfo className="bcs-SidebarNav-icon" />,
                    )}
                </SidebarNavButton>
            );

            visibleTabs.push(customTabButton); // Add at the end
        });
    }

    return (
        <div
            className={classNames('bcs-SidebarNav', {
                'bcs-SidebarNav--modernized': isPreviewModernizationEnabled,
            })}
            aria-label={intl.formatMessage(messages.sidebarNavLabel)}
        >
            <div className="bcs-SidebarNav-tabs">
                <SidebarNavTablist
                    elementId={elementId}
                    internalSidebarNavigation={internalSidebarNavigation}
                    internalSidebarNavigationHandler={internalSidebarNavigationHandler}
                    isOpen={isOpen}
                    onNavigate={onNavigate}
                    routerDisabled={routerDisabled}
                >
                    {visibleTabs}
                </SidebarNavTablist>

                {hasBoxSign && (
                    <div className="bcs-SidebarNav-secondary">
                        <SidebarNavSign {...signSidebarProps} />
                    </div>
                )}

                {hasAdditionalTabs && (
                    <div
                        className={classNames('bcs-SidebarNav-overflow', {
                            'bcs-SidebarNav-overflow--modernized': isPreviewModernizationEnabled,
                        })}
                        data-testid="additional-tabs-overflow"
                    >
                        <AdditionalTabs
                            isPreviewModernizationEnabled={isPreviewModernizationEnabled}
                            key={fileId}
                            tabs={additionalTabs}
                        />
                    </div>
                )}
            </div>
            <div className="bcs-SidebarNav-footer">
                <SidebarToggle
                    internalSidebarNavigation={internalSidebarNavigation}
                    internalSidebarNavigationHandler={internalSidebarNavigationHandler}
                    isOpen={isOpen}
                    routerDisabled={routerDisabled}
                />
            </div>
        </div>
    );
};
export default injectIntl(SidebarNav);
