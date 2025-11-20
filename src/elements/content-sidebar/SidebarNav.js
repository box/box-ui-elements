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
import classNames from 'classnames';
import { BoxAiLogo, BoxAiLogo24 } from '@box/blueprint-web-assets/icons/Logo';
import { Size6, Size5, IconIconBlue } from '@box/blueprint-web-assets/tokens/tokens';
import { usePromptFocus } from '@box/box-ai-content-answers';
import CommentIcon from '@box/blueprint-web-assets/icons/Medium/Comment';
import CommentIconFilled from '@box/blueprint-web-assets/icons/MediumFilled/Comment';
import InfoIcon from '@box/blueprint-web-assets/icons/Medium/InformationCircle';
import InfoIconFilled from '@box/blueprint-web-assets/icons/MediumFilled/InformationCircle';
import MetadataIcon from '@box/blueprint-web-assets/icons/Medium/Metadata';
import MetadataIconFilled from '@box/blueprint-web-assets/icons/MediumFilled/Metadata';
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
import type { NavigateOptions, AdditionalSidebarTab } from './flowTypes';
import type { InternalSidebarNavigation, InternalSidebarNavigationHandler } from '../common/types/SidebarNavigation';
import './SidebarNav.scss';
import type { SignSidebarProps } from './SidebarNavSign';

const SIDEBAR_TAB_ICON_PROPS = {
    height: Size5,
    width: Size5,
};

