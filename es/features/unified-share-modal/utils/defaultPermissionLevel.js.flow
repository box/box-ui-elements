// @flow
import { EDITOR } from '../constants';

const getDefaultPermissionLevel = (inviteePermissions: Array<any>) => {
    const defaultLevel = inviteePermissions.reduce((defaultValue, currentLevel) => {
        return currentLevel.default ? currentLevel.value : defaultValue;
    }, EDITOR);
    return defaultLevel;
};

export default getDefaultPermissionLevel;
