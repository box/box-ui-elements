import * as React from 'react';
import API from '../../../api';
/**
 * Generate a map of avatar URLs, which are used to display collaborators in the USM.
 *
 * @param {API} api
 * @param {string} itemID
 * @param {Collaborations | null} collaboratorsList
 * @returns {AvatarURLMap | null}
 */
function useAvatars(api, itemID, collaboratorsList) {
  const [avatarURLMap, setAvatarURLMap] = React.useState(null);
  React.useEffect(() => {
    if (avatarURLMap || !collaboratorsList || !collaboratorsList.entries) return;
    const usersAPI = api.getUsersAPI(false);
    (async () => {
      const retrievedAvatarURLMap = {};
      const entries = collaboratorsList ? collaboratorsList.entries : []; // needed for Flow
      await Promise.all(entries.map(async collab => {
        if (!collab || !collab.accessible_by) return;
        const {
          accessible_by: {
            id: userID
          }
        } = collab;
        const url = await usersAPI.getAvatarUrlWithAccessToken(userID.toString(), itemID);
        retrievedAvatarURLMap[userID] = url;
      }));
      setAvatarURLMap(retrievedAvatarURLMap);
    })();
  }, [api, avatarURLMap, collaboratorsList, itemID]);
  return avatarURLMap;
}
export default useAvatars;
//# sourceMappingURL=useAvatars.js.map