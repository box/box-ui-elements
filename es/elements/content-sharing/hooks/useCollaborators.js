import * as React from 'react';
import noop from 'lodash/noop';
import API from '../../../api';
import { TYPE_FILE, TYPE_FOLDER } from '../../../constants';
/**
 * Get the item's collaborators
 *
 * A note on the wording: the USM uses the term "collaborators" internally,
 * so the state variable and state setting function also refer to "collaborators."
 * However, we are using the Collaborations API here, so the API-related functions
 * use the term "collaborations." For more details, see ./api/FileCollaborations.
 *
 * @param {API} api
 * @param {string} itemID
 * @param {ItemType} itemType
 * @param {ContentSharingHooksOptions} options
 * @returns {Collaborations | null}
 */
function useCollaborators(api, itemID, itemType, options) {
  const [collaboratorsList, setCollaboratorsList] = React.useState(null);
  const {
    handleSuccess = noop,
    handleError = noop
  } = options;
  React.useEffect(() => {
    if (collaboratorsList) return;
    const handleGetCollaborationsSuccess = response => {
      setCollaboratorsList(response);
      handleSuccess(response);
    };
    const handleGetCollaborationsError = () => {
      setCollaboratorsList({
        entries: [],
        next_marker: null
      });
      handleError();
    };
    let collabAPIInstance;
    if (itemType === TYPE_FILE) {
      collabAPIInstance = api.getFileCollaborationsAPI(false);
    } else if (itemType === TYPE_FOLDER) {
      collabAPIInstance = api.getFolderCollaborationsAPI(false);
    }
    if (collabAPIInstance) {
      collabAPIInstance.getCollaborations(itemID, handleGetCollaborationsSuccess, handleGetCollaborationsError);
    }
  }, [api, collaboratorsList, handleError, handleSuccess, itemID, itemType]);
  return collaboratorsList;
}
export default useCollaborators;
//# sourceMappingURL=useCollaborators.js.map