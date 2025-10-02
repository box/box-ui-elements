function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Sidebar file properties component
 * @author Box
 */

import * as React from 'react';
import getProp from 'lodash/get';
import { injectIntl } from 'react-intl';
import ItemProperties from '../../features/item-details/ItemProperties';
import LoadingIndicatorWrapper from '../../components/loading-indicator/LoadingIndicatorWrapper';
import getFileSize from '../../utils/getFileSize';
import { INTERACTION_TARGET, DETAILS_TARGETS } from '../common/interactionTargets';
import withErrorHandling from './withErrorHandling';
import { FIELD_METADATA_ARCHIVE, PLACEHOLDER_USER } from '../../constants';
const SidebarFileProperties = ({
  file,
  onDescriptionChange,
  hasRetentionPolicy,
  retentionPolicy,
  onRetentionPolicyExtendClick,
  isLoading,
  intl
}) => {
  const archiveDate = getProp(file, FIELD_METADATA_ARCHIVE)?.archiveDate;
  return /*#__PURE__*/React.createElement(LoadingIndicatorWrapper, {
    isLoading: isLoading
  }, /*#__PURE__*/React.createElement(ItemProperties, {
    archivedAt: archiveDate && Number(archiveDate),
    createdAt: file.content_created_at,
    description: file.description,
    descriptionTextareaProps: {
      [INTERACTION_TARGET]: DETAILS_TARGETS.DESCRIPTION
    },
    modifiedAt: file.content_modified_at,
    onDescriptionChange: getProp(file, 'permissions.can_rename') ? onDescriptionChange : undefined,
    owner: getProp(file, 'owned_by.name'),
    retentionPolicyProps: hasRetentionPolicy ? _objectSpread(_objectSpread({}, retentionPolicy), {}, {
      openModal: onRetentionPolicyExtendClick
    }) : {},
    size: getFileSize(file.size, intl.locale)
    // use uploader_display_name if uploaded anonymously
    ,
    uploader: getProp(file, 'created_by.id') === PLACEHOLDER_USER.id ? getProp(file, 'uploader_display_name') : getProp(file, 'created_by.name')
  }));
};
export { SidebarFileProperties as SidebarFilePropertiesComponent };
export default injectIntl(withErrorHandling(SidebarFileProperties));
//# sourceMappingURL=SidebarFileProperties.js.map