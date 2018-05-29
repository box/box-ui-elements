/**
 * @flow
 * @file Skills sidebar component
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from '../messages';
import SidebarContent from './SidebarContent';
import SidebarSkills from './Skills/SidebarSkills';

type Props = {
    file: BoxItem,
    getPreviewer: Function,
    onSkillChange: Function
};

const SkillsSidebar = ({ file, getPreviewer, onSkillChange }: Props) => (
    <SidebarContent title={<FormattedMessage {...messages.sidebarSkillsTitle} />}>
        <SidebarSkills file={file} getPreviewer={getPreviewer} onSkillChange={onSkillChange} />
    </SidebarContent>
);

export default SkillsSidebar;
