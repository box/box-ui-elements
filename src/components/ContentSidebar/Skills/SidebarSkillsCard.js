/**
 * @flow
 * @file Skills card component
 * @author Box
 */

import React from 'react';
import withErrorHandling from '../withErrorHandling';
import Transcript from './Transcript';
import Keywords from './Keywords';
import Keyvalues from './Keyvalues';
import Faces from './Faces';
import { SKILL_TRANSCRIPT, SKILL_KEYWORD, SKILL_TIMELINE, SKILL_KEYVALUE } from '../../../constants';
import type { SkillCard } from '../../../flowTypes';

type Props = {
    getPreviewer: Function,
    rootElement: HTMLElement,
    appElement: HTMLElement,
    onSkillChange: Function,
    card: SkillCard,
    cards: Array<SkillCard>,
    isEditable: boolean,
    errorCode: ?string
};

const SidebarSkillsCard = ({
    card,
    cards,
    isEditable,
    onSkillChange,
    getPreviewer,
    rootElement,
    appElement
}: Props) => {
    switch (card.skill_card_type) {
        case SKILL_KEYWORD:
            return (
                <Keywords
                    card={card}
                    transcript={
                        isEditable
                            ? cards.find(({ skill_card_type }) => skill_card_type === SKILL_TRANSCRIPT)
                            : undefined
                    }
                    isEditable={isEditable}
                    getPreviewer={getPreviewer}
                    onSkillChange={onSkillChange}
                />
            );
        case SKILL_KEYVALUE:
            return <Keyvalues card={card} />;
        case SKILL_TIMELINE:
            return (
                <Faces card={card} isEditable={isEditable} getPreviewer={getPreviewer} onSkillChange={onSkillChange} />
            );
        case SKILL_TRANSCRIPT:
            return (
                <Transcript
                    card={card}
                    getPreviewer={getPreviewer}
                    rootElement={rootElement}
                    appElement={appElement}
                    isEditable={isEditable}
                    onSkillChange={onSkillChange}
                />
            );
        default:
            return null;
    }
};

export { SidebarSkillsCard as SidebarSkillsCardComponent };
export default withErrorHandling(SidebarSkillsCard);
