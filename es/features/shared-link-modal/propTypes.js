import PropTypes from 'prop-types';
import { CAN_EDIT, CAN_VIEW, PEOPLE_WITH_LINK, PEOPLE_IN_COMPANY, PEOPLE_IN_ITEM } from './constants';
const accessLevelPropType = PropTypes.oneOf([PEOPLE_WITH_LINK, PEOPLE_IN_COMPANY, PEOPLE_IN_ITEM]).isRequired;
const allowedAccessLevelsPropType = PropTypes.shape({
  [PEOPLE_WITH_LINK]: PropTypes.boolean,
  [PEOPLE_IN_COMPANY]: PropTypes.boolean,
  [PEOPLE_IN_ITEM]: PropTypes.boolean
}).isRequired;
const permissionLevelPropType = PropTypes.oneOf([CAN_EDIT, CAN_VIEW]);
export { accessLevelPropType, allowedAccessLevelsPropType, permissionLevelPropType };
//# sourceMappingURL=propTypes.js.map