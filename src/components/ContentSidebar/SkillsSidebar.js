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
import type { BoxItem } from '../../flowTypes';

type Props = {
    file: BoxItem,
    getPreviewer: Function,
    rootElement: HTMLElement,
    appElement: HTMLElement,
    onSkillChange: Function
};

const SkillsSidebar = ({ file, getPreviewer, rootElement, appElement, onSkillChange }: Props) => (
    <SidebarContent title={<FormattedMessage {...messages.sidebarSkillsTitle} />}>
        <SidebarSkills
            file={file}
            getPreviewer={getPreviewer}
            rootElement={rootElement}
            appElement={appElement}
            onSkillChange={onSkillChange}
        />
    </SidebarContent>
);

export default SkillsSidebar;
