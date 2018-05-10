/**
 * @flow
 * @file Details sidebar component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import uniqueId from 'lodash/uniqueId';
import messages from '../../messages';
import SidebarSection from '../SidebarSection';
import { isValidSkillsCard } from './skillUtils';
import SidebarSkillsCard from './SidebarSkillsCard';
import { SKILLS_TARGETS } from '../../../interactionTargets';
import { SKILL_TRANSCRIPT, SKILL_KEYWORD, SKILL_TIMELINE } from '../../../constants';
import type { SkillCards, SkillCard, BoxItem } from '../../../flowTypes';

type Props = {
    file: BoxItem,
    getPreviewer: Function,
    rootElement: HTMLElement,
    appElement: HTMLElement,
    onSkillChange: Function
};

const getCardInteractionTarget = ({ skill_card_type }: SkillCard): string => {
    switch (skill_card_type) {
        case SKILL_KEYWORD:
            return SKILLS_TARGETS.KEYWORDS.CARD;
        // case SKILL_KEYVALUE:
        //     return SKILLS_TARGETS.KEYWORDS.CARD;
        case SKILL_TIMELINE:
            return SKILLS_TARGETS.FACES.CARD;
        case SKILL_TRANSCRIPT:
            return SKILLS_TARGETS.TRANSCRIPTS.CARD;
        default:
            return '';
    }
};

const SidebarSkills = ({ file, getPreviewer, rootElement, appElement, onSkillChange }: Props) => {
    // $FlowFixMe
    const { cards }: SkillCards = file.metadata.global.boxSkillsCards;
    const { permissions = {} }: BoxItem = file;
    const isSkillEditable = !!permissions.can_upload;

    return cards.map(
        (card: SkillCard, index: number) =>
            isValidSkillsCard(card) && (
                <SidebarSection
                    key={card.id || uniqueId('card_')}
                    interactionTarget={getCardInteractionTarget(card)}
                    title={card.title || <FormattedMessage {...messages[`${card.skill_card_type}Skill`]} />}
                >
                    <SidebarSkillsCard
                        errorCode={card.error}
                        card={card}
                        cards={cards}
                        isEditable={isSkillEditable}
                        getPreviewer={getPreviewer}
                        rootElement={rootElement}
                        appElement={appElement}
                        onSkillChange={(...args) => onSkillChange(index, ...args)}
                    />
                </SidebarSection>
            )
    );
};

export default SidebarSkills;
