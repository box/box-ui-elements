import type { AccessLevel, AccessLevelType } from '@box/unified-share-modal';

import { ACCESS_COLLAB, ACCESS_COMPANY, ACCESS_OPEN } from '../../../constants';
import { ANYONE_IN_COMPANY, ANYONE_WITH_LINK, PEOPLE_IN_ITEM } from '../constants';

import type { accessLevelsDisabledReasonType } from '../../../features/unified-share-modal/flowTypes';

export const API_TO_USM_ACCESS_LEVEL_MAP = {
    [ACCESS_COMPANY]: ANYONE_IN_COMPANY,
    [ACCESS_OPEN]: ANYONE_WITH_LINK,
    [ACCESS_COLLAB]: PEOPLE_IN_ITEM,
};

export const getAllowedAccessLevels = (
    levels?: AccessLevelType[],
    disabledReasons?: accessLevelsDisabledReasonType,
): (AccessLevel | AccessLevelType)[] | null => {
    if (!levels) {
        levels = [ACCESS_OPEN, ACCESS_COMPANY, ACCESS_COLLAB];
    }

    return levels.map(level => {
        const apiLevel = API_TO_USM_ACCESS_LEVEL_MAP[level];
        const disabledReason = disabledReasons?.[apiLevel];

        if (disabledReason) {
            return {
                id: level as AccessLevelType,
                disabledReason,
            };
        }

        return level;
    });
};
