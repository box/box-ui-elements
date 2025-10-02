import { ACCESS_COLLAB, ACCESS_COMPANY, ACCESS_OPEN } from '../../../constants';
export const getAllowedAccessLevels = levels => {
  if (!levels) return [ACCESS_OPEN, ACCESS_COMPANY, ACCESS_COLLAB];
  return [...levels];
};
//# sourceMappingURL=getAllowedAccessLevels.js.map