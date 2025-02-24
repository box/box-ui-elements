import * as React from 'react';
import { useIntl } from 'react-intl';
import noop from 'lodash/noop';
import { BoxAiLogo } from '@box/blueprint-web-assets/icons/Logo';
import { Size6 } from '@box/blueprint-web-assets/tokens/tokens';
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
import './SidebarNav.scss';

interface Props {
    additionalTabs?: AdditionalSidebarTab[];
    elementId: string;
    fileId: string;
    hasActivity: boolean;
    hasAdditionalTabs: boolean;
    hasBoxAI: boolean;
    hasDetails: boolean;
    hasDocGen?: boolean;
    hasMetadata: boolean;
    hasSkills: boolean;
    isOpen?: boolean;
    onNavigate?: (event: React.SyntheticEvent<HTMLElement>, options: NavigateOptions) => void;
    onPanelChange?: (name: string, isInitialState: boolean) => void;
}

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
    isOpen,
    onNavigate,
    onPanelChange = noop,
}: Props): React.ReactElement => {
    const { formatMessage } = useIntl();
    const { enabled: hasBoxSign } = useFeatureConfig('boxSign');
    const { disabledTooltip: boxAIDisabledTooltip, showOnlyNavButton: showOnlyBoxAINavButton } =
        useFeatureConfig('boxai.sidebar');

    const handleSidebarNavButtonClick = (sidebarview: string): void => {
        onPanelChange(sidebarview, false);
    };

    return (
        <nav className="bcs-SidebarNav" aria-label={formatMessage(messages.sidebarNavLabel)} data-testid="sidebar-nav">
            <div className="bcs-SidebarNav-tabs" data-testid="sidebar-nav-tabs">
                <SidebarNavTablist elementId={elementId} isOpen={isOpen} onNavigate={onNavigate}>
                    {hasBoxAI && (
                        <SidebarNavButton
                            data-resin-target={SIDEBAR_NAV_TARGETS.BOXAI}
                            data-target-id="SidebarNavButton-boxAI"
                            data-testid="sidebarboxai"
                            isDisabled={showOnlyBoxAINavButton}
                            onClick={handleSidebarNavButtonClick}
                            sidebarView={SIDEBAR_VIEW_BOXAI}
                            tooltip={
                                showOnlyBoxAINavButton
                                    ? boxAIDisabledTooltip
                                    : formatMessage(messages.sidebarBoxAITitle)
                            }
                        >
                            <BoxAiLogo height={Size6} width={Size6} />
                        </SidebarNavButton>
                    )}
                    {hasActivity && (
                        <SidebarNavButton
                            data-resin-target={SIDEBAR_NAV_TARGETS.ACTIVITY}
                            data-target-id="SidebarNavButton-activity"
                            data-testid="sidebaractivity"
                            onClick={handleSidebarNavButtonClick}
                            sidebarView={SIDEBAR_VIEW_ACTIVITY}
                            tooltip={formatMessage(messages.sidebarActivityTitle)}
                        >
                            <IconChatRound className="bcs-SidebarNav-icon" />
                        </SidebarNavButton>
                    )}
                    {hasDetails && (
                        <SidebarNavButton
                            data-resin-target={SIDEBAR_NAV_TARGETS.DETAILS}
                            data-target-id="SidebarNavButton-details"
                            data-testid="sidebardetails"
                            onClick={handleSidebarNavButtonClick}
                            sidebarView={SIDEBAR_VIEW_DETAILS}
                            tooltip={formatMessage(messages.sidebarDetailsTitle)}
                        >
                            <IconDocInfo className="bcs-SidebarNav-icon" />
                        </SidebarNavButton>
                    )}
                    {hasSkills && (
                        <SidebarNavButton
                            data-resin-target={SIDEBAR_NAV_TARGETS.SKILLS}
                            data-target-id="SidebarNavButton-skills"
                            data-testid="sidebarskills"
                            onClick={handleSidebarNavButtonClick}
                            sidebarView={SIDEBAR_VIEW_SKILLS}
                            tooltip={formatMessage(messages.sidebarSkillsTitle)}
                        >
                            <IconMagicWand className="bcs-SidebarNav-icon" />
                        </SidebarNavButton>
                    )}
                    {hasMetadata && (
                        <SidebarNavButton
                            data-resin-target={SIDEBAR_NAV_TARGETS.METADATA}
                            data-target-id="SidebarNavButton-metadata"
                            data-testid="sidebarmetadata"
                            onClick={handleSidebarNavButtonClick}
                            sidebarView={SIDEBAR_VIEW_METADATA}
                            tooltip={formatMessage(messages.sidebarMetadataTitle)}
                        >
                            <IconMetadataThick className="bcs-SidebarNav-icon" />
                        </SidebarNavButton>
                    )}
                    {hasDocGen && (
                        <SidebarNavButton
                            data-resin-target={SIDEBAR_NAV_TARGETS.DOCGEN}
                            data-target-id="SidebarNavButton-docGen"
                            onClick={handleSidebarNavButtonClick}
                            sidebarView={SIDEBAR_VIEW_DOCGEN}
                            tooltip={formatMessage(messages.sidebarDocGenTooltip)}
                        >
                            <DocGenIcon className="bcs-SidebarNav-icon" />
                        </SidebarNavButton>
                    )}
                </SidebarNavTablist>

                {hasBoxSign && (
                    <div className="bcs-SidebarNav-secondary">
                        <SidebarNavSign />
                    </div>
                )}

                {hasAdditionalTabs && (
                    <div className="bcs-SidebarNav-overflow">
                        <AdditionalTabs key={fileId} tabs={additionalTabs} />
                    </div>
                )}
            </div>
            <div className="bcs-SidebarNav-footer">
                <SidebarToggle isOpen={isOpen} />
            </div>
        </nav>
    );
};

export default SidebarNav;
