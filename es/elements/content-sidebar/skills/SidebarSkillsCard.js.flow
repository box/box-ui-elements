/**
 * @flow
 * @file Skills card component
 * @author Box
 */

import * as React from 'react';
import Status from './status';
import Transcript from './transcript';
import Keywords from './keywords';
import Faces from './faces';
import { SKILLS_TRANSCRIPT, SKILLS_KEYWORD, SKILLS_TIMELINE, SKILLS_FACE, SKILLS_STATUS } from '../../../constants';
import type { SkillCard } from '../../../common/types/skills';

type Props = {
    card: SkillCard,
    cards: Array<SkillCard>,
    getViewer: Function,
    hasError: boolean,
    isEditable: boolean,
    onSkillChange: Function,
};

const SidebarSkillsCard = ({ card, cards, hasError, isEditable, onSkillChange, getViewer }: Props) => {
    switch (card.skill_card_type) {
        case SKILLS_KEYWORD:
            return (
                <Keywords
                    card={card}
                    getViewer={getViewer}
                    hasError={hasError}
                    isEditable={isEditable}
                    onSkillChange={onSkillChange}
                    transcript={
                        isEditable
                            ? cards.find(({ skill_card_type }) => skill_card_type === SKILLS_TRANSCRIPT)
                            : undefined
                    }
                />
            );
        case SKILLS_TIMELINE:
        case SKILLS_FACE:
            return (
                <Faces
                    card={card}
                    getViewer={getViewer}
                    hasError={hasError}
                    isEditable={isEditable}
                    onSkillChange={onSkillChange}
                />
            );
        case SKILLS_TRANSCRIPT:
            return (
                <Transcript
                    card={card}
                    getViewer={getViewer}
                    hasError={hasError}
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
