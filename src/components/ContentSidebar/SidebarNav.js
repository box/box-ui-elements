/**
 * @flow
 * @file Preview sidebar nav component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import SidebarNavButton from './SidebarNavButton';
import messages from '../messages';
import { SIDEBAR_NAV_TARGETS } from '../../interactionTargets';
import {
    SIDEBAR_VIEW_SKILLS,
    SIDEBAR_VIEW_ACTIVITY,
    SIDEBAR_VIEW_DETAILS,
    SIDEBAR_VIEW_METADATA
} from '../../constants';
import type { SidebarView } from '../../flowTypes';
import './SidebarNav.scss';

type Props = {
    hasSkills: boolean,
    hasMetadata: boolean,
    hasActivity: boolean,
    hasDetails: boolean,
    onToggle: Function,
    selectedView?: SidebarView
};

const SidebarNav = ({ hasSkills, hasMetadata, hasActivity, hasDetails, onToggle, selectedView }: Props) => {
    const getNavButtonClassName = (view: SidebarView): string =>
        classNames('bcs-nav-btn', {
            'bcs-nav-btn-is-selected': view === selectedView
        });
    return (
        <nav>
            {hasSkills && (
                <SidebarNavButton
                    tooltip={<FormattedMessage {...messages.sidebarSkillsTitle} />}
                    className={getNavButtonClassName(SIDEBAR_VIEW_SKILLS)}
                    onClick={() => onToggle(SIDEBAR_VIEW_SKILLS)}
                    interactionTarget={SIDEBAR_NAV_TARGETS.SKILLS}
                >
                    skills
                </SidebarNavButton>
            )}
            {hasActivity && (
                <SidebarNavButton
                    tooltip={<FormattedMessage {...messages.sidebarActivityTitle} />}
                    className={getNavButtonClassName(SIDEBAR_VIEW_ACTIVITY)}
                    onClick={() => onToggle(SIDEBAR_VIEW_ACTIVITY)}
                    interactionTarget={SIDEBAR_NAV_TARGETS.ACTIVITY}
                >
                    activity
                </SidebarNavButton>
            )}
            {hasMetadata && (
                <SidebarNavButton
                    tooltip={<FormattedMessage {...messages.sidebarMetadataTitle} />}
                    className={getNavButtonClassName(SIDEBAR_VIEW_METADATA)}
                    onClick={() => onToggle(SIDEBAR_VIEW_METADATA)}
                    interactionTarget={SIDEBAR_NAV_TARGETS.METADATA}
                >
                    metadata
                </SidebarNavButton>
            )}
            {hasDetails && (
                <SidebarNavButton
                    tooltip={<FormattedMessage {...messages.sidebarDetailsTitle} />}
                    className={getNavButtonClassName(SIDEBAR_VIEW_DETAILS)}
                    onClick={() => onToggle(SIDEBAR_VIEW_DETAILS)}
                    interactionTarget={SIDEBAR_NAV_TARGETS.DETAILS}
                >
                    details
                </SidebarNavButton>
            )}
        </nav>
    );
};

export default SidebarNav;
