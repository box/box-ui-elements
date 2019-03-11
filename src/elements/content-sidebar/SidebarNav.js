/**
 * @flow
 * @file Preview sidebar nav component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import IconMagicWand from '../../icons/general/IconMagicWand';
import IconMetadataThick from '../../icons/general/IconMetadataThick';
import IconDocInfo from '../../icons/general/IconDocInfo';
import IconChatRound from '../../icons/general/IconChatRound';
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
    hasActivityFeed: boolean,
    hasAdditionalTabs: boolean,
    hasDetails: boolean,
    hasMetadata: boolean,
    hasSkills: boolean,
    onNavigate?: (SyntheticEvent<>, NavigateOptions) => void,
};

const SidebarNav = ({
    fileId,
    hasSkills,
    hasMetadata,
    hasActivityFeed,
    hasDetails,
    hasAdditionalTabs,
    additionalTabs,
    onNavigate,
}: Props) => (
    <nav>
        {hasActivityFeed && (
            <SidebarNavButton
                interactionTarget={SIDEBAR_NAV_TARGETS.ACTIVITY}
                sidebarView={SIDEBAR_VIEW_ACTIVITY}
                onNavigate={onNavigate}
                tooltip={<FormattedMessage {...messages.sidebarActivityTitle} />}
            >
                <IconChatRound />
            </SidebarNavButton>
        )}
        {hasDetails && (
            <SidebarNavButton
                interactionTarget={SIDEBAR_NAV_TARGETS.DETAILS}
                sidebarView={SIDEBAR_VIEW_DETAILS}
                onNavigate={onNavigate}
                tooltip={<FormattedMessage {...messages.sidebarDetailsTitle} />}
            >
                <IconDocInfo />
            </SidebarNavButton>
        )}
        {hasSkills && (
            <SidebarNavButton
                interactionTarget={SIDEBAR_NAV_TARGETS.SKILLS}
                sidebarView={SIDEBAR_VIEW_SKILLS}
                onNavigate={onNavigate}
                tooltip={<FormattedMessage {...messages.sidebarSkillsTitle} />}
            >
                <IconMagicWand />
            </SidebarNavButton>
        )}
        {hasMetadata && (
            <SidebarNavButton
                interactionTarget={SIDEBAR_NAV_TARGETS.METADATA}
                sidebarView={SIDEBAR_VIEW_METADATA}
                onNavigate={onNavigate}
                tooltip={<FormattedMessage {...messages.sidebarMetadataTitle} />}
            >
                <IconMetadataThick />
            </SidebarNavButton>
        )}
        {hasAdditionalTabs && <AdditionalTabs key={fileId} tabs={additionalTabs} />}
    </nav>
);

export default SidebarNav;
