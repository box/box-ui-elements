/**
 * @flow
 * @file Preview sidebar nav component
 * @author Box
 */

import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import noop from 'lodash/noop';
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
import type { NavigateOptions, AdditionalSidebarTab, CustomSidebarPanel } from './flowTypes';
import type { InternalSidebarNavigation, InternalSidebarNavigationHandler } from '../common/types/SidebarNavigation';
import './SidebarNav.scss';
import type { SignSidebarProps } from './SidebarNavSign';

type Props = {
    additionalTabs?: Array<AdditionalSidebarTab>,
    customTabs?: Array<CustomSidebarPanel>,
    elementId: string,
    fileId: string,
    hasActivity: boolean,
    hasAdditionalTabs: boolean,
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
    const hasOtherCustomTabs = otherCustomTabs && otherCustomTabs.length > 0;

    const sidebarTabs = [
        boxAiTab && (
            <SidebarNavButton
                key={boxAiTab.id}
                data-resin-target={SIDEBAR_NAV_TARGETS.BOXAI}
                data-target-id={`SidebarNavButton-${boxAiTab.id}`}
                data-testid={`sidebar${boxAiTab.id}`}
                isDisabled={boxAiTab.isDisabled}
                {...boxAiTab.navButtonProps}
                onClick={handleSidebarNavButtonClick}
                sidebarView={boxAiTab.path}
                tooltip={boxAiTab.title ?? boxAiTab.id}
            >
                {boxAiTab.icon &&
                    (React.isValidElement(boxAiTab.icon)
                        ? React.cloneElement((boxAiTab.icon: any), { className: 'bcs-SidebarNav-icon' })
                        : React.createElement((boxAiTab.icon: any), { className: 'bcs-SidebarNav-icon' }))}
            </SidebarNavButton>
        ),
        hasActivity && (
            <SidebarNavButton
                key={SIDEBAR_VIEW_ACTIVITY}
                data-resin-target={SIDEBAR_NAV_TARGETS.ACTIVITY}
                data-target-id="SidebarNavButton-activity"
                data-testid="sidebaractivity"
                onClick={handleSidebarNavButtonClick}
                sidebarView={SIDEBAR_VIEW_ACTIVITY}
                tooltip={intl.formatMessage(messages.sidebarActivityTitle)}
            >
                <IconChatRound className="bcs-SidebarNav-icon" />
            </SidebarNavButton>
        ),
        hasDetails && (
            <SidebarNavButton
                key={SIDEBAR_VIEW_DETAILS}
                data-resin-target={SIDEBAR_NAV_TARGETS.DETAILS}
                data-target-id="SidebarNavButton-details"
                data-testid="sidebardetails"
                onClick={handleSidebarNavButtonClick}
                sidebarView={SIDEBAR_VIEW_DETAILS}
                tooltip={intl.formatMessage(messages.sidebarDetailsTitle)}
            >
                <IconDocInfo className="bcs-SidebarNav-icon" />
            </SidebarNavButton>
        ),
        hasSkills && (
            <SidebarNavButton
                key={SIDEBAR_VIEW_SKILLS}
                data-resin-target={SIDEBAR_NAV_TARGETS.SKILLS}
                data-target-id="SidebarNavButton-skills"
                data-testid="sidebarskills"
                onClick={handleSidebarNavButtonClick}
                sidebarView={SIDEBAR_VIEW_SKILLS}
                tooltip={intl.formatMessage(messages.sidebarSkillsTitle)}
            >
                <IconMagicWand className="bcs-SidebarNav-icon" />
            </SidebarNavButton>
        ),
        hasMetadata && (
            <SidebarNavButton
                key={SIDEBAR_VIEW_METADATA}
                data-resin-target={SIDEBAR_NAV_TARGETS.METADATA}
                data-target-id="SidebarNavButton-metadata"
                data-testid="sidebarmetadata"
                onClick={handleSidebarNavButtonClick}
                sidebarView={SIDEBAR_VIEW_METADATA}
                tooltip={intl.formatMessage(messages.sidebarMetadataTitle)}
            >
                <IconMetadataThick className="bcs-SidebarNav-icon" />
            </SidebarNavButton>
        ),
        hasDocGen && (
            <SidebarNavButton
                key={SIDEBAR_VIEW_DOCGEN}
                data-resin-target={SIDEBAR_NAV_TARGETS.DOCGEN}
                data-target-id="SidebarNavButton-docgen"
                data-testid="sidebardocgen"
                onClick={handleSidebarNavButtonClick}
                sidebarView={SIDEBAR_VIEW_DOCGEN}
                tooltip={intl.formatMessage(messages.sidebarDocGenTooltip)}
            >
                <DocGenIcon className="bcs-SidebarNav-icon" />
            </SidebarNavButton>
        ),
    ];

    // Filter out falsy values first
    const visibleTabs = sidebarTabs.filter(Boolean);

    // Insert custom tabs - box-ai goes at the top, others at the end
    if (hasOtherCustomTabs) {
        // Add other custom tabs at the end
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
                    data-resin-target={`sidebar${customTabId}`}
                    data-target-id={`SidebarNavButton-${customTabId}`}
                    data-testid={`sidebar${customTabId}`}
                    isDisabled={customTab.isDisabled}
                    onClick={handleSidebarNavButtonClick}
                    sidebarView={customTabPath}
                    tooltip={customTabTitle ?? customTabId}
                    {...navButtonProps}
                >
                    {CustomTabIcon &&
                        (React.isValidElement(CustomTabIcon)
                            ? React.cloneElement((CustomTabIcon: any), { className: 'bcs-SidebarNav-icon' })
                            : React.createElement((CustomTabIcon: any), { className: 'bcs-SidebarNav-icon' }))}
                </SidebarNavButton>
            );

            visibleTabs.push(customTabButton); // Add at the end
        });
    }

    const navButtons = visibleTabs;

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
