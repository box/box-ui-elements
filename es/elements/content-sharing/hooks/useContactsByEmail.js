import * as React from 'react';
import noop from 'lodash/noop';
import API from '../../../api';
/**
 * Generate the getContactsByEmail() function, which is used for looking up contacts added to the collaborators field in the USM.
 *
 * @param {API} api
 * @param {string} itemID
 * @param {ContentSharingHooksOptions} options
 * @returns {GetContactsByEmailFnType | null}
 */
function useContactsByEmail(api, itemID, options) {
  const [getContactsByEmail, setGetContactsByEmail] = React.useState(null);
  const {
    handleSuccess = noop,
    handleError = noop,
    transformUsers
  } = options;
  React.useEffect(() => {
    if (getContactsByEmail) return;
    const resolveAPICall = (resolve, response, transformFn) => {
      handleSuccess(response);
      // A successful API call will always return an entries array, but we still need these checks for Flow purposes
      if (response && response.entries && response.entries.length) {
        return resolve(transformFn ? transformFn(response) : response.entries);
      }
      return resolve({});
    };
    const updatedGetContactsByEmailFn = () => filterTerm => {
      if (!filterTerm || !Array.isArray(filterTerm.emails) || !filterTerm.emails.length) {
        return Promise.resolve({});
      }
      const parsedFilterTerm = filterTerm.emails[0];
      return new Promise(resolve => {
        api.getMarkerBasedUsersAPI(false).getUsersInEnterprise(itemID, response => resolveAPICall(resolve, response, transformUsers), handleError, {
          filter_term: parsedFilterTerm
        });
      });
    };
    setGetContactsByEmail(updatedGetContactsByEmailFn);
  }, [api, getContactsByEmail, handleError, handleSuccess, itemID, transformUsers]);
  return getContactsByEmail;
}
export default useContactsByEmail;
//# sourceMappingURL=useContactsByEmail.js.map