/**
 * @flow
 * @file Skills card component
 * @author Box
 */

import React from 'react';
import Status from './Status';
import Transcript from './Transcript';
import Keywords from './Keywords';
import Faces from './Faces';
import { SKILLS_TRANSCRIPT, SKILLS_KEYWORD, SKILLS_TIMELINE, SKILLS_FACE, SKILLS_STATUS } from '../../../constants';

type Props = {
    getPreviewer: Function,
    onSkillChange: Function,
    card: SkillCard,
    cards: Array<SkillCard>,
    isEditable: boolean
};

const SidebarSkillsCard = ({ card, cards, isEditable, onSkillChange, getPreviewer }: Props) => {
    switch (card.skill_card_type) {
        case SKILLS_KEYWORD:
            return (
                <Keywords
                    card={card}
                    transcript={
                        isEditable
                            ? cards.find(({ skill_card_type }) => skill_card_type === SKILLS_TRANSCRIPT)
                            : undefined
                    }
                    isEditable={isEditable}
                    getPreviewer={getPreviewer}
                    onSkillChange={onSkillChange}
                />
            );
        case SKILLS_TIMELINE:
        case SKILLS_FACE:
            return (
                <Faces card={card} isEditable={isEditable} getPreviewer={getPreviewer} onSkillChange={onSkillChange} />
            );
        case SKILLS_TRANSCRIPT:
            return (
                <Transcript
                    card={card}
                    getPreviewer={getPreviewer}
                    isEditable={isEditable}
                    onSkillChange={onSkillChange}
                />
            );
        case SKILLS_STATUS:
            return <Status card={card} />;
        default:
            return null;
    }
};

export default SidebarSkillsCard;
