/**
 * @flow
 * @file Preview sidebar nav component
 * @author Box
 */

import * as React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { InjectIntlProvidedProps } from 'react-intl';
import IconMagicWand from '../../icons/general/IconMagicWand';
import IconMetadataThick from '../../icons/general/IconMetadataThick';
import IconDocInfo from '../../icons/general/IconDocInfo';
import IconChatRound from '../../icons/general/IconChatRound';
import messages from '../common/messages';
import { SIDEBAR_NAV_TARGETS } from '../common/interactionTargets';
import SidebarNavButton from './SidebarNavButton';
import SidebarToggle from './SidebarToggle';
import AdditionalTabs from './additional-tabs';
import SidebarNavTablist from './SidebarNavTablist';
import {
    SIDEBAR_VIEW_SKILLS,
    SIDEBAR_VIEW_ACTIVITY,
    SIDEBAR_VIEW_DETAILS,
    SIDEBAR_VIEW_METADATA,
} from '../../constants';
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
}: Props) => (
    <div className="bcs-SidebarNav" aria-label={intl.formatMessage(messages.sidebarNavLabel)}>
        <div className="bcs-SidebarNav-tabs">
            <SidebarNavTablist elementId={elementId} isOpen={isOpen} onNavigate={onNavigate}>
                {hasActivity && (
                    <SidebarNavButton
                        data-resin-target={SIDEBAR_NAV_TARGETS.ACTIVITY}
                        data-testid="sidebaractivity"
                        sidebarView={SIDEBAR_VIEW_ACTIVITY}
                        tooltip={<FormattedMessage {...messages.sidebarActivityTitle} />}
                    >
                        <IconChatRound />
                    </SidebarNavButton>
                )}
                {hasDetails && (
                    <SidebarNavButton
                        data-resin-target={SIDEBAR_NAV_TARGETS.DETAILS}
                        data-testid="sidebardetails"
                        sidebarView={SIDEBAR_VIEW_DETAILS}
                        tooltip={<FormattedMessage {...messages.sidebarDetailsTitle} />}
                    >
                        <IconDocInfo />
                    </SidebarNavButton>
                )}
                {hasSkills && (
                    <SidebarNavButton
                        data-resin-target={SIDEBAR_NAV_TARGETS.SKILLS}
                        data-testid="sidebarskills"
                        sidebarView={SIDEBAR_VIEW_SKILLS}
                        tooltip={<FormattedMessage {...messages.sidebarSkillsTitle} />}
                    >
                        <IconMagicWand />
                    </SidebarNavButton>
                )}
                {hasMetadata && (
                    <SidebarNavButton
                        data-resin-target={SIDEBAR_NAV_TARGETS.METADATA}
                        data-testid="sidebarmetadata"
                        sidebarView={SIDEBAR_VIEW_METADATA}
                        tooltip={<FormattedMessage {...messages.sidebarMetadataTitle} />}
                    >
                        <IconMetadataThick />
                    </SidebarNavButton>
                )}
            </SidebarNavTablist>

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

export default injectIntl(SidebarNav);
