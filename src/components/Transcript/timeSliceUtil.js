/**
 * @flow
 * @file Transcript utils
 * @author Box
 */

import type { SkillCardEntryTimeSlice } from '../../flowTypes';

const isValidStartTime = (cellData?: SkillCardEntryTimeSlice[]): boolean =>
    Array.isArray(cellData) && !!cellData[0] && typeof cellData[0].start === 'number';

export default isValidStartTime;
