import React, { useState } from 'react';
import noop from 'lodash/noop';
import API from '../../../api';
/**
 * Generate the sendInvites() function, which is used for inviting collaborators in the USM.
 *
 * @param {API} api
 * @param {string} itemID
 * @param {ItemType} itemType
 * @param {UseInvitesOptions} options
 */
function useInvites(api, itemID, itemType, options) {
  const [sendInvites, setSendInvites] = useState(null);
  const {
    handleSuccess = noop,
    handleError = noop,
    setIsLoading = noop,
    transformRequest,
    transformResponse = arg => arg
  } = options;
  React.useEffect(() => {
    if (sendInvites) return;
    const itemData = {
      id: itemID,
      type: itemType
    };
    const sendCollabRequest = collab => {
      setIsLoading(true);
      return api.getCollaborationsAPI(false).addCollaboration(itemData, collab, response => {
        handleSuccess(response);
        return transformResponse(response);
      }, handleError);
    };
    const createPostCollaborationFn = () => async collabRequest => {
      if (!transformRequest) return Promise.resolve(null);
      const {
        users,
        groups
      } = transformRequest(collabRequest);
      return Promise.all([users.map(user => sendCollabRequest(user)), groups.map(group => sendCollabRequest(group))]);
    };
    if (!sendInvites) {
      setSendInvites(createPostCollaborationFn);
    }
  }, [api, handleError, handleSuccess, itemID, itemType, sendInvites, setIsLoading, transformRequest, transformResponse]);
  return sendInvites;
}
export default useInvites;
//# sourceMappingURL=useInvites.js.map