/**
 * @flow
 * @file Skills card sidebar component
 * @author Box
 */

import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import withErrorHandling from '../withErrorHandling';
import Transcript from './Transcript';
import Keywords from './Keywords';
import Keyvalues from './Keyvalues';
import Timelines from './Timeline';
import type { SkillCard } from '../../../flowTypes';

type Props = {
    getPreviewer: Function,
    rootElement: HTMLElement,
    appElement: HTMLElement,
    onInteraction: Function,
    skill: SkillCard
};

const SidebarSkillsCard = ({ skill, onInteraction, getPreviewer, rootElement, appElement }: Props) => {
    const onSkillInteraction = (data: any) => {
        onInteraction({
            skill: cloneDeep(skill),
            interaction: cloneDeep(data)
        });
    };

    const { skill_card_type } = skill;

    switch (skill_card_type) {
        case 'keyword':
            return <Keywords skill={skill} getPreviewer={getPreviewer} onInteraction={onSkillInteraction} />;
        case 'keyvalue':
            return <Keyvalues skill={skill} />;
        case 'timeline':
            return <Timelines skill={skill} getPreviewer={getPreviewer} onInteraction={onSkillInteraction} />;
        case 'transcript':
            return (
                <Transcript
                    skill={skill}
                    getPreviewer={getPreviewer}
                    rootElement={rootElement}
                    appElement={appElement}
                    onInteraction={onSkillInteraction}
                />
            );
        default:
            return null;
    }
};

export { SidebarSkillsCard as SidebarSkillsCardComponent };
export default withErrorHandling(SidebarSkillsCard);
