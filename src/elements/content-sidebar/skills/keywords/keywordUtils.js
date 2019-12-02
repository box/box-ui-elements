/**
 * @flow
 * @file Utilities for keywords skill
 * @author Box
 */

import type { Pill } from './flowTypes';
import type { SkillCardEntry } from '../../../../common/types/skills';

/**
 * Converts skill card entries into pills
 *
 * @private
 * @param {Array<Object>} props - keyword entries
 * @return {Array<Object>} pills
 */
const getPills = (keywords: Array<SkillCardEntry> = []): Array<Pill> =>
    keywords.map((keyword: SkillCardEntry, index: number): Pill => ({
        displayText: ((keyword.text: any): string),
        value: index,
    }));

export default getPills;
