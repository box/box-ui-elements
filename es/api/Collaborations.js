function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Helper for the Box Collaborations API
 * @author Box
 *
 * The Collaborations API is different from the other APIs related to collaborations/collaborators.
 * - The Item Collaborations (File Collaborations and Folder Collaborations) API only accepts GET requests for a single item;
 *   it returns an object containing all the users who are collaborated on that item.
 * - The File Collaborators API is used exclusively in the ContentSidebar UI Element.
 * - This API enables CRUD actions on a single collaboration for a single item. For more information, see the API docs at
 *   https://developer.box.com/reference/resources/collaboration/.
 */

import Base from './Base';
class Collaborations extends Base {
  constructor(...args) {
    super(...args);
    /**
     * Add a collaboration for a single user or a single group to a file or folder.
     * Users can be added by ID or login (email); groups can only be added by ID.
     *
     * @param {BoxItem} item
     * @param {$Shape<Collaboration>} collaboration
     * @param {(data?: Object) => void} successCallback
     * @param {ElementsErrorCallback} errorCallback
     */
    _defineProperty(this, "addCollaboration", (item, collaboration, successCallback, errorCallback) => {
      const {
        id
      } = item;
      this.post({
        id,
        data: {
          data: _objectSpread({
            item
          }, collaboration)
        },
        errorCallback,
        successCallback,
        url: this.getUrl()
      });
    });
  }
  /**
   * API URL for collaborations
   *
   * @return {string} Base URL for collaborations
   */
  getUrl() {
    return `${this.getBaseApiUrl()}/collaborations`;
  }
}
export default Collaborations;
//# sourceMappingURL=Collaborations.js.map