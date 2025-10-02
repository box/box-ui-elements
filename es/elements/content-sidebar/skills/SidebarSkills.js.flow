/**
 * @flow
 * @file Details sidebar component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import uniqueId from 'lodash/uniqueId';
import messages from '../../common/messages';
import { SKILLS_TARGETS } from '../../common/interactionTargets';
import SidebarSection from '../SidebarSection';
import { isValidSkillsCard } from './skillUtils';
import SidebarSkillsCard from './SidebarSkillsCard';
import {
    SKILLS_TRANSCRIPT,
    SKILLS_KEYWORD,
    SKILLS_TIMELINE,
    SKILLS_FACE,
    SKILLS_STATUS,
    SKILLS_ERROR_UNKNOWN,
} from '../../../constants';
import type { SkillCard, SkillCardLocalizableType } from '../../../common/types/skills';
import type { NumberBooleanMap, BoxItem } from '../../../common/types/core';

type Props = {
    cards: Array<SkillCard>,
    errors: NumberBooleanMap,
    file: BoxItem,
    getViewer: Function,
    onSkillChange: Function,
};

/**
 * Get ths skill interaction target based on card type
 *
 * @param {Object} card - skill card
 * @return {string} - interaction target
 */
const getCardInteractionTarget = ({ skill_card_type }: SkillCard): string => {
    switch (skill_card_type) {
        case SKILLS_KEYWORD:
            return SKILLS_TARGETS.KEYWORDS.CARD;
        case SKILLS_FACE:
        case SKILLS_TIMELINE:
            return SKILLS_TARGETS.FACES.CARD;
        case SKILLS_TRANSCRIPT:
            return SKILLS_TARGETS.TRANSCRIPTS.CARD;
        default:
            return '';
    }
};

/**
 * Get ths string skill title based on card title
 *
 * @param {Object} card - skill card
 * @return {string} - skill title
 */
const getCardTitle = ({ skill_card_type, skill_card_title = {} }: SkillCard): string | React.Node => {
    const { code, message }: SkillCardLocalizableType = skill_card_title;
    const defaultKey = `${skill_card_type}Skill`;
    const defaultMessage = messages[defaultKey] || messages.defaultSkill;

    switch (code) {
        case 'skills_faces':
            return <FormattedMessage {...messages.faceSkill} />;
        case 'skills_transcript':
            return <FormattedMessage {...messages.transcriptSkill} />;
        case 'skills_topics':
            return <FormattedMessage {...messages.topicsSkill} />;
        case 'skills_status':
            return <FormattedMessage {...messages.statusSkill} />;
        case 'skills_error':
            return <FormattedMessage {...messages.error} />;
        default:
            return message || <FormattedMessage {...defaultMessage} />;
    }
};

const SidebarSkills = ({ file, cards, errors, getViewer, onSkillChange }: Props): Array<React.Node> => {
    const { permissions = {} }: BoxItem = file;
    const isSkillEditable = !!permissions.can_upload;

    return cards.map((card: SkillCard, index: number) => {
        if (card.error && !card.status) {
            card.skill_card_type = SKILLS_STATUS;
            card.status = {
                code: SKILLS_ERROR_UNKNOWN,
            };
            delete card.error;
        }

        const { id } = card;
        const cardId = id || uniqueId('card_');
        const isValid = isValidSkillsCard(file, card);
        const interactionTarget = getCardInteractionTarget(card);
        const title = getCardTitle(card);
        const hasEntries = Array.isArray(card.entries) ? card.entries.length > 0 : isValid;

        return isValid ? (
            <SidebarSection key={cardId} interactionTarget={interactionTarget} isOpen={hasEntries} title={title}>
                <SidebarSkillsCard
                    card={card}
                    cards={cards}
                    getViewer={getViewer}
                    hasError={!!errors[index]}
                    isEditable={isSkillEditable}
                    onSkillChange={(...args) => onSkillChange(index, ...args)}
                />
            </SidebarSection>
        ) : null;
    });
};

export default SidebarSkills;
