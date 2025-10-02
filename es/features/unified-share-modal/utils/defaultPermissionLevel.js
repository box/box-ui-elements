import { EDITOR } from '../constants';
const getDefaultPermissionLevel = inviteePermissions => {
  const defaultLevel = inviteePermissions.reduce((defaultValue, currentLevel) => {
    return currentLevel.default ? currentLevel.value : defaultValue;
  }, EDITOR);
  return defaultLevel;
};
export default getDefaultPermissionLevel;
//# sourceMappingURL=defaultPermissionLevel.js.map