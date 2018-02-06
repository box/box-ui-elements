/**
 * @flow
 * @file Details sidebar component
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from '../messages';
import SidebarSection from './SidebarSection';
import Keywords from '../Keywords';
import Transcript from '../Transcript';
import Timelines from '../Timeline';
import Keyvalues from '../Keyvalues';
import type { SkillCards, SkillCard, MetadataType } from '../../flowTypes';
import './SidebarSkills.scss';

type Props = {
    metadata?: MetadataType,
    getPreviewer: Function,
    rootElement: HTMLElement,
    appElement: HTMLElement
};

function getCard(skill: SkillCard, getPreviewer: Function, rootElement: HTMLElement, appElement: HTMLElement) {
    const { skill_card_type, error } = skill;

    if (error) {
        return (
            <span className='be-skills-error'>
                <FormattedMessage {...messages.skillUnknownError} />
            </span>
        );
    }

    switch (skill_card_type) {
        case 'keyword':
            return <Keywords skill={skill} getPreviewer={getPreviewer} />;
        case 'keyvalue':
            return <Keyvalues skill={skill} />;
        case 'timeline':
            return <Timelines skill={skill} getPreviewer={getPreviewer} />;
        case 'transcript':
            return (
                <Transcript
                    skill={skill}
                    getPreviewer={getPreviewer}
                    rootElement={rootElement}
                    appElement={appElement}
                />
            );
        default:
            return null;
    }
}

const SidebarSkills = ({ metadata, getPreviewer, rootElement, appElement }: Props) => {
    // $FlowFixMe
    const { cards }: SkillCards = metadata.global.boxSkillsCards;

    return cards.map((card: SkillCard, index) => (
        /* eslint-disable react/no-array-index-key */
        <SidebarSection
            key={index}
            title={card.title || <FormattedMessage {...messages[`${card.skill_card_type}Skill`]} />}
        >
            {getCard(card, getPreviewer, rootElement, appElement)}
        </SidebarSection>
        /* eslint-enable react/no-array-index-key */
    ));
};

export default SidebarSkills;
