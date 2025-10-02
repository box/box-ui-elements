function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Activity feed utility methods
 */

import selectors from '../../../common/selectors/version';
import { FEED_ITEM_TYPE_VERSION, PLACEHOLDER_USER, VERSION_UPLOAD_ACTION } from '../../../../constants';
export const ItemTypes = {
  fileVersion: FEED_ITEM_TYPE_VERSION
};
export function collapseFeedState(feedState) {
  if (!feedState) {
    return [];
  }
  return feedState.reduce((collapsedFeedState, feedItem) => {
    const previousFeedItem = collapsedFeedState.pop();
    if (!previousFeedItem) {
      return collapsedFeedState.concat([feedItem]);
    }
    if (feedItem.type === ItemTypes.fileVersion && previousFeedItem.type === ItemTypes.fileVersion && selectors.getVersionAction(feedItem) === VERSION_UPLOAD_ACTION && selectors.getVersionAction(previousFeedItem) === VERSION_UPLOAD_ACTION) {
      const {
        modified_by: tmpModifiedBy,
        versions = [previousFeedItem],
        version_start = parseInt(previousFeedItem.version_number, 10),
        version_end = parseInt(previousFeedItem.version_number, 10)
      } = previousFeedItem;
      const prevModifiedBy = tmpModifiedBy || PLACEHOLDER_USER;
      const {
        modified_by: tmpCurModifiedBy,
        created_at,
        trashed_at,
        id,
        version_number
      } = feedItem;
      const parsedVersionNumber = parseInt(version_number, 10);
      const collaborators = previousFeedItem.collaborators || {
        [prevModifiedBy.id]: _objectSpread({}, prevModifiedBy)
      };
      const modifiedBy = tmpCurModifiedBy || PLACEHOLDER_USER;

      // add collaborators
      // $FlowFixMe
      collaborators[modifiedBy.id] = _objectSpread({}, modifiedBy);
      return collapsedFeedState.concat([{
        collaborators,
        created_at,
        modified_by: modifiedBy,
        trashed_at,
        id,
        type: ItemTypes.fileVersion,
        version_number,
        versions: versions.concat([feedItem]),
        version_start: Math.min(version_start, parsedVersionNumber),
        version_end: Math.max(version_end, parsedVersionNumber)
      }]);
    }
    return collapsedFeedState.concat([previousFeedItem, feedItem]);
  }, []);
}
//# sourceMappingURL=activityFeedUtils.js.map