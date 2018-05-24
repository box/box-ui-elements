/**
 * @flow
 * @file Details sidebar component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import getProp from 'lodash/get';
import uniqueId from 'lodash/uniqueId';
import messages from '../../messages';
import SidebarSection from '../SidebarSection';
import { isValidSkillsCard } from './skillUtils';
import SidebarSkillsCard from './SidebarSkillsCard';
import { SKILLS_TARGETS } from '../../../interactionTargets';
import { SKILL_TRANSCRIPT, SKILL_KEYWORD, SKILL_TIMELINE, SKILL_FACE } from '../../../constants';

type Props = {
    file: BoxItem,
    getPreviewer: Function,
    rootElement: HTMLElement,
    appElement: HTMLElement,
    onSkillChange: Function
};

/**
 * Get ths skill interaction target based on card type
 *
 * @param {Object} card - skill card
 * @return {string} - interaction target
 */
const getCardInteractionTarget = ({ skill_card_type }: SkillCard): string => {
    switch (skill_card_type) {
        case SKILL_KEYWORD:
            return SKILLS_TARGETS.KEYWORDS.CARD;
        case SKILL_FACE:
        case SKILL_TIMELINE:
            return SKILLS_TARGETS.FACES.CARD;
        case SKILL_TRANSCRIPT:
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
const getCardTitle = ({ skill_card_type, skill_card_title = {} }: SkillCard): React.Node => {
    const { code, message }: SkillCardLocalizableType = skill_card_title;
    const defaultKey = `${skill_card_type}Skill`;
    const defaultMessage = messages[defaultKey] || messages.defaultSkill;

    switch (code) {
        case 'skill_faces':
            return <FormattedMessage {...messages.faceSkill} />;
        case 'skill_transcript':
            return <FormattedMessage {...messages.transcriptSkill} />;
        case 'skill_topics':
            return <FormattedMessage {...messages.keywordSkill} />;
        default:
            return message || <FormattedMessage {...defaultMessage} />;
    }
};

const SidebarSkills = ({ file, getPreviewer, rootElement, appElement, onSkillChange }: Props): Array<React.Node> => {
    const { cards }: SkillCards = getProp(file, 'metadata.global.boxSkillsCards', []);
    const { permissions = {} }: BoxItem = file;
    const isSkillEditable = !!permissions.can_upload;

    return cards.map((card: SkillCard, index: number) => {
        const { id, error } = card;
        const cardId = id || uniqueId('card_');
        const isValid = isValidSkillsCard(card);
        const interactionTarget = getCardInteractionTarget(card);
        const title = getCardTitle(card);

        return isValid ? (
            <SidebarSection key={cardId} interactionTarget={interactionTarget} title={title}>
                <SidebarSkillsCard
                    errorCode={error}
                    card={card}
                    cards={cards}
                    isEditable={isSkillEditable}
                    getPreviewer={getPreviewer}
                    rootElement={rootElement}
                    appElement={appElement}
                    onSkillChange={(...args) => onSkillChange(index, ...args)}
                />
            </SidebarSection>
        ) : null;
    });
};

export default SidebarSkills;
