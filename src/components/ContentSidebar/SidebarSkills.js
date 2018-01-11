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

type Props = {
    metadata?: MetadataType,
    getPreviewer: Function
};

function getCard(skill: SkillCard, getPreviewer: Function) {
    const { skill_card_type } = skill;
    switch (skill_card_type) {
        case 'keyword':
            return <Keywords skill={skill} getPreviewer={getPreviewer} />;
        case 'keyvalue':
            return <Keyvalues skill={skill} />;
        case 'timeline':
            return <Timelines skill={skill} getPreviewer={getPreviewer} />;
        case 'transcript':
            return <Transcript skill={skill} getPreviewer={getPreviewer} />;
        default:
            return null;
    }
}

const SidebarSkills = ({ metadata, getPreviewer }: Props) => {
    if (
        !metadata ||
        !metadata.global ||
        !metadata.global.boxSkillsCards ||
        !Array.isArray(metadata.global.boxSkillsCards.cards) ||
        metadata.global.boxSkillsCards.cards.length < 1
    ) {
        return null;
    }

    const { cards }: SkillCards = metadata.global.boxSkillsCards;

    return (
        <div>
            {cards.map(
                (card: SkillCard, index) =>
                    /* eslint-disable react/no-array-index-key */
                    Array.isArray(card.entries) &&
                    card.entries.length > 0 && (
                        <SidebarSection
                            key={index}
                            title={card.title || <FormattedMessage {...messages[`${card.skill_card_type}Skill`]} />}
                        >
                            {getCard(card, getPreviewer)}
                        </SidebarSection>
                    )
                /* eslint-enable react/no-array-index-key */
            )}
        </div>
    );
};

export default SidebarSkills;