type Props = {
    additionalTabs?: Array<AdditionalSidebarTab>,
    elementId: string,
    fileId: string,
    hasActivity: boolean,
    hasAdditionalTabs: boolean,
    hasBoxAI: boolean,
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
    elementId,
    fileId,
    hasActivity,
    hasAdditionalTabs,
    hasBoxAI,
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

    // Icon wrapper components that receive isActive prop from SidebarNavButton
    const ActivityIconWrapper = ({ isActive }: { isActive?: boolean }) => {
        if (!isPreviewModernizationEnabled) {
            return <IconChatRound className="bcs-SidebarNav-icon" />;
        }
        return isActive ? (
            <CommentIconFilled {...SIDEBAR_TAB_ICON_PROPS} color={IconIconBlue} />
        ) : (
            <CommentIcon {...SIDEBAR_TAB_ICON_PROPS} />
        );
    };

    const DetailsIconWrapper = ({ isActive }: { isActive?: boolean }) => {
        if (!isPreviewModernizationEnabled) {
            return <IconDocInfo className="bcs-SidebarNav-icon" />;
        }
        return isActive ? (
            <InfoIconFilled {...SIDEBAR_TAB_ICON_PROPS} color={IconIconBlue} />
        ) : (
            <InfoIcon {...SIDEBAR_TAB_ICON_PROPS} />
        );
    };

    const MetadataIconWrapper = ({ isActive }: { isActive?: boolean }) => {
        if (!isPreviewModernizationEnabled) {
            return <IconMetadataThick className="bcs-SidebarNav-icon" />;
        }
        return isActive ? (
            <MetadataIconFilled {...SIDEBAR_TAB_ICON_PROPS} color={IconIconBlue} />
        ) : (
            <MetadataIcon {...SIDEBAR_TAB_ICON_PROPS} />
        );
    };

    return (
        <div className="bcs-SidebarNav" aria-label={intl.formatMessage(messages.sidebarNavLabel)}>
            <div className="bcs-SidebarNav-tabs">
                <SidebarNavTablist
                    elementId={elementId}
                    internalSidebarNavigation={internalSidebarNavigation}
                    internalSidebarNavigationHandler={internalSidebarNavigationHandler}
                    isOpen={isOpen}
                    onNavigate={onNavigate}
                    routerDisabled={routerDisabled}
                >
                    {hasBoxAI && (
                        <SidebarNavButton
                            isPreviewModernizationEnabled={isPreviewModernizationEnabled}
                            data-resin-target={SIDEBAR_NAV_TARGETS.BOXAI}
                            data-target-id="SidebarNavButton-boxAI"
                            data-testid="sidebarboxai"
                            isDisabled={showOnlyBoxAINavButton}
                            onClick={handleSidebarNavButtonClick}
                            sidebarView={SIDEBAR_VIEW_BOXAI}
                            tooltip={
                                showOnlyBoxAINavButton
                                    ? boxAIDisabledTooltip
                                    : intl.formatMessage(messages.sidebarBoxAITitle)
                            }
                        >
                            {isPreviewModernizationEnabled ? (
                                <BoxAiLogo24 {...SIDEBAR_TAB_ICON_PROPS} />
                            ) : (
                                <BoxAiLogo height={Size6} width={Size6} />
                            )}
                        </SidebarNavButton>
                    )}
                    {hasActivity && (
                        <SidebarNavButton
                            isPreviewModernizationEnabled={isPreviewModernizationEnabled}
                            data-resin-target={SIDEBAR_NAV_TARGETS.ACTIVITY}
                            data-target-id="SidebarNavButton-activity"
                            data-testid="sidebaractivity"
                            onClick={handleSidebarNavButtonClick}
                            sidebarView={SIDEBAR_VIEW_ACTIVITY}
                            tooltip={intl.formatMessage(messages.sidebarActivityTitle)}
                        >
                            <ActivityIconWrapper />
                        </SidebarNavButton>
                    )}
                    {hasDetails && (
                        <SidebarNavButton
                            isPreviewModernizationEnabled={isPreviewModernizationEnabled}
                            data-resin-target={SIDEBAR_NAV_TARGETS.DETAILS}
                            data-target-id="SidebarNavButton-details"
                            data-testid="sidebardetails"
                            onClick={handleSidebarNavButtonClick}
                            sidebarView={SIDEBAR_VIEW_DETAILS}
                            tooltip={intl.formatMessage(messages.sidebarDetailsTitle)}
                        >
                            <DetailsIconWrapper />
                        </SidebarNavButton>
                    )}
                    {hasSkills && (
                        <SidebarNavButton
                            isPreviewModernizationEnabled={isPreviewModernizationEnabled}
                            data-resin-target={SIDEBAR_NAV_TARGETS.SKILLS}
                            data-target-id="SidebarNavButton-skills"
                            data-testid="sidebarskills"
                            onClick={handleSidebarNavButtonClick}
                            sidebarView={SIDEBAR_VIEW_SKILLS}
                            tooltip={intl.formatMessage(messages.sidebarSkillsTitle)}
                        >
                            <IconMagicWand className="bcs-SidebarNav-icon" />
                        </SidebarNavButton>
                    )}
                    {hasMetadata && (
                        <SidebarNavButton
                            isPreviewModernizationEnabled={isPreviewModernizationEnabled}
                            data-resin-target={SIDEBAR_NAV_TARGETS.METADATA}
                            data-target-id="SidebarNavButton-metadata"
                            data-testid="sidebarmetadata"
                            onClick={handleSidebarNavButtonClick}
                            sidebarView={SIDEBAR_VIEW_METADATA}
                            tooltip={intl.formatMessage(messages.sidebarMetadataTitle)}
                        >
                            <MetadataIconWrapper />
                        </SidebarNavButton>
                    )}
                    {hasDocGen && (
                        <SidebarNavButton
                            elementId=""
                            isPreviewModernizationEnabled={isPreviewModernizationEnabled}
                            data-resin-target={SIDEBAR_NAV_TARGETS.DOCGEN}
                            data-target-id="SidebarNavButton-docGen"
                            data-testid="sidebardocgen"
                            onClick={handleSidebarNavButtonClick}
                            sidebarView={SIDEBAR_VIEW_DOCGEN}
                            tooltip={intl.formatMessage(messages.sidebarDocGenTooltip)}
                        >
                            <DocGenIcon className="bcs-SidebarNav-icon" />
                        </SidebarNavButton>
                    )}
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
