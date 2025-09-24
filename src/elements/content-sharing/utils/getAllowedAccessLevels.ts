import { ACCESS_COLLAB, ACCESS_COMPANY, ACCESS_OPEN } from '../../../constants';

export const getAllowedAccessLevels = (levels?: Array<string>): Array<string> | null => {
    if (!levels) return [ACCESS_OPEN, ACCESS_COMPANY, ACCESS_COLLAB];

    const allowedAccessLevels = [];
    levels.forEach(level => {
        allowedAccessLevels.push(level);
    });

    return allowedAccessLevels;
};
