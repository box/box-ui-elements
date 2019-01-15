/**
 * @flow
 * @file Skills card component
 * @author Box
 */

import React from 'react';
import Status from './status';
import Transcript from './transcript';
import Keywords from './keywords';
import Faces from './faces';
import { SKILLS_TRANSCRIPT, SKILLS_KEYWORD, SKILLS_TIMELINE, SKILLS_FACE, SKILLS_STATUS } from '../../../constants';

type Props = {
    getViewer: Function,
    onSkillChange: Function,
    card: SkillCard,
    hasError: boolean,
    cards: Array<SkillCard>,
    isEditable: boolean,
};

const SidebarSkillsCard = ({ card, cards, hasError, isEditable, onSkillChange, getViewer }: Props) => {
    switch (card.skill_card_type) {
        case SKILLS_KEYWORD:
            return (
                <Keywords
                    card={card}
                    hasError={hasError}
                    transcript={
                        isEditable
                            ? cards.find(({ skill_card_type }) => skill_card_type === SKILLS_TRANSCRIPT)
                            : undefined
                    }
                    isEditable={isEditable}
                    getViewer={getViewer}
                    onSkillChange={onSkillChange}
                />
            );
        case SKILLS_TIMELINE:
        case SKILLS_FACE:
            return (
                <Faces
                    card={card}
                    hasError={hasError}
                    isEditable={isEditable}
                    getViewer={getViewer}
                    onSkillChange={onSkillChange}
                />
            );
        case SKILLS_TRANSCRIPT:
            return (
                <Transcript
                    card={card}
                    hasError={hasError}
                    getViewer={getViewer}
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
