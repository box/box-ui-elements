function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * 
 * @file Classification sidebar component
 * @author Box
 */

import * as React from 'react';
import getProp from 'lodash/get';
import { FormattedMessage } from 'react-intl';
import Classification, { classificationMessages, EditClassificationButton } from '../../features/classification';
import { INTERACTION_TARGET, SECTION_TARGETS } from '../common/interactionTargets';
import Collapsible from '../../components/collapsible';
import { FIELD_PERMISSIONS_CAN_UPLOAD } from '../../constants';
import './SidebarClassification.scss';
const SidebarClassification = ({
  classification,
  file,
  onEdit
}) => {
  const isEditable = !!onEdit && getProp(file, FIELD_PERMISSIONS_CAN_UPLOAD, false);
  const hasClassification = !!getProp(classification, 'name');
  if (!hasClassification && !isEditable) {
    return null;
  }
  return /*#__PURE__*/React.createElement(Collapsible, {
    buttonProps: {
      [INTERACTION_TARGET]: SECTION_TARGETS.CLASSIFICATION
    },
    className: "bcs-SidebarClassification",
    headerActionItems: isEditable ? /*#__PURE__*/React.createElement(EditClassificationButton, {
      className: "bcs-SidebarClassification-edit",
      isEditing: hasClassification,
      onEdit: onEdit
    }) : null,
    title: /*#__PURE__*/React.createElement(FormattedMessage, classificationMessages.classification)
  }, /*#__PURE__*/React.createElement(Classification, _extends({}, classification, {
    messageStyle: "inline"
  })));
};
export default SidebarClassification;
//# sourceMappingURL=SidebarClassification.js.map