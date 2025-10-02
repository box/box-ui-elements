/**
 * @flow
 * @file Skills utils
 * @author Box
 */

import getProp from 'lodash/get';
import type { SkillCard } from '../../../common/types/skills';
import type { BoxItem } from '../../../common/types/core';

/**
 * Returns true if its a valid skills card.
 *
 * @param {SkillCard} card - box skill card
 * @return {boolean} if its valid skills card
 */
const isValidSkillsCard = (file: BoxItem, card: SkillCard): boolean => {
    const fileVersion = getProp(file, 'file_version.id');
    const skillCardFileVersion = card.file_version ? card.file_version.id : fileVersion;
    return fileVersion === skillCardFileVersion && (!!card.status || Array.isArray(card.entries));
};

/**
 * Returns true if there are valid skills to show.
 *
 * @param {BoxItem} file - box file
 * @return {boolean} if there are valid skills to show
 */
const hasSkills = (file: BoxItem): boolean => {
    const cards = getProp(file, 'metadata.global.boxSkillsCards.cards', []);
    return Array.isArray(cards) && cards.length > 0 && cards.some(card => isValidSkillsCard(file, card));
};

export { hasSkills, isValidSkillsCard };
