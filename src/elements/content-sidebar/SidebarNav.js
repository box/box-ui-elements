/**
 * @flow
 * @file Preview sidebar nav component
 * @author Box
 */

import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import noop from 'lodash/noop';
// $FlowFixMe
import { BoxAiLogo } from '@box/blueprint-web-assets/icons/Logo';
// $FlowFixMe
import { Size6 } from '@box/blueprint-web-assets/tokens/tokens';
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

type Props = {
    additionalTabs?: Array<AdditionalSidebarTab>,
    customTab?: CustomSidebarPanel,
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

const renderNavButton = (config, handleSidebarNavButtonClick) => (
    // $FlowFixMe[incompatible-type] Allow custom panel string ids for sidebarView
    <SidebarNavButton
        key={config.key}
        data-resin-target={config.analyticsTarget}
        data-target-id={`SidebarNavButton-${config.id}`}
        data-testid={config.testId}
        isDisabled={config.isDisabled || false}
        onClick={handleSidebarNavButtonClick}
        sidebarView={config.view}
        tooltip={config.tooltip}
        {...(config.additionalProps || {})}
    >
        {config.icon}
    </SidebarNavButton>
);

const SidebarNav = ({
    additionalTabs,
    customTab,
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

    const { focusPrompt } = usePromptFocus('.be.bcs');

    const handleSidebarNavButtonClick = (sidebarview: string) => {
        onPanelChange(sidebarview, false);

        // If the Box AI sidebar is enabled, focus the Box AI sidebar prompt
        if (sidebarview === SIDEBAR_VIEW_BOXAI) {
            focusPrompt();
        }
    };
    const { icon: CustomTabIcon, index: customTabIndex = 0, title: customTabTitle, navButtonProps } = customTab || {};
    const customTabId = customTab && typeof customTab.id === 'string' ? customTab.id.trim() : '';
    const hasCustomTab = !!customTabId;
    const hasBoxAICustomTab = customTabId === 'boxai';

    // Configuration-driven button definitions
    const getButtonConfigs = () => {
        const configs = [];

        // BoxAI button (always first)
        if (hasBoxAI && !hasBoxAICustomTab) {
            configs.push({
                key: 'boxai',
                id: 'boxAI',
                view: SIDEBAR_VIEW_BOXAI,
                analyticsTarget: SIDEBAR_NAV_TARGETS.BOXAI,
                testId: 'sidebarboxai',
                tooltip: showOnlyBoxAINavButton ? boxAIDisabledTooltip : intl.formatMessage(messages.sidebarBoxAITitle),
                isDisabled: showOnlyBoxAINavButton,
                icon: <BoxAiLogo height={Size6} width={Size6} />,
            });
        }

        // Default buttons
        const defaultButtons = [
            {
                key: 'activity',
                id: 'activity',
                view: SIDEBAR_VIEW_ACTIVITY,
                analyticsTarget: SIDEBAR_NAV_TARGETS.ACTIVITY,
                testId: 'sidebaractivity',
                tooltip: intl.formatMessage(messages.sidebarActivityTitle),
                icon: <IconChatRound className="bcs-SidebarNav-icon" />,
                condition: hasActivity,
            },
            {
                key: 'details',
                id: 'details',
                view: SIDEBAR_VIEW_DETAILS,
                analyticsTarget: SIDEBAR_NAV_TARGETS.DETAILS,
                testId: 'sidebardetails',
                tooltip: intl.formatMessage(messages.sidebarDetailsTitle),
                icon: <IconDocInfo className="bcs-SidebarNav-icon" />,
                condition: hasDetails,
            },
            {
                key: 'skills',
                id: 'skills',
                view: SIDEBAR_VIEW_SKILLS,
                analyticsTarget: SIDEBAR_NAV_TARGETS.SKILLS,
                testId: 'sidebarskills',
                tooltip: intl.formatMessage(messages.sidebarSkillsTitle),
                icon: <IconMagicWand className="bcs-SidebarNav-icon" />,
                condition: hasSkills,
            },
            {
                key: 'metadata',
                id: 'metadata',
                view: SIDEBAR_VIEW_METADATA,
                analyticsTarget: SIDEBAR_NAV_TARGETS.METADATA,
                testId: 'sidebarmetadata',
                tooltip: intl.formatMessage(messages.sidebarMetadataTitle),
                icon: <IconMetadataThick className="bcs-SidebarNav-icon" />,
                condition: hasMetadata,
            },
            {
                key: 'docgen',
                id: 'docGen',
                view: SIDEBAR_VIEW_DOCGEN,
                analyticsTarget: SIDEBAR_NAV_TARGETS.DOCGEN,
                testId: 'sidebardocgen',
                tooltip: intl.formatMessage(messages.sidebarDocGenTooltip),
                icon: <DocGenIcon className="bcs-SidebarNav-icon" />,
                condition: hasDocGen,
            },
        ];

        // Add default buttons that meet their conditions
        defaultButtons.forEach(button => {
            if (button.condition) {
                configs.push(button);
            }
        });

        // Insert custom panel at the correct position
        if (hasCustomTab) {
            const insertPosition = Math.min(customTabIndex, configs.length);

            const customTabConfig = {
                key: customTabId,
                id: customTabId,
                view: customTabId,
                analyticsTarget: `sidebar${customTabId}`,
                testId: `sidebar${customTabId}`,
                tooltip: customTabTitle ?? customTabId,
                icon: CustomTabIcon ? <CustomTabIcon className="bcs-SidebarNav-icon" /> : null,
                additionalProps: navButtonProps,
            };

            configs.splice(insertPosition, 0, customTabConfig);
        }

        return configs;
    };

    const navButtons = getButtonConfigs().map(config => renderNavButton(config, handleSidebarNavButtonClick));

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
                    {navButtons}
                </SidebarNavTablist>

                {hasBoxSign && (
                    <div className="bcs-SidebarNav-secondary">
                        <SidebarNavSign {...signSidebarProps} />
                    </div>
                )}

                {hasAdditionalTabs && (
                    <div className="bcs-SidebarNav-overflow" data-testid="additional-tabs-overflow">
                        <AdditionalTabs key={fileId} tabs={additionalTabs} />
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
