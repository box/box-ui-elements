import * as React from 'react';
import noop from 'lodash/noop';
import API from '../../../api';
import { FIELD_NAME, FIELD_PERMISSIONS } from '../../../constants';
/**
 * Generate the getContacts() function, which is used for retrieving potential collaborators in the USM.
 *
 * @param {API} api
 * @param {string} itemID
 * @param {ContentSharingHooksOptions} options
 * @returns {GetContactsFnType | null}
 */
function useContacts(api, itemID, options) {
  const [getContacts, setGetContacts] = React.useState(null);
  const {
    handleSuccess = noop,
    handleError = noop,
    transformGroups,
    transformUsers
  } = options;
  React.useEffect(() => {
    if (getContacts) return;
    const resolveAPICall = (resolve, response, transformFn) => {
      handleSuccess(response);
      // A successful API call will always return an entries array, but we still need these checks for Flow purposes
      const entriesExist = response && response.entries && response.entries.length;
      if (transformFn && entriesExist) {
        return resolve(transformFn(response));
      }
      const emptyEntries = [];
      return resolve(response && response.entries ? response.entries : emptyEntries);
    };
    const updatedGetContactsFn = () => filterTerm => {
      const getUsers = new Promise(resolve => {
        api.getMarkerBasedUsersAPI(false).getUsersInEnterprise(itemID, response => resolveAPICall(resolve, response, transformUsers), handleError, {
          filter_term: filterTerm
        });
      });
      const getGroups = new Promise(resolve => {
        api.getMarkerBasedGroupsAPI(false).getGroupsInEnterprise(itemID, response => resolveAPICall(resolve, response, transformGroups), handleError, {
          fields: [FIELD_NAME, FIELD_PERMISSIONS].toString(),
          filter_term: filterTerm
        });
      });
      return Promise.all([getUsers, getGroups]).then(contactArrays => [...contactArrays[0], ...contactArrays[1]]);
    };
    setGetContacts(updatedGetContactsFn);
  }, [api, getContacts, handleError, handleSuccess, itemID, transformGroups, transformUsers]);
  return getContacts;
}
export default useContacts;
//# sourceMappingURL=useContacts.js.map