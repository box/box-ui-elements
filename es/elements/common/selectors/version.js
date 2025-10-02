const _excluded = ["name", "id"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import { PLACEHOLDER_USER, VERSION_DELETE_ACTION, VERSION_PROMOTE_ACTION, VERSION_RESTORE_ACTION, VERSION_UPLOAD_ACTION } from '../../../constants';
const getVersionAction = ({
  restored_at,
  trashed_at,
  version_promoted
}) => {
  let action = VERSION_UPLOAD_ACTION;
  if (trashed_at) {
    action = VERSION_DELETE_ACTION;
  }
  if (restored_at) {
    action = VERSION_RESTORE_ACTION;
  }
  if (version_promoted) {
    action = VERSION_PROMOTE_ACTION;
  }
  return action;
};
const getVersionUser = ({
  modified_by,
  promoted_by,
  restored_by,
  trashed_by,
  uploader_display_name
}) => {
  const _ref = restored_by || trashed_by || promoted_by || modified_by || PLACEHOLDER_USER,
    {
      name,
      id
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  const isAnonymous = id === PLACEHOLDER_USER.id;
  return _objectSpread(_objectSpread({}, rest), {}, {
    id,
    name: isAnonymous && uploader_display_name ? uploader_display_name : name
  });
};
export default {
  getVersionAction,
  getVersionUser
};
//# sourceMappingURL=version.js.map