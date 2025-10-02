/**
 * 
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
import { SKILLS_TRANSCRIPT, SKILLS_KEYWORD, SKILLS_TIMELINE, SKILLS_FACE, SKILLS_STATUS, SKILLS_ERROR_UNKNOWN } from '../../../constants';
/**
 * Get ths skill interaction target based on card type
 *
 * @param {Object} card - skill card
 * @return {string} - interaction target
 */
const getCardInteractionTarget = ({
  skill_card_type
}) => {
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
const getCardTitle = ({
  skill_card_type,
  skill_card_title = {}
}) => {
  const {
    code,
    message
  } = skill_card_title;
  const defaultKey = `${skill_card_type}Skill`;
  const defaultMessage = messages[defaultKey] || messages.defaultSkill;
  switch (code) {
    case 'skills_faces':
      return /*#__PURE__*/React.createElement(FormattedMessage, messages.faceSkill);
    case 'skills_transcript':
      return /*#__PURE__*/React.createElement(FormattedMessage, messages.transcriptSkill);
    case 'skills_topics':
      return /*#__PURE__*/React.createElement(FormattedMessage, messages.topicsSkill);
    case 'skills_status':
      return /*#__PURE__*/React.createElement(FormattedMessage, messages.statusSkill);
    case 'skills_error':
      return /*#__PURE__*/React.createElement(FormattedMessage, messages.error);
    default:
      return message || /*#__PURE__*/React.createElement(FormattedMessage, defaultMessage);
  }
};
const SidebarSkills = ({
  file,
  cards,
  errors,
  getViewer,
  onSkillChange
}) => {
  const {
    permissions = {}
  } = file;
  const isSkillEditable = !!permissions.can_upload;
  return cards.map((card, index) => {
    if (card.error && !card.status) {
      card.skill_card_type = SKILLS_STATUS;
      card.status = {
        code: SKILLS_ERROR_UNKNOWN
      };
      delete card.error;
    }
    const {
      id
    } = card;
    const cardId = id || uniqueId('card_');
    const isValid = isValidSkillsCard(file, card);
    const interactionTarget = getCardInteractionTarget(card);
    const title = getCardTitle(card);
    const hasEntries = Array.isArray(card.entries) ? card.entries.length > 0 : isValid;
    return isValid ? /*#__PURE__*/React.createElement(SidebarSection, {
      key: cardId,
      interactionTarget: interactionTarget,
      isOpen: hasEntries,
      title: title
    }, /*#__PURE__*/React.createElement(SidebarSkillsCard, {
      card: card,
      cards: cards,
      getViewer: getViewer,
      hasError: !!errors[index],
      isEditable: isSkillEditable,
      onSkillChange: (...args) => onSkillChange(index, ...args)
    })) : null;
  });
};
export default SidebarSkills;
//# sourceMappingURL=SidebarSkills.js.map