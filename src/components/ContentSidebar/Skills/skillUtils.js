/**
 * @flow
 * @file Skills utils
 * @author Box
 */

import getProp from 'lodash/get';

/**
 * Returns true if its a valid skills card.
 *
 * @param {SkillCard} card - box skill card
 * @return {boolean} if its valid skills card
 */
const isValidSkillsCard = (card: SkillCard): boolean =>
    !!card.error || (Array.isArray(card.entries) && card.entries.length > 0);

/**
 * Returns true if there are valid skills to show.
 *
 * @param {BoxItem} file - box file
 * @return {boolean} if there are valid skills to show
 */
const hasSkills = (file: BoxItem): boolean => {
    const cards = getProp(file, 'metadata.global.boxSkillsCards.cards', []);
    return Array.isArray(cards) && cards.length > 0 && cards.some((card) => isValidSkillsCard(card));
};

export { hasSkills, isValidSkillsCard };
