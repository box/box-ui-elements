/**
 * @flow
 * @file Transcript utils
 * @author Box
 */

import type { SkillCardEntryTimeSlice } from '../../flowTypes';

/**
 * Returns true if there is a valid start time
 *
 * @param {SkillCardEntrytimeslices} timeslices - skill entry time slice
 * @return {boolean} if there are valid skills to show
 */
const isValidStartTime = (timeslices?: SkillCardEntryTimeSlice[]): boolean =>
    Array.isArray(timeslices) && !!timeslices[0] && typeof timeslices[0].start === 'number';

export default isValidStartTime;
