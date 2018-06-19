/**
 * @flow
 * @file Preview sidebar nav component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import IconMagicWand from 'box-react-ui/lib/icons/general/IconMagicWand';
import IconMetadataThick from 'box-react-ui/lib/icons/general/IconMetadataThick';
import IconDocInfo from 'box-react-ui/lib/icons/general/IconDocInfo';
import IconChatRound from 'box-react-ui/lib/icons/general/IconChatRound';
import SidebarNavButton from './SidebarNavButton';
import messages from '../messages';
import { SIDEBAR_NAV_TARGETS } from '../../interactionTargets';
import {
    SIDEBAR_VIEW_SKILLS,
    SIDEBAR_VIEW_ACTIVITY,
    SIDEBAR_VIEW_DETAILS,
    SIDEBAR_VIEW_METADATA
} from '../../constants';
import './SidebarNav.scss';

type Props = {
    hasSkills: boolean,
    hasMetadata: boolean,
    hasActivityFeed: boolean,
    hasDetails: boolean,
    onToggle: Function,
    selectedView?: SidebarView
};

const SidebarNav = ({ hasSkills, hasMetadata, hasActivityFeed, hasDetails, onToggle, selectedView }: Props) => (
    <nav>
        {hasActivityFeed && (
            <SidebarNavButton
                tooltip={<FormattedMessage {...messages.sidebarActivityTitle} />}
                onClick={() => onToggle(SIDEBAR_VIEW_ACTIVITY)}
                interactionTarget={SIDEBAR_NAV_TARGETS.ACTIVITY}
                isSelected={SIDEBAR_VIEW_ACTIVITY === selectedView}
            >
                <IconChatRound />
            </SidebarNavButton>
        )}
        {hasDetails && (
            <SidebarNavButton
                tooltip={<FormattedMessage {...messages.sidebarDetailsTitle} />}
                onClick={() => onToggle(SIDEBAR_VIEW_DETAILS)}
                interactionTarget={SIDEBAR_NAV_TARGETS.DETAILS}
                isSelected={SIDEBAR_VIEW_DETAILS === selectedView}
            >
                <IconDocInfo />
            </SidebarNavButton>
        )}
        {hasSkills && (
            <SidebarNavButton
                tooltip={<FormattedMessage {...messages.sidebarSkillsTitle} />}
                onClick={() => onToggle(SIDEBAR_VIEW_SKILLS)}
                interactionTarget={SIDEBAR_NAV_TARGETS.SKILLS}
                isSelected={SIDEBAR_VIEW_SKILLS === selectedView}
            >
                <IconMagicWand />
            </SidebarNavButton>
        )}
        {hasMetadata && (
            <SidebarNavButton
                tooltip={<FormattedMessage {...messages.sidebarMetadataTitle} />}
                onClick={() => onToggle(SIDEBAR_VIEW_METADATA)}
                interactionTarget={SIDEBAR_NAV_TARGETS.METADATA}
                isSelected={SIDEBAR_VIEW_METADATA === selectedView}
            >
                <IconMetadataThick />
            </SidebarNavButton>
        )}
    </nav>
);

export default SidebarNav;
