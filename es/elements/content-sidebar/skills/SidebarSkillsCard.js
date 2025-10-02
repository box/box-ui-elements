/**
 * 
 * @file Skills card component
 * @author Box
 */

import * as React from 'react';
import Status from './status';
import Transcript from './transcript';
import Keywords from './keywords';
import Faces from './faces';
import { SKILLS_TRANSCRIPT, SKILLS_KEYWORD, SKILLS_TIMELINE, SKILLS_FACE, SKILLS_STATUS } from '../../../constants';
const SidebarSkillsCard = ({
  card,
  cards,
  hasError,
  isEditable,
  onSkillChange,
  getViewer
}) => {
  switch (card.skill_card_type) {
    case SKILLS_KEYWORD:
      return /*#__PURE__*/React.createElement(Keywords, {
        card: card,
        getViewer: getViewer,
        hasError: hasError,
        isEditable: isEditable,
        onSkillChange: onSkillChange,
        transcript: isEditable ? cards.find(({
          skill_card_type
        }) => skill_card_type === SKILLS_TRANSCRIPT) : undefined
      });
    case SKILLS_TIMELINE:
    case SKILLS_FACE:
      return /*#__PURE__*/React.createElement(Faces, {
        card: card,
        getViewer: getViewer,
        hasError: hasError,
        isEditable: isEditable,
        onSkillChange: onSkillChange
      });
    case SKILLS_TRANSCRIPT:
      return /*#__PURE__*/React.createElement(Transcript, {
        card: card,
        getViewer: getViewer,
        hasError: hasError,
        isEditable: isEditable,
        onSkillChange: onSkillChange
      });
    case SKILLS_STATUS:
      return /*#__PURE__*/React.createElement(Status, {
        card: card
      });
    default:
      return null;
  }
};
export default SidebarSkillsCard;
//# sourceMappingURL=SidebarSkillsCard.js.map