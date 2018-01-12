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
import type { SkillCard, MetadataType } from '../../flowTypes';

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
    if (!metadata || !metadata.global) {
        return null;
    }

    let cards = [];

    if (metadata.global.boxSkillsCards && Array.isArray(metadata.global.boxSkillsCards.cards)) {
        cards = cards.concat(metadata.global.boxSkillsCards.cards);
    }

    // Hack
    try {
        // $FlowFixMe
        const keywords = metadata.global['box-skills-keywords-demo'];
        const keyvalues = JSON.parse(keywords.keywords)
            .filter(({ skills_data_type }) => skills_data_type === 'keyvalue')
            .map((keyvalue) => {
                keyvalue.skill_card_type = 'keyvalue';
                keyvalue.type = 'skill_card';
                return keyvalue;
            });
        if (Array.isArray(keyvalues) && keyvalues.length > 0) {
            cards = cards.concat(keyvalues);
        }
    } catch (e) {
        // ignore
    }
    // Hack end

    if (cards.length === 0) {
        return null;
    }

    return cards.map(
        (card: SkillCard, index) =>
            !!card &&
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
    );
};

export default SidebarSkills;
