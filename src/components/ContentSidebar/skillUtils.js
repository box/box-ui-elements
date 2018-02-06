/**
 * @flow
 * @file Skills utils
 * @author Box
 */

import getProp from 'lodash/get';
import type { BoxItem } from '../../flowTypes';

/**
 * Returns true if there are valid skills to show.
 *
 * @param {BoxItem} file - box file
 * @return {boolean} if there are valid skills to show
 */
const hasSkills = (file: BoxItem): boolean => {
    const cards = getProp(file, 'metadata.global.boxSkillsCards.cards', []);
    return (
        Array.isArray(cards) &&
        cards.length > 0 &&
        cards.every((card) => !!card.error || (Array.isArray(card.entries) && card.entries.length > 0))
    );
};

export default hasSkills;
