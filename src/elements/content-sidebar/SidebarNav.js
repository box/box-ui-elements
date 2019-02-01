/**
 * @flow
 * @file Preview sidebar nav component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import IconMagicWand from 'icons/general/IconMagicWand';
import IconMetadataThick from 'icons/general/IconMetadataThick';
import IconDocInfo from 'icons/general/IconDocInfo';
import IconChatRound from 'icons/general/IconChatRound';
import messages from 'elements/common/messages';
import { SIDEBAR_NAV_TARGETS } from 'elements/common/interactionTargets';
import SidebarNavButton from './SidebarNavButton';
import {
    SIDEBAR_VIEW_SKILLS,
    SIDEBAR_VIEW_ACTIVITY,
    SIDEBAR_VIEW_DETAILS,
    SIDEBAR_VIEW_METADATA,
} from '../../constants';
import './SidebarNav.scss';

type Props = {
    hasActivityFeed: boolean,
    hasDetails: boolean,
    hasMetadata: boolean,
    hasSkills: boolean,
    onToggle: Function,
    selectedView?: SidebarView,
};

const SidebarNav = ({ hasSkills, hasMetadata, hasActivityFeed, hasDetails, onToggle, selectedView }: Props) => (
    <nav>
        {hasActivityFeed && (
            <SidebarNavButton
                interactionTarget={SIDEBAR_NAV_TARGETS.ACTIVITY}
                isSelected={SIDEBAR_VIEW_ACTIVITY === selectedView}
                onClick={() => onToggle(SIDEBAR_VIEW_ACTIVITY)}
                tooltip={<FormattedMessage {...messages.sidebarActivityTitle} />}
            >
                <IconChatRound />
            </SidebarNavButton>
        )}
        {hasDetails && (
            <SidebarNavButton
                interactionTarget={SIDEBAR_NAV_TARGETS.DETAILS}
                isSelected={SIDEBAR_VIEW_DETAILS === selectedView}
                onClick={() => onToggle(SIDEBAR_VIEW_DETAILS)}
                tooltip={<FormattedMessage {...messages.sidebarDetailsTitle} />}
            >
                <IconDocInfo />
            </SidebarNavButton>
        )}
        {hasSkills && (
            <SidebarNavButton
                interactionTarget={SIDEBAR_NAV_TARGETS.SKILLS}
                isSelected={SIDEBAR_VIEW_SKILLS === selectedView}
                onClick={() => onToggle(SIDEBAR_VIEW_SKILLS)}
                tooltip={<FormattedMessage {...messages.sidebarSkillsTitle} />}
            >
                <IconMagicWand />
            </SidebarNavButton>
        )}
        {hasMetadata && (
            <SidebarNavButton
                interactionTarget={SIDEBAR_NAV_TARGETS.METADATA}
                isSelected={SIDEBAR_VIEW_METADATA === selectedView}
                onClick={() => onToggle(SIDEBAR_VIEW_METADATA)}
                tooltip={<FormattedMessage {...messages.sidebarMetadataTitle} />}
            >
                <IconMetadataThick />
            </SidebarNavButton>
        )}
    </nav>
);

export default SidebarNav;
