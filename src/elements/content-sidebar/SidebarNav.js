/**
 * @flow
 * @file Preview sidebar nav component
 * @author Box
 */

import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { InjectIntlProvidedProps } from 'react-intl';
import AdditionalTabs from './additional-tabs';
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
    SIDEBAR_VIEW_SKILLS,
    SIDEBAR_VIEW_ACTIVITY,
    SIDEBAR_VIEW_DETAILS,
    SIDEBAR_VIEW_METADATA,
} from '../../constants';
import { useFeatureConfig } from '../common/feature-checking';
import type { NavigateOptions, AdditionalSidebarTab } from './flowTypes';
import './SidebarNav.scss';

type Props = {
    additionalTabs?: Array<AdditionalSidebarTab>,
    elementId: string,
    fileId: string,
    hasActivity: boolean,
    hasAdditionalTabs: boolean,
    hasDetails: boolean,
    hasMetadata: boolean,
    hasSkills: boolean,
    isOpen?: boolean,
    onNavigate?: (SyntheticEvent<>, NavigateOptions) => void,
} & InjectIntlProvidedProps;

const SidebarNav = ({
    additionalTabs,
    elementId,
    fileId,
    hasActivity,
    hasAdditionalTabs,
    hasDetails,
    hasMetadata,
    hasSkills,
    intl,
    isOpen,
    onNavigate,
}: Props) => {
    const {
        enabled: hasBoxSign,
        onClick: onBoxSignClick,
        status: boxSignStatus,
        targetingApi: boxSignTargetingApi,
    } = useFeatureConfig('boxSign');

    return (
        <div className="bcs-SidebarNav" aria-label={intl.formatMessage(messages.sidebarNavLabel)}>
            <div className="bcs-SidebarNav-tabs">
                <SidebarNavTablist elementId={elementId} isOpen={isOpen} onNavigate={onNavigate}>
                    {hasActivity && (
                        <SidebarNavButton
                            data-resin-target={SIDEBAR_NAV_TARGETS.ACTIVITY}
                            data-testid="sidebaractivity"
                            sidebarView={SIDEBAR_VIEW_ACTIVITY}
                            tooltip={intl.formatMessage(messages.sidebarActivityTitle)}
                        >
                            <IconChatRound />
                        </SidebarNavButton>
                    )}
                    {hasDetails && (
                        <SidebarNavButton
                            data-resin-target={SIDEBAR_NAV_TARGETS.DETAILS}
                            data-testid="sidebardetails"
                            sidebarView={SIDEBAR_VIEW_DETAILS}
                            tooltip={intl.formatMessage(messages.sidebarDetailsTitle)}
                        >
                            <IconDocInfo />
                        </SidebarNavButton>
                    )}
                    {hasSkills && (
                        <SidebarNavButton
                            data-resin-target={SIDEBAR_NAV_TARGETS.SKILLS}
                            data-testid="sidebarskills"
                            sidebarView={SIDEBAR_VIEW_SKILLS}
                            tooltip={intl.formatMessage(messages.sidebarSkillsTitle)}
                        >
                            <IconMagicWand />
                        </SidebarNavButton>
                    )}
                    {hasMetadata && (
                        <SidebarNavButton
                            data-resin-target={SIDEBAR_NAV_TARGETS.METADATA}
                            data-testid="sidebarmetadata"
                            sidebarView={SIDEBAR_VIEW_METADATA}
                            tooltip={intl.formatMessage(messages.sidebarMetadataTitle)}
                        >
                            <IconMetadataThick />
                        </SidebarNavButton>
                    )}
                </SidebarNavTablist>

                {hasBoxSign && onBoxSignClick && (
                    <div className="bcs-SidebarNav-secondary">
                        <SidebarNavSign
                            data-resin-target={SIDEBAR_NAV_TARGETS.SIGN}
                            onClick={() => onBoxSignClick({ fileId })}
                            status={boxSignStatus}
                            targetingApi={boxSignTargetingApi}
                        />
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
        </div>
    );
};
export default injectIntl(SidebarNav);
