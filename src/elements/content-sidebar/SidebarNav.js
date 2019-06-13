/**
 * @flow
 * @file Preview sidebar nav component
 * @author Box
 */

import * as React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import IconMagicWand from '../../icons/general/IconMagicWand';
import IconMetadataThick from '../../icons/general/IconMetadataThick';
import IconDocInfo from '../../icons/general/IconDocInfo';
import IconChatRound from '../../icons/general/IconChatRound';
import SidebarToggleButton from '../../components/sidebar-toggle-button';
import messages from '../common/messages';
import { SIDEBAR_NAV_TARGETS } from '../common/interactionTargets';
import SidebarNavButton from './SidebarNavButton';
import AdditionalTabs from './additional-tabs';
import {
    SIDEBAR_VIEW_SKILLS,
    SIDEBAR_VIEW_ACTIVITY,
    SIDEBAR_VIEW_DETAILS,
    SIDEBAR_VIEW_METADATA,
} from '../../constants';
import './SidebarNav.scss';

type Props = {
    additionalTabs?: Array<AdditionalSidebarTab>,
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
    <div className="bcs-SidebarNav" aria-label={intl.formatMessage(messages.sidebarNavLabel)} role="tablist">
        <div className="bcs-SidebarNav-tabs">
            {hasActivity && (
                <SidebarNavButton
                    data-resin-target={SIDEBAR_NAV_TARGETS.ACTIVITY}
                    data-testid="sidebaractivity"
                    isOpen={isOpen}
                    sidebarView={SIDEBAR_VIEW_ACTIVITY}
                    onNavigate={onNavigate}
                    tooltip={<FormattedMessage {...messages.sidebarActivityTitle} />}
                >
                    <IconChatRound />
                </SidebarNavButton>
            )}
            {hasDetails && (
                <SidebarNavButton
                    data-resin-target={SIDEBAR_NAV_TARGETS.DETAILS}
                    data-testid="sidebardetails"
                    isOpen={isOpen}
                    sidebarView={SIDEBAR_VIEW_DETAILS}
                    onNavigate={onNavigate}
                    tooltip={<FormattedMessage {...messages.sidebarDetailsTitle} />}
                >
                    <IconDocInfo />
                </SidebarNavButton>
            )}
            {hasSkills && (
                <SidebarNavButton
                    data-resin-target={SIDEBAR_NAV_TARGETS.SKILLS}
                    data-testid="sidebarskills"
                    isOpen={isOpen}
                    sidebarView={SIDEBAR_VIEW_SKILLS}
                    onNavigate={onNavigate}
                    tooltip={<FormattedMessage {...messages.sidebarSkillsTitle} />}
                >
                    <IconMagicWand />
                </SidebarNavButton>
            )}
            {hasMetadata && (
                <SidebarNavButton
                    data-resin-target={SIDEBAR_NAV_TARGETS.METADATA}
                    data-testid="sidebarmetadata"
                    isOpen={isOpen}
                    sidebarView={SIDEBAR_VIEW_METADATA}
                    onNavigate={onNavigate}
                    tooltip={<FormattedMessage {...messages.sidebarMetadataTitle} />}
                >
                    <IconMetadataThick />
                </SidebarNavButton>
            )}
            {hasAdditionalTabs && <AdditionalTabs key={fileId} tabs={additionalTabs} />}
        </div>
        <div className="bcs-SidebarNav-footer">
            <SidebarToggleButton
                data-resin-target={SIDEBAR_NAV_TARGETS.TOGGLE}
                data-testid="sidebartoggle"
                isOpen={isOpen}
                onClick={event => {
                    if (onNavigate) {
                        onNavigate(event, { isToggle: true });
                    }
                }}
            />
        </div>
    </div>
);

export default injectIntl(SidebarNav);
