/**
 * @flow
 * @file Transcript utils
 * @author Box
 */
import type { SkillCardEntryTimeSlice } from '../../../../common/types/skills';

/**
 * Returns true if there is a valid start time
 *
 * @param {SkillCardEntryTimeSlice} timeslices - skill entry time slice
 * @return {boolean} if there is a valid start time
 */
const isValidStartTime = (timeslice: SkillCardEntryTimeSlice): boolean =>
    !!timeslice && typeof timeslice.start === 'number';

/**
 * Returns true if there is a valid time slice with valid start time
 *
 * @param {SkillCardEntryTimeSlice[]} timeslices - skill entry time slice
 * @return {boolean} if it is a valid time slice
 */
const isValidTimeSlice = (timeslices?: SkillCardEntryTimeSlice[]): boolean =>
    Array.isArray(timeslices) && isValidStartTime(timeslices[0]);

export { isValidTimeSlice, isValidStartTime };
